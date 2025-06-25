import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { forumTopics } from "@/lib/db/forum-schema"
import { eq, desc } from "drizzle-orm"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")

    let query = db.select().from(forumTopics)

    if (categoryId) {
      query = query.where(eq(forumTopics.categoryId, Number.parseInt(categoryId)))
    }

    const topics = await query.orderBy(desc(forumTopics.createdAt))
    return NextResponse.json(topics)
  } catch (error) {
    console.error("Error fetching forum topics:", error)
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { categoryId, title, slug, content, authorId } = await request.json()

    const [topic] = await db.insert(forumTopics).values({ categoryId, title, slug, content, authorId }).returning()

    return NextResponse.json(topic, { status: 201 })
  } catch (error) {
    console.error("Error creating forum topic:", error)
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 })
  }
}
