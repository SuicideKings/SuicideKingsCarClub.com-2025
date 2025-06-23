import nodemailer from "nodemailer"
import { render } from "@react-email/render"
import { db } from "./db"
import { clubs } from "./db/schema"
import { eq } from "drizzle-orm"

// Email templates
import BillingReminderEmail from "@/emails/billing-reminder"
import PaymentSuccessEmail from "@/emails/payment-success"
import PaymentFailedEmail from "@/emails/payment-failed"
import WebsiteDeployedEmail from "@/emails/website-deployed"
import BackupCompletedEmail from "@/emails/backup-completed"
import SubscriptionCreatedEmail from "@/emails/subscription-created"

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production",
})

// Email types
type EmailType = "billing-reminder" | "payment-success" | "payment-failed" | "website-deployed" | "backup-completed"

// Send email function
export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true, messageId: result.messageId }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send email:", error)
    }
    return { success: false, error }
  }
}

// Send billing reminder
export async function sendBillingReminder(clubId: number, daysUntilBilling: number) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club || !club.billingEmail) {
      throw new Error("Club not found or billing email not set")
    }

    const emailHtml = render(
      BillingReminderEmail({
        clubName: club.name,
        daysUntilBilling,
        billingDate: club.nextBillingDate?.toLocaleDateString() || "Unknown",
        amount: "$99.99", // This should be fetched from your pricing data
      }),
    )

    return sendEmail(
      club.billingEmail,
      `Billing Reminder: Your subscription renews in ${daysUntilBilling} days`,
      emailHtml,
    )
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send billing reminder:", error)
    }
    return { success: false, error }
  }
}

// Send payment success notification
export async function sendPaymentSuccessEmail(clubId: number, amount: string, invoiceUrl: string) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club || !club.billingEmail) {
      throw new Error("Club not found or billing email not set")
    }

    const emailHtml = render(
      PaymentSuccessEmail({
        clubName: club.name,
        amount,
        invoiceUrl,
        date: new Date().toLocaleDateString(),
      }),
    )

    return sendEmail(club.billingEmail, "Payment Successful - Thank You!", emailHtml)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send payment success email:", error)
    }
    return { success: false, error }
  }
}

// Send payment failed notification
export async function sendPaymentFailedEmail(clubId: number, amount: string, retryUrl: string) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club || !club.billingEmail) {
      throw new Error("Club not found or billing email not set")
    }

    const emailHtml = render(
      PaymentFailedEmail({
        clubName: club.name,
        amount,
        retryUrl,
        date: new Date().toLocaleDateString(),
      }),
    )

    return sendEmail(club.billingEmail, "Action Required: Payment Failed", emailHtml)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send payment failed email:", error)
    }
    return { success: false, error }
  }
}

// Send website deployed notification
export async function sendWebsiteDeployedEmail(
  clubId: number,
  websiteName: string,
  websiteUrl: string,
  recipientEmail: string,
) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      throw new Error("Club not found")
    }

    const emailHtml = render(
      WebsiteDeployedEmail({
        clubName: club.name,
        websiteName,
        websiteUrl,
        deployedAt: new Date().toLocaleString(),
      }),
    )

    return sendEmail(recipientEmail, `Website Deployed: ${websiteName}`, emailHtml)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send website deployed email:", error)
    }
    return { success: false, error }
  }
}

// Send backup completed notification
export async function sendBackupCompletedEmail(
  clubId: number,
  websiteName: string,
  backupSize: string,
  recipientEmail: string,
) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      throw new Error("Club not found")
    }

    const emailHtml = render(
      BackupCompletedEmail({
        clubName: club.name,
        websiteName,
        backupSize,
        backupDate: new Date().toLocaleString(),
      }),
    )

    return sendEmail(recipientEmail, `Backup Completed: ${websiteName}`, emailHtml)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send backup completed email:", error)
    }
    return { success: false, error }
  }
}

// Send payment success notification for PayPal
export async function sendPayPalPaymentSuccessEmail(
  clubId: number,
  amount: string,
  currency: string,
  transactionId: string,
) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club || !club.billingEmail) {
      throw new Error("Club not found or billing email not set")
    }

    const emailHtml = render(
      PaymentSuccessEmail({
        clubName: club.name,
        amount: `${amount} ${currency}`,
        transactionId,
        date: new Date().toLocaleDateString(),
        paymentMethod: "PayPal",
      }),
    )

    return sendEmail(club.billingEmail, "Payment Successful - Thank You!", emailHtml)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send PayPal payment success email:", error)
    }
    return { success: false, error }
  }
}

// Send subscription created notification
export async function sendSubscriptionCreatedEmail(clubId: number, subscriptionId: string, nextBillingDate: string) {
  try {
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club || !club.billingEmail) {
      throw new Error("Club not found or billing email not set")
    }

    const emailHtml = render(
      SubscriptionCreatedEmail({
        clubName: club.name,
        subscriptionId,
        nextBillingDate,
        amount: club.monthlyPrice || "99.99",
        currency: club.currency || "USD",
      }),
    )

    return sendEmail(club.billingEmail, "Subscription Activated Successfully", emailHtml)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to send subscription created email:", error)
    }
    return { success: false, error }
  }
}
