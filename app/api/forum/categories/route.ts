import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { forumCategories } from "@/lib/db/forum-schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const categories = await db.select().from(forumCategories).where(eq(forumCategories.isActive, true))
    return NextResponse.json(categories)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching forum categories:", error)
    }
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description, slug, icon } = await request.json()

    const [category] = await db.insert(forumCategories).values({ name, description, slug, icon }).returning()

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating forum category:", error)
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
