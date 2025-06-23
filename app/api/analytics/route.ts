import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { members, events, orders } from "@/lib/db/schema"
import { gte, count, sum, avg } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate } = await request.json()

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Get page views (would typically come from analytics service)
    const pageViews = 15420 // Mock data
    const uniqueVisitors = 8750 // Mock data

    // Member activity
    const newMembersResult = await db.select({ count: count() }).from(members).where(gte(members.createdAt, start))

    const totalMembersResult = await db.select({ count: count() }).from(members)

    const activeMembersResult = await db.select({ count: count() }).from(members).where(gte(members.lastLoginAt, start))

    // Event metrics
    const totalEventsResult = await db.select({ count: count() }).from(events).where(gte(events.createdAt, start))

    const averageAttendanceResult = await db
      .select({ avg: avg(events.currentAttendees) })
      .from(events)
      .where(gte(events.eventDate, start))

    const upcomingEventsResult = await db
      .select({ count: count() })
      .from(events)
      .where(gte(events.eventDate, new Date()))

    // Store metrics
    const totalOrdersResult = await db.select({ count: count() }).from(orders).where(gte(orders.createdAt, start))

    const revenueResult = await db
      .select({ sum: sum(orders.totalAmount) })
      .from(orders)
      .where(gte(orders.createdAt, start))

    const analyticsData = {
      pageViews,
      uniqueVisitors,
      memberActivity: {
        newMembers: newMembersResult[0]?.count || 0,
        activeMembers: activeMembersResult[0]?.count || 0,
        memberRetention: totalMembersResult[0]?.count
          ? ((activeMembersResult[0]?.count || 0) / (totalMembersResult[0]?.count || 1)) * 100
          : 0,
      },
      eventMetrics: {
        totalEvents: totalEventsResult[0]?.count || 0,
        averageAttendance: Math.round(Number(averageAttendanceResult[0]?.avg) || 0),
        upcomingEvents: upcomingEventsResult[0]?.count || 0,
      },
      forumActivity: {
        totalPosts: 245, // Mock data - would come from forum tables
        activeTopics: 32,
        newTopics: 8,
      },
      storeMetrics: {
        totalOrders: totalOrdersResult[0]?.count || 0,
        revenue: Number(revenueResult[0]?.sum) || 0,
        topProducts: [
          { name: "SKCC T-Shirt", sales: 45, revenue: 1125 },
          { name: "Continental Pin", sales: 32, revenue: 480 },
          { name: "Club Sticker Pack", sales: 28, revenue: 280 },
        ],
      },
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
