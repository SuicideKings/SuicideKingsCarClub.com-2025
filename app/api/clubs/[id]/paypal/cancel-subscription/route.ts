import { NextResponse } from "next/server"
import { getClubPayPalAccessToken } from "@/lib/paypal"
import { db } from "@/lib/db"
import { members, paypalTransactions } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { paypalLogger } from "@/lib/paypal-logger"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const clubId = Number.parseInt(params.id)
  
  try {
    const body = await request.json()
    const { subscriptionId } = body

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    // Get PayPal access token for this club
    const accessToken = await getClubPayPalAccessToken(clubId)

    if (!accessToken) {
      await paypalLogger.logApiError(
        clubId, 
        "CANCEL_SUBSCRIPTION", 
        new Error("Failed to obtain PayPal access token"),
        { subscriptionId }
      )
      return NextResponse.json({ error: "PayPal authentication failed" }, { status: 500 })
    }

    // Cancel subscription via PayPal API
    const cancelResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reason: 'Member requested cancellation'
      })
    })

    if (!cancelResponse.ok) {
      const errorData = await cancelResponse.json().catch(() => ({}))
      await paypalLogger.logApiError(
        clubId,
        "CANCEL_SUBSCRIPTION",
        new Error(`PayPal API error: ${cancelResponse.status} ${cancelResponse.statusText}`),
        { subscriptionId, errorData }
      )
      return NextResponse.json({ 
        error: "Failed to cancel subscription with PayPal" 
      }, { status: 500 })
    }

    // Update member subscription status in database
    await db
      .update(members)
      .set({
        subscriptionStatus: "cancelled",
        updatedAt: new Date()
      })
      .where(and(
        eq(members.clubId, clubId),
        eq(members.paypalSubscriptionId, subscriptionId)
      ))

    // Log the cancellation transaction
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: subscriptionId,
        transactionType: "subscription_cancelled",
        amount: "0",
        currency: "USD",
        status: "cancelled",
        description: `Subscription cancelled by member: ${subscriptionId}`,
        metadata: {
          reason: "Member requested cancellation",
          cancelledAt: new Date().toISOString()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })

    await paypalLogger.logTransaction(
      clubId,
      "subscription_cancelled",
      "0",
      "USD",
      true,
      { subscriptionId, reason: "Member requested cancellation" }
    )

    return NextResponse.json({ 
      message: "Subscription cancelled successfully",
      subscriptionId 
    })

  } catch (error) {
    console.error(`Error cancelling subscription for club ${clubId}:`, error)
    
    await paypalLogger.logApiError(
      clubId,
      "CANCEL_SUBSCRIPTION",
      error instanceof Error ? error : new Error("Unknown error"),
      { subscriptionId: body?.subscriptionId }
    )

    return NextResponse.json({ 
      error: "Failed to cancel subscription" 
    }, { status: 500 })
  }
}