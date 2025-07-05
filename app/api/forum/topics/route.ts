import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { forumTopics } from "@/lib/db/forum-schema"
import { eq, desc } from "drizzle-orm"
import { apiRateLimit, withRateLimit } from "@/lib/rate-limit"
import { forumTopicSchema, validateRequest, sanitizeText, sanitizeHtml } from "@/lib/validation"
import { getToken } from "next-auth/jwt"

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = withRateLimit(apiRateLimit)(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    // Validate categoryId if provided
    if (categoryId && (isNaN(Number(categoryId)) || Number(categoryId) < 1)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      )
    }

    let query = db.select().from(forumTopics)

    if (categoryId) {
      query = query.where(eq(forumTopics.categoryId, Number.parseInt(categoryId)))
    }

    const topics = await query.orderBy(desc(forumTopics.createdAt))
    
    // Log successful access
    console.log("Forum topics accessed:", {
      categoryId: categoryId || "all",
      topicsCount: topics.length,
      ip: request.headers.get('x-forwarded-for') || request.ip,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(topics)
  } catch (error) {
    console.error("Error fetching forum topics:", error)
    return NextResponse.json(
      { error: "Failed to fetch topics" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = withRateLimit(apiRateLimit)(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    // Check authentication
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input data
    const validation = validateRequest(forumTopicSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: "Invalid topic data", 
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    const { title, content, category, tags } = validation.data

    // Sanitize inputs
    const sanitizedData = {
      title: sanitizeText(title),
      content: sanitizeHtml(content),
      category: category ? sanitizeText(category) : undefined,
      tags: tags?.map(tag => sanitizeText(tag)),
    }

    // Generate slug from title
    const slug = sanitizedData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Check for duplicate slugs
    const existingTopic = await db.select()
      .from(forumTopics)
      .where(eq(forumTopics.slug, slug))
      .limit(1);

    if (existingTopic.length > 0) {
      return NextResponse.json(
        { error: "A topic with this title already exists" },
        { status: 409 }
      )
    }

    // Log topic creation attempt
    console.log("Forum topic creation attempt:", {
      authorId: token.id,
      title: sanitizedData.title,
      category: sanitizedData.category,
      ip: request.headers.get('x-forwarded-for') || request.ip,
      timestamp: new Date().toISOString(),
    })

    // Create the topic
    const [topic] = await db.insert(forumTopics).values({
      categoryId: 1, // Default category - should be dynamic based on category param
      title: sanitizedData.title,
      slug: slug,
      content: sanitizedData.content,
      authorId: token.id as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning()

    // Log successful creation
    console.log("Forum topic created successfully:", {
      topicId: topic.id,
      authorId: token.id,
      title: topic.title,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error("Error creating forum topic:", error)
    
    // Don't leak internal error details
    return NextResponse.json(
      { error: "Failed to create topic" }, 
      { status: 500 }
    )
  }
}
