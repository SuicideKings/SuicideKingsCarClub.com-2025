import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { getSubscription } from "@/lib/paypal"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("clubId")
    const subscriptionId = searchParams.get("subscription_id")
    const token = searchParams.get("token")

    if (!clubId || !subscriptionId) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment/error?message=Missing parameters`)
    }

    // Get club details
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, Number.parseInt(clubId)),
    })

    if (!club) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment/error?message=Club not found`)
    }

    // Get subscription details from PayPal
    const subscription = await getSubscription(subscriptionId, club.paypalClientId, club.paypalClientSecret)

    // Update club with subscription details
    await db
      .update(clubs)
      .set({
        paypalSubscriptionId: subscriptionId,
        subscriptionStatus: subscription.status.toLowerCase(),
        nextBillingDate: subscription.billing_info?.next_billing_time
          ? new Date(subscription.billing_info.next_billing_time)
          : null,
      })
      .where(eq(clubs.id, Number.parseInt(clubId)))

    // Redirect to success page
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment/success?subscription=${subscriptionId}`)
  } catch (error) {
    console.error("Error handling subscription success:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/payment/error?message=Processing error`)
  }
}
