import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClubPayment } from "@/lib/paypal"
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
    const { amount, description } = await request.json()

    // Get club details
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    // Create payment using club's PayPal credentials
    const payment = await createClubPayment(clubId, {
      amount: amount.toString(),
      currency: "USD",
      description,
      returnUrl: `${process.env.NEXTAUTH_URL}/api/clubs/${clubId}/paypal/payment-success`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/api/clubs/${clubId}/paypal/payment-cancel`,
    })

    return NextResponse.json(payment)
  } catch (error) {
    console.error("Error creating club payment:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
