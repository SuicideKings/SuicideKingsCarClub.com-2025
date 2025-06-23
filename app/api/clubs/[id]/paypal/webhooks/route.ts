import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { clubs, payments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyClubWebhookSignature } from "@/lib/paypal"
import { sendPayPalPaymentSuccessEmail, sendSubscriptionCreatedEmail } from "@/lib/email"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const clubId = Number.parseInt(params.id)
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    // Verify webhook signature using club-specific credentials
    const isValid = await verifyClubWebhookSignature(clubId, headers, body)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different PayPal webhook events for this specific club
    switch (event.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handleClubSubscriptionActivated(clubId, event)
        break

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleClubSubscriptionCancelled(clubId, event)
        break

      case "PAYMENT.SALE.COMPLETED":
        await handleClubPaymentCompleted(clubId, event)
        break

      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        await handleClubPaymentFailed(clubId, event)
        break

      default:
        console.log(`Unhandled PayPal webhook event for club ${clubId}: ${event.event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`Error processing PayPal webhook for club ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

async function handleClubSubscriptionActivated(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerId = event.resource.subscriber?.payer_id
    const payerEmail = event.resource.subscriber?.email_address

    // Update club subscription status
    await db
      .update(clubs)
      .set({
        paypalSubscriptionId: subscriptionId,
        subscriptionStatus: "active",
        nextBillingDate: new Date(event.resource.billing_info?.next_billing_time),
        remindersSent: 0,
      })
      .where(eq(clubs.id, clubId))

    // Send confirmation email
    await sendSubscriptionCreatedEmail(clubId, subscriptionId, event.resource.billing_info?.next_billing_time)
  } catch (error) {
    console.error(`Error handling subscription activated for club ${clubId}:`, error)
  }
}

async function handleClubSubscriptionCancelled(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id

    // Update club subscription status
    await db
      .update(clubs)
      .set({
        subscriptionStatus: "cancelled",
        nextBillingDate: null,
      })
      .where(eq(clubs.id, clubId))
  } catch (error) {
    console.error(`Error handling subscription cancelled for club ${clubId}:`, error)
  }
}

async function handleClubPaymentCompleted(clubId: number, event: any) {
  try {
    const transactionId = event.resource.id
    const amount = event.resource.amount?.total
    const currency = event.resource.amount?.currency
    const payerId = event.resource.payer?.payer_info?.payer_id
    const payerEmail = event.resource.payer?.payer_info?.email

    // Create payment record for this club
    const [payment] = await db
      .insert(payments)
      .values({
        clubId: clubId,
        amount: amount,
        currency: currency,
        status: "completed",
        paypalTransactionId: transactionId,
        paypalPayerId: payerId,
        paypalPayerEmail: payerEmail,
        paymentMethod: "paypal",
        paymentType: "subscription",
      })
      .returning()

    // Send payment success email
    await sendPayPalPaymentSuccessEmail(clubId, amount, currency, transactionId)
  } catch (error) {
    console.error(`Error handling payment completed for club ${clubId}:`, error)
  }
}

async function handleClubPaymentFailed(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id

    // Update club subscription status
    await db
      .update(clubs)
      .set({
        subscriptionStatus: "past_due",
      })
      .where(eq(clubs.id, clubId))

    // Send payment failed email (implement this function)
    // await sendPaymentFailedEmail(clubId, ...)
  } catch (error) {
    console.error(`Error handling payment failed for club ${clubId}:`, error)
  }
}
