import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { clubs, payments, paypalWebhookLogs, paypalTransactions, members } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { verifyClubWebhookSignature } from "@/lib/paypal"
import { sendPayPalPaymentSuccessEmail, sendSubscriptionCreatedEmail } from "@/lib/email"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const clubId = Number.parseInt(params.id)
  let webhookLogId: number | null = null
  
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())
    const event = JSON.parse(body)

    // Log the webhook event
    const [webhookLog] = await db
      .insert(paypalWebhookLogs)
      .values({
        clubId,
        webhookId: headers['paypal-transmission-id'] || 'unknown',
        eventType: event.event_type,
        eventData: event,
        processed: false,
        createdAt: new Date()
      })
      .returning()
    
    webhookLogId = webhookLog.id

    // Verify webhook signature using club-specific credentials
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    if (club.length === 0) {
      throw new Error("Club not found")
    }

    const paypalSettings = club[0].paypalSettings as any
    const webhookId = paypalSettings?.webhookId

    if (!webhookId) {
      console.warn(`No webhook ID configured for club ${clubId}`)
    }

    const isValid = verifyClubWebhookSignature(clubId, headers, body, webhookId || '')

    if (!isValid) {
      await db
        .update(paypalWebhookLogs)
        .set({ 
          errorMessage: "Invalid webhook signature",
          processedAt: new Date()
        })
        .where(eq(paypalWebhookLogs.id, webhookLogId))
      
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    // Handle different PayPal webhook events for this specific club
    let processed = false
    let errorMessage: string | null = null

    try {
      switch (event.event_type) {
        case "BILLING.SUBSCRIPTION.ACTIVATED":
          await handleClubSubscriptionActivated(clubId, event)
          processed = true
          break

        case "BILLING.SUBSCRIPTION.CANCELLED":
          await handleClubSubscriptionCancelled(clubId, event)
          processed = true
          break

        case "PAYMENT.SALE.COMPLETED":
          await handleClubPaymentCompleted(clubId, event)
          processed = true
          break

        case "BILLING.SUBSCRIPTION.PAYMENT.FAILED":
          await handleClubPaymentFailed(clubId, event)
          processed = true
          break

        case "BILLING.SUBSCRIPTION.EXPIRED":
          await handleClubSubscriptionExpired(clubId, event)
          processed = true
          break

        case "BILLING.SUBSCRIPTION.SUSPENDED":
          await handleClubSubscriptionSuspended(clubId, event)
          processed = true
          break

        case "BILLING.SUBSCRIPTION.UPDATED":
          await handleClubSubscriptionUpdated(clubId, event)
          processed = true
          break

        case "PAYMENT.CAPTURE.COMPLETED":
          await handleClubPaymentCaptureCompleted(clubId, event)
          processed = true
          break

        case "PAYMENT.CAPTURE.REFUNDED":
          await handleClubPaymentRefunded(clubId, event)
          processed = true
          break

        default:
          console.log(`Unhandled PayPal webhook event for club ${clubId}: ${event.event_type}`)
          processed = true // Mark as processed even if we don't handle it
      }
    } catch (handlingError) {
      errorMessage = handlingError instanceof Error ? handlingError.message : "Unknown error"
      console.error(`Error handling webhook event for club ${clubId}:`, handlingError)
    }

    // Update webhook log with processing status
    await db
      .update(paypalWebhookLogs)
      .set({
        processed,
        processedAt: new Date(),
        errorMessage
      })
      .where(eq(paypalWebhookLogs.id, webhookLogId))

    return NextResponse.json({ received: true, processed })
  } catch (error) {
    console.error(`Error processing PayPal webhook for club ${clubId}:`, error)
    
    // Update webhook log with error if we have the ID
    if (webhookLogId) {
      try {
        await db
          .update(paypalWebhookLogs)
          .set({
            processed: false,
            processedAt: new Date(),
            errorMessage: error instanceof Error ? error.message : "Unknown error"
          })
          .where(eq(paypalWebhookLogs.id, webhookLogId))
      } catch (logError) {
        console.error("Failed to update webhook log:", logError)
      }
    }
    
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

async function handleClubSubscriptionActivated(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerId = event.resource.subscriber?.payer_id
    const payerEmail = event.resource.subscriber?.email_address
    const planId = event.resource.plan_id
    
    // Extract custom data if available (e.g., member ID from custom_id field)
    const customId = event.resource.custom_id
    const startTime = new Date(event.resource.start_time)
    const nextBillingTime = new Date(event.resource.billing_info?.next_billing_time)

    // Check if this is a member subscription (has email)
    if (payerEmail) {
      // Find or update member
      const existingMember = await db
        .select()
        .from(members)
        .where(and(eq(members.email, payerEmail), eq(members.clubId, clubId)))
        .limit(1)

      if (existingMember.length > 0) {
        // Update existing member's subscription
        await db
          .update(members)
          .set({
            paypalSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
            subscriptionStartDate: startTime,
            subscriptionEndDate: nextBillingTime,
            membershipTier: planId.includes("yearly") ? "yearly" : "monthly",
            updatedAt: new Date()
          })
          .where(eq(members.id, existingMember[0].id))
      } else {
        // Create new member if they don't exist
        await db
          .insert(members)
          .values({
            clubId,
            email: payerEmail,
            name: event.resource.subscriber?.name?.given_name + " " + event.resource.subscriber?.name?.surname || "PayPal User",
            paypalSubscriptionId: subscriptionId,
            subscriptionStatus: "active",
            subscriptionStartDate: startTime,
            subscriptionEndDate: nextBillingTime,
            membershipTier: planId.includes("yearly") ? "yearly" : "monthly",
            role: "member",
            createdAt: new Date(),
            updatedAt: new Date()
          })
      }
    }

    // Create PayPal transaction record
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: subscriptionId,
        transactionType: "subscription_activated",
        amount: event.resource.billing_info?.last_payment?.amount?.value || "0",
        currency: event.resource.billing_info?.last_payment?.amount?.currency_code || "USD",
        status: "completed",
        description: `Subscription activated: ${subscriptionId}`,
        metadata: {
          payerId,
          payerEmail,
          planId,
          customId,
          eventType: event.event_type,
          resourceType: event.resource_type
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })

    // Send confirmation email
    if (typeof sendSubscriptionCreatedEmail === 'function') {
      await sendSubscriptionCreatedEmail(clubId, subscriptionId, event.resource.billing_info?.next_billing_time)
    }
  } catch (error) {
    console.error(`Error handling subscription activated for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubSubscriptionCancelled(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerEmail = event.resource.subscriber?.email_address

    // Update member subscription status if email is available
    if (payerEmail) {
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
    }

    // Create cancellation transaction record
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: subscriptionId,
        transactionType: "subscription_cancelled",
        amount: "0",
        currency: "USD",
        status: "cancelled",
        description: `Subscription cancelled: ${subscriptionId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type,
          resourceType: event.resource_type,
          cancellationTime: new Date().toISOString()
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
  } catch (error) {
    console.error(`Error handling subscription cancelled for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubPaymentCompleted(clubId: number, event: any) {
  try {
    const transactionId = event.resource.id
    const amount = event.resource.amount?.total || event.resource.amount?.value
    const currency = event.resource.amount?.currency || event.resource.amount?.currency_code
    const payerId = event.resource.payer?.payer_info?.payer_id || event.resource.payer?.payer_id
    const payerEmail = event.resource.payer?.payer_info?.email || event.resource.payer?.email_address

    // Create PayPal transaction record
    const [transaction] = await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: transactionId,
        transactionType: "payment",
        amount: amount,
        currency: currency,
        status: "completed",
        description: `Payment completed for club ${clubId}`,
        metadata: {
          payerId,
          payerEmail,
          eventType: event.event_type,
          resourceType: event.resource_type
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    // Also create legacy payment record for backwards compatibility
    await db
      .insert(payments)
      .values({
        clubId: clubId,
        amount: amount,
        currency: currency,
        status: "completed",
        paypalOrderId: transactionId,
        description: `Payment completed for club ${clubId}`,
        paymentMethod: "paypal",
        metadata: {
          payerId,
          payerEmail,
          paypalTransactionId: transaction.id
        }
      })

    // Send payment success email
    if (typeof sendPayPalPaymentSuccessEmail === 'function') {
      await sendPayPalPaymentSuccessEmail(clubId, amount, currency, transactionId)
    }
  } catch (error) {
    console.error(`Error handling payment completed for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubPaymentFailed(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerEmail = event.resource.subscriber?.email_address

    // Update member subscription status
    if (payerEmail) {
      await db
        .update(members)
        .set({
          subscriptionStatus: "past_due",
          updatedAt: new Date()
        })
        .where(and(
          eq(members.clubId, clubId),
          eq(members.paypalSubscriptionId, subscriptionId)
        ))
    }

    // Log failed payment
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: event.resource.id,
        transactionType: "payment_failed",
        amount: event.resource.amount?.value || "0",
        currency: event.resource.amount?.currency_code || "USD",
        status: "failed",
        description: `Payment failed for subscription: ${subscriptionId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type,
          failureReason: event.resource.status_details?.reason
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })

    // Send payment failed email to member
    if (payerEmail && event.resource.amount) {
      const { sendPayPalPaymentFailedEmail } = await import('@/lib/email')
      await sendPayPalPaymentFailedEmail(
        clubId,
        payerEmail,
        subscriptionId,
        event.resource.amount.value || '0.00',
        event.resource.amount.currency_code || 'USD',
        event.resource.status_details?.reason || 'Payment processing failed'
      )
    }
  } catch (error) {
    console.error(`Error handling payment failed for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubSubscriptionExpired(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerEmail = event.resource.subscriber?.email_address

    // Update member subscription status
    if (payerEmail) {
      await db
        .update(members)
        .set({
          subscriptionStatus: "expired",
          updatedAt: new Date()
        })
        .where(and(
          eq(members.clubId, clubId),
          eq(members.paypalSubscriptionId, subscriptionId)
        ))
    }

    // Log expiration
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: subscriptionId,
        transactionType: "subscription_expired",
        amount: "0",
        currency: "USD",
        status: "expired",
        description: `Subscription expired: ${subscriptionId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
  } catch (error) {
    console.error(`Error handling subscription expired for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubSubscriptionSuspended(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerEmail = event.resource.subscriber?.email_address

    // Update member subscription status
    if (payerEmail) {
      await db
        .update(members)
        .set({
          subscriptionStatus: "suspended",
          updatedAt: new Date()
        })
        .where(and(
          eq(members.clubId, clubId),
          eq(members.paypalSubscriptionId, subscriptionId)
        ))
    }

    // Log suspension
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: subscriptionId,
        transactionType: "subscription_suspended",
        amount: "0",
        currency: "USD",
        status: "suspended",
        description: `Subscription suspended: ${subscriptionId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type,
          suspendReason: event.resource.status_details?.reason
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
  } catch (error) {
    console.error(`Error handling subscription suspended for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubSubscriptionUpdated(clubId: number, event: any) {
  try {
    const subscriptionId = event.resource.id
    const payerEmail = event.resource.subscriber?.email_address
    const planId = event.resource.plan_id

    // Update member subscription details
    if (payerEmail) {
      await db
        .update(members)
        .set({
          membershipTier: planId?.includes("yearly") ? "yearly" : "monthly",
          updatedAt: new Date()
        })
        .where(and(
          eq(members.clubId, clubId),
          eq(members.paypalSubscriptionId, subscriptionId)
        ))
    }

    // Log update
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: subscriptionId,
        transactionType: "subscription_updated",
        amount: "0",
        currency: "USD",
        status: "updated",
        description: `Subscription updated: ${subscriptionId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type,
          newPlanId: planId
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
  } catch (error) {
    console.error(`Error handling subscription updated for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubPaymentCaptureCompleted(clubId: number, event: any) {
  try {
    const captureId = event.resource.id
    const amount = event.resource.amount?.value
    const currency = event.resource.amount?.currency_code
    const payerEmail = event.resource.payer?.email_address

    // Similar to payment completed but for capture events
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: captureId,
        transactionType: "capture_completed",
        amount: amount || "0",
        currency: currency || "USD",
        status: "completed",
        description: `Payment capture completed: ${captureId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type,
          invoiceId: event.resource.invoice_id
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })
  } catch (error) {
    console.error(`Error handling payment capture for club ${clubId}:`, error)
    throw error
  }
}

async function handleClubPaymentRefunded(clubId: number, event: any) {
  try {
    const refundId = event.resource.id
    const amount = event.resource.amount?.value
    const currency = event.resource.amount?.currency_code
    const payerEmail = event.resource.payer?.email_address

    // Log refund
    await db
      .insert(paypalTransactions)
      .values({
        clubId,
        paypalPaymentId: refundId,
        transactionType: "refund",
        amount: amount || "0",
        currency: currency || "USD",
        status: "refunded",
        description: `Payment refunded: ${refundId}`,
        metadata: {
          payerEmail,
          eventType: event.event_type,
          refundReason: event.resource.reason
        },
        createdAt: new Date(),
        updatedAt: new Date()
      })

    // Update member status based on refund
    if (payerEmail) {
      const { members } = await import('@/lib/db/schema')
      const { eq, and } = await import('drizzle-orm')
      
      // Find member by email and club
      const member = await db.query.members.findFirst({
        where: and(
          eq(members.email, payerEmail),
          eq(members.clubId, clubId)
        )
      })

      if (member) {
        // Update member status to reflect refund
        await db
          .update(members)
          .set({
            membershipStatus: "suspended",
            subscriptionStatus: "refunded",
            updatedAt: new Date()
          })
          .where(eq(members.id, member.id))

        console.log(`Updated member ${member.id} status to suspended due to refund ${refundId}`)
      }
    }
  } catch (error) {
    console.error(`Error handling payment refund for club ${clubId}:`, error)
    throw error
  }
}
