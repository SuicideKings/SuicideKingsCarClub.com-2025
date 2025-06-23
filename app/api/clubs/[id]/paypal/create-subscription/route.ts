import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClubSubscription } from "@/lib/paypal"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const { planType, subscriberData } = await request.json()

    // Get club details
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    // Determine which plan to use
    const planId = planType === "yearly" ? club.paypalYearlyPlanId : club.paypalMonthlyPlanId

    if (!planId) {
      return NextResponse.json({ error: `${planType} plan not configured for this club` }, { status: 400 })
    }

    // Create subscription using club's PayPal credentials
    const subscription = await createClubSubscription(
      clubId,
      planId,
      subscriberData,
      `${process.env.NEXTAUTH_URL}/api/clubs/${clubId}/paypal/subscription-success`,
      `${process.env.NEXTAUTH_URL}/api/clubs/${clubId}/paypal/subscription-cancel`,
    )

    return NextResponse.json(subscription)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating club subscription:", error)
    }
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
