import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createPayment } from "@/lib/paypal"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clubId, amount, currency, description } = await request.json()

    if (!clubId || !amount || !currency || !description) {
      return NextResponse.json({ error: "Club ID, amount, currency, and description are required" }, { status: 400 })
    }

    // Get club details
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    // Create return and cancel URLs
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    const returnUrl = `${baseUrl}/api/paypal/payment-success?clubId=${clubId}`
    const cancelUrl = `${baseUrl}/api/paypal/payment-cancel?clubId=${clubId}`

    // Create PayPal payment
    const payment = await createPayment(
      {
        amount,
        currency,
        description,
        returnUrl,
        cancelUrl,
      },
      club.paypalClientId,
      club.paypalClientSecret,
    )

    return NextResponse.json({
      orderId: payment.id,
      approvalUrl: payment.links.find((link: any) => link.rel === "approve")?.href,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating PayPal payment:", error)
    }
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
