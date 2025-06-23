import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createSubscription } from "@/lib/paypal"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clubId, planType, subscriberData } = await request.json()

    if (!clubId || !planType || !subscriberData) {
      return NextResponse.json({ error: "Club ID, plan type, and subscriber data are required" }, { status: 400 })
    }

    // Get club details
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    if (!club.paypalPlanId) {
      return NextResponse.json({ error: "PayPal plan not configured for this club" }, { status: 400 })
    }

    // Create return and cancel URLs
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const returnUrl = `${baseUrl}/api/paypal/subscription-success?clubId=${clubId}`
    const cancelUrl = `${baseUrl}/api/paypal/subscription-cancel?clubId=${clubId}`

    // Create PayPal subscription
    const subscription = await createSubscription(
      club.paypalPlanId,
      subscriberData,
      returnUrl,
      cancelUrl,
      club.paypalClientId,
      club.paypalClientSecret,
    )

    return NextResponse.json({
      subscriptionId: subscription.id,
      approvalUrl: subscription.links.find((link: any) => link.rel === "approve")?.href,
    })
  } catch (error) {
    console.error("Error creating PayPal subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
