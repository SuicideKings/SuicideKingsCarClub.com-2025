import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { notifications } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

// Get notifications for a user
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const clubId = searchParams.get("clubId")

    let userNotifications

    if (userId) {
      userNotifications = await db.query.notifications.findMany({
        where: eq(notifications.userId, Number.parseInt(userId)),
        orderBy: [desc(notifications.createdAt)],
        limit: 50,
      })
    } else if (clubId) {
      userNotifications = await db.query.notifications.findMany({
        where: eq(notifications.clubId, Number.parseInt(clubId)),
        orderBy: [desc(notifications.createdAt)],
        limit: 50,
      })
    } else {
      return NextResponse.json({ error: "User ID or Club ID required" }, { status: 400 })
    }

    return NextResponse.json(userNotifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}

// Create new notification
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, clubId, type, title, message } = await request.json()

    if (!type || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [newNotification] = await db
      .insert(notifications)
      .values({
        userId: userId ? Number.parseInt(userId) : null,
        clubId: clubId ? Number.parseInt(clubId) : null,
        type,
        title,
        message,
      })
      .returning()

    return NextResponse.json(newNotification, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
