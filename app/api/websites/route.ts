import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { websites } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Get all websites for a club
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("clubId")

    if (!clubId) {
      return NextResponse.json({ error: "Club ID required" }, { status: 400 })
    }

    const clubWebsites = await db.query.websites.findMany({
      where: eq(websites.clubId, Number.parseInt(clubId)),
      with: {
        versions: {
          where: (versions, { eq }) => eq(versions.isActive, true),
          limit: 1,
        },
      },
    })

    return NextResponse.json(clubWebsites)
  } catch (error) {
    console.error("Error fetching websites:", error)
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 })
  }
}

// Create new website
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, slug, clubId } = await request.json()

    if (!name || !slug || !clubId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [newWebsite] = await db
      .insert(websites)
      .values({
        name,
        slug,
        clubId: Number.parseInt(clubId),
      })
      .returning()

    return NextResponse.json(newWebsite, { status: 201 })
  } catch (error) {
    console.error("Error creating website:", error)
    return NextResponse.json({ error: "Failed to create website" }, { status: 500 })
  }
}
