import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const clubId = Number.parseInt(params.id)
    
    if (isNaN(clubId)) {
      return NextResponse.json({ error: "Invalid club ID" }, { status: 400 })
    }

    // Get club information and PayPal settings
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    
    if (club.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    const paypalSettings = club[0].paypalSettings as any
    const monthlyPlanId = club[0].paypalMonthlyPlanId
    const yearlyPlanId = club[0].paypalYearlyPlanId

    // Default pricing structure
    const plans = []

    // Add monthly plan if configured
    if (monthlyPlanId && paypalSettings?.monthlyPrice) {
      plans.push({
        id: monthlyPlanId,
        name: "Monthly Membership",
        price: paypalSettings.monthlyPrice,
        currency: paypalSettings.currency || "USD",
        interval: "month",
        description: "Full access to club benefits with monthly billing",
        features: [
          "Access to all club events",
          "Member directory access",
          "Exclusive member discounts",
          "Monthly newsletter",
          "Online member portal",
          "Community forum access"
        ]
      })
    }

    // Add yearly plan if configured
    if (yearlyPlanId && paypalSettings?.yearlyPrice) {
      const yearlyDiscount = monthlyPlanId && paypalSettings?.monthlyPrice 
        ? Math.round((1 - (parseFloat(paypalSettings.yearlyPrice) / (parseFloat(paypalSettings.monthlyPrice) * 12))) * 100)
        : 0

      plans.push({
        id: yearlyPlanId,
        name: "Annual Membership",
        price: paypalSettings.yearlyPrice,
        currency: paypalSettings.currency || "USD",
        interval: "year",
        description: yearlyDiscount > 0 
          ? `Full access to club benefits with annual billing - Save ${yearlyDiscount}%!`
          : "Full access to club benefits with annual billing",
        features: [
          "Access to all club events",
          "Member directory access",
          "Exclusive member discounts",
          "Monthly newsletter",
          "Online member portal",
          "Community forum access",
          "Priority event registration",
          yearlyDiscount > 0 ? `Save ${yearlyDiscount}% vs monthly billing` : "Best value option"
        ]
      })
    }

    // Club information
    const clubInfo = {
      id: club[0].id,
      name: club[0].name,
      description: club[0].description,
      location: club[0].location,
      memberCount: club[0].memberCount,
      logoUrl: club[0].logoUrl
    }

    return NextResponse.json({
      club: clubInfo,
      plans,
      paymentMethods: ["paypal"],
      currency: paypalSettings?.currency || "USD",
      hasPayPalSetup: !!(monthlyPlanId || yearlyPlanId)
    })

  } catch (error) {
    console.error("Error fetching club pricing:", error)
    return NextResponse.json(
      { error: "Failed to fetch pricing information" },
      { status: 500 }
    )
  }
}