import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

// Get specific club
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    return NextResponse.json(club)
  } catch (error) {
    console.error("Error fetching club:", error)
    return NextResponse.json({ error: "Failed to fetch club" }, { status: 500 })
  }
}

// Update club
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const updateData = await request.json()

    const [updatedClub] = await db
      .update(clubs)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, clubId))
      .returning()

    if (!updatedClub) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    return NextResponse.json(updatedClub)
  } catch (error) {
    console.error("Error updating club:", error)
    return NextResponse.json({ error: "Failed to update club" }, { status: 500 })
  }
}

// Delete club
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)

    await db.delete(clubs).where(eq(clubs.id, clubId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting club:", error)
    return NextResponse.json({ error: "Failed to delete club" }, { status: 500 })
  }
}
