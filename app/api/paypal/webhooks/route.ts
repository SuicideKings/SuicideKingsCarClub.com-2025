import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { clubs, payments } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { verifyWebhookSignature } from "@/lib/paypal"
import { sendPayPalPaymentSuccessEmail, sendSubscriptionCreatedEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())

    // Get webhook ID from headers or environment
    const webhookId = headers["paypal-webhook-id"] || process.env.PAYPAL_WEBHOOK_ID

    if (!webhookId) {
      return NextResponse.json({ error: "Webhook ID not found" }, { status: 400 })
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(headers, body, webhookId)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    const event = JSON.parse(body)

    // Handle different PayPal webhook events
    switch (event.event_type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await handleSubscriptionActivated(event)
        break

      case "BILLING.SUBSCRIPTION.CANCELLED":
        await handleSubscriptionCancelled(event)
        break

      case "PAYMENT.SALE.COMPLETED":
        await handlePaymentCompleted(event)
        break

      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
        await handlePaymentFailed(event)
        break

      default:
        if (process.env.NODE_ENV === 'development') {
          console.log(`Unhandled PayPal webhook event: ${event.event_type}`)
        }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error processing PayPal webhook:", error)
    }
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

async function handleSubscriptionActivated(event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerId = event.resource.subscriber?.payer_id
    const payerEmail = event.resource.subscriber?.email_address

    // Find club by subscription ID
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.paypalSubscriptionId, subscriptionId),
    })

    if (club) {
      // Update club subscription status
      await db
        .update(clubs)
        .set({
          subscriptionStatus: "active",
          nextBillingDate: new Date(event.resource.billing_info?.next_billing_time),
          remindersSent: 0,
        })
        .where(eq(clubs.id, club.id))

      // Send confirmation email
      await sendSubscriptionCreatedEmail(club.id, subscriptionId, event.resource.billing_info?.next_billing_time)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error handling subscription activated:", error)
    }
  }
}

async function handleSubscriptionCancelled(event: any) {
  try {
    const subscriptionId = event.resource.id

    // Find club by subscription ID
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.paypalSubscriptionId, subscriptionId),
    })

    if (club) {
      // Update club subscription status
      await db
        .update(clubs)
        .set({
          subscriptionStatus: "cancelled",
          nextBillingDate: null,
        })
        .where(eq(clubs.id, club.id))
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error handling subscription cancelled:", error)
    }
  }
}

async function handlePaymentCompleted(event: any) {
  try {
    const transactionId = event.resource.id
    const amount = event.resource.amount?.total
    const currency = event.resource.amount?.currency
    const payerId = event.resource.payer?.payer_info?.payer_id
    const payerEmail = event.resource.payer?.payer_info?.email

    // Create payment record
    const [payment] = await db
      .insert(payments)
      .values({
        clubId: 1, // You'll need to determine the club ID from the transaction
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
    if (payment.clubId) {
      await sendPayPalPaymentSuccessEmail(payment.clubId, amount, currency, transactionId)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error handling payment completed:", error)
    }
  }
}

async function handlePaymentFailed(event: any) {
  try {
    const subscriptionId = event.resource.id

    // Find club by subscription ID
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.paypalSubscriptionId, subscriptionId),
    })

    if (club) {
      // Update club subscription status
      await db
        .update(clubs)
        .set({
          subscriptionStatus: "past_due",
        })
        .where(eq(clubs.id, club.id))

      // Send payment failed email (implement this function)
      // await sendPaymentFailedEmail(club.id, ...)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error handling payment failed:", error)
    }
  }
}
