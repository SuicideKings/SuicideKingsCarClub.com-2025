import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"

// Get all clubs for admin use
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allClubs = await db
      .select({
        id: clubs.id,
        name: clubs.name,
        slug: clubs.slug,
        description: clubs.description,
        location: clubs.location,
        memberCount: clubs.memberCount,
        isActive: clubs.isActive,
      })
      .from(clubs)
      .where(clubs.isActive)

    return NextResponse.json(allClubs)
  } catch (error) {
    console.error("Error fetching clubs:", error)
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 })
  }
}