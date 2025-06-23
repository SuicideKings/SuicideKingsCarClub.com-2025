import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createClubProduct, createClubSubscriptionPlan } from "@/lib/paypal"
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
    const { monthlyPrice, yearlyPrice, currency } = await request.json()

    // Get club details
    const club = await db.query.clubs.findFirst({
      where: eq(clubs.id, clubId),
    })

    if (!club) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    if (!club.paypalClientId || !club.paypalClientSecret) {
      return NextResponse.json({ error: "PayPal credentials not configured" }, { status: 400 })
    }

    // Create PayPal product
    const product = await createClubProduct(clubId, {
      name: `${club.name} Website Builder Subscription`,
      description: `Website builder subscription for ${club.name}`,
    })

    // Create monthly plan
    const monthlyPlan = await createClubSubscriptionPlan(clubId, {
      productId: product.id,
      name: `${club.name} Monthly Plan`,
      description: `Monthly subscription for ${club.name} website builder`,
      amount: monthlyPrice,
      currency: currency,
      interval: "MONTH",
    })

    // Create yearly plan
    const yearlyPlan = await createClubSubscriptionPlan(clubId, {
      productId: product.id,
      name: `${club.name} Yearly Plan`,
      description: `Yearly subscription for ${club.name} website builder`,
      amount: yearlyPrice,
      currency: currency,
      interval: "YEAR",
    })

    // Update club with product and plan IDs
    await db
      .update(clubs)
      .set({
        paypalProductId: product.id,
        paypalMonthlyPlanId: monthlyPlan.id,
        paypalYearlyPlanId: yearlyPlan.id,
        monthlyPrice,
        yearlyPrice,
        currency,
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, clubId))

    return NextResponse.json({
      productId: product.id,
      monthlyPlanId: monthlyPlan.id,
      yearlyPlanId: yearlyPlan.id,
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error setting up PayPal products:", error)
    }
    return NextResponse.json({ error: "Failed to setup PayPal products" }, { status: 500 })
  }
}
