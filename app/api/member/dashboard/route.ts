import { type NextRequest, NextResponse } from "next/server"
import { getMemberFromToken } from "@/lib/member-auth"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { memberCars, events, eventRegistrations, messages } from "@/lib/db/schema"
import { eq, and, gte, count } from "drizzle-orm"

// Initialize database connection only when environment variables are available
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error('No database connection string was provided. Please set DATABASE_URL or NEON_DATABASE_URL environment variable.')
  }
  const sql = neon(databaseUrl)
  return drizzle(sql)
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const member = await getMemberFromToken(token)

    if (!member) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const db = getDatabase()
    // Get member stats
    const [carsCount] = await db.select({ count: count() }).from(memberCars).where(eq(memberCars.memberId, member.id))

    const [eventsAttendedCount] = await db
      .select({ count: count() })
      .from(eventRegistrations)
      .where(and(eq(eventRegistrations.memberId, member.id), eq(eventRegistrations.registrationStatus, "attended")))

    const [upcomingEventsCount] = await db
      .select({ count: count() })
      .from(eventRegistrations)
      .innerJoin(events, eq(events.id, eventRegistrations.eventId))
      .where(and(eq(eventRegistrations.memberId, member.id), gte(events.eventDate, new Date())))

    const [unreadMessagesCount] = await db
      .select({ count: count() })
      .from(messages)
      .where(and(eq(messages.toMemberId, member.id), eq(messages.isRead, false)))

    // Calculate membership days left
    const renewalDate = new Date(member.renewalDate!)
    const today = new Date()
    const membershipDaysLeft = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    // Get upcoming events
    const upcomingEvents = await db
      .select({
        id: events.id,
        title: events.title,
        date: events.eventDate,
        location: events.location,
        isRegistered: eventRegistrations.id,
      })
      .from(events)
      .leftJoin(
        eventRegistrations,
        and(eq(eventRegistrations.eventId, events.id), eq(eventRegistrations.memberId, member.id)),
      )
      .where(gte(events.eventDate, new Date()))
      .orderBy(events.eventDate)
      .limit(5)

    // Get recent activity (mock data for now)
    const recentActivity = [
      {
        id: 1,
        type: "car_added",
        title: "Car Added",
        description: "You added a new car to your collection",
        date: new Date().toISOString(),
        icon: "car",
      },
      {
        id: 2,
        type: "event_registered",
        title: "Event Registration",
        description: "You registered for Summer Cruise",
        date: new Date(Date.now() - 86400000).toISOString(),
        icon: "calendar",
      },
    ]

    const dashboardData = {
      member: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        memberNumber: member.memberNumber,
        membershipStatus: member.membershipStatus,
        membershipType: member.membershipType,
        joinDate: member.joinDate,
        renewalDate: member.renewalDate,
        profileImageUrl: member.profileImageUrl,
      },
      stats: {
        totalCars: carsCount.count,
        eventsAttended: eventsAttendedCount.count,
        upcomingEvents: upcomingEventsCount.count,
        unreadMessages: unreadMessagesCount.count,
        membershipDaysLeft: Math.max(0, membershipDaysLeft),
      },
      recentActivity,
      upcomingEvents: upcomingEvents.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        location: event.location,
        isRegistered: !!event.isRegistered,
      })),
      quickActions: [
        {
          title: "Add Your Car",
          description: "Showcase your Continental",
          href: "/member/cars/add",
          icon: "car",
          color: "red",
        },
        {
          title: "Browse Events",
          description: "Find upcoming meetups",
          href: "/events",
          icon: "calendar",
          color: "blue",
        },
        {
          title: "Visit Store",
          description: "Shop merchandise",
          href: "/store",
          icon: "shopping",
          color: "green",
        },
      ],
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
