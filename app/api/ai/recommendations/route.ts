import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { members, events, products, memberCars } from "@/lib/db/schema"
import { eq, and, gte, desc } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const context = await request.json()
    const { memberId, memberPreferences, memberHistory, currentLocation } = context

    // Get member details
    const member = await db.query.members.findFirst({
      where: eq(members.id, Number.parseInt(memberId)),
    })

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    const recommendations = []

    // Event recommendations based on location and preferences
    const upcomingEvents = await db.query.events.findMany({
      where: gte(events.eventDate, new Date()),
      orderBy: [desc(events.eventDate)],
      limit: 5,
    })

    for (const event of upcomingEvents) {
      let score = 0.5 // Base score
      let reason = "Upcoming event"

      // Boost score based on member's chapter
      if (event.clubId === member.clubId) {
        score += 0.3
        reason = "Event in your chapter"
      }

      // Boost score based on event type preferences
      if (memberPreferences.eventTypes?.includes(event.eventType)) {
        score += 0.2
        reason += " - matches your interests"
      }

      recommendations.push({
        id: `event-${event.id}`,
        type: "event",
        title: event.title,
        description: event.shortDescription || event.description?.substring(0, 100) + "...",
        score,
        reason,
        metadata: {
          eventId: event.id,
          date: event.eventDate,
          location: event.location,
        },
      })
    }

    // Product recommendations based on purchase history
    const popularProducts = await db.query.products.findMany({
      where: eq(products.isActive, true),
      orderBy: [desc(products.createdAt)],
      limit: 3,
    })

    for (const product of popularProducts) {
      let score = 0.4
      let reason = "Popular product"

      // Boost score for member-specific pricing
      if (product.memberPrice && product.memberPrice < product.price) {
        score += 0.2
        reason = "Member discount available"
      }

      recommendations.push({
        id: `product-${product.id}`,
        type: "product",
        title: product.name,
        description: product.shortDescription || product.description?.substring(0, 100) + "...",
        score,
        reason,
        metadata: {
          productId: product.id,
          price: product.price,
          memberPrice: product.memberPrice,
        },
      })
    }

    // Member connection recommendations based on similar cars or location
    const memberCarsData = await db.query.memberCars.findMany({
      where: eq(memberCars.memberId, Number.parseInt(memberId)),
    })

    if (memberCarsData.length > 0) {
      const memberYears = memberCarsData.map((car) => car.year)

      // Find members with similar cars
      const similarMembers = await db.query.members.findMany({
        where: and(
          eq(members.isEmailVerified, true),
          // Add more complex filtering here
        ),
        limit: 3,
      })

      for (const similarMember of similarMembers) {
        if (similarMember.id === Number.parseInt(memberId)) continue

        recommendations.push({
          id: `member-${similarMember.id}`,
          type: "member",
          title: `${similarMember.firstName} ${similarMember.lastName}`,
          description: `Fellow Continental enthusiast in ${similarMember.city || "your area"}`,
          score: 0.6,
          reason: "Similar car interests",
          metadata: {
            memberId: similarMember.id,
            location: similarMember.city,
          },
        })
      }
    }

    // Sort by score and return top recommendations
    const sortedRecommendations = recommendations.sort((a, b) => b.score - a.score).slice(0, 10)

    return NextResponse.json(sortedRecommendations)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Recommendations error:", error)
    }
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
