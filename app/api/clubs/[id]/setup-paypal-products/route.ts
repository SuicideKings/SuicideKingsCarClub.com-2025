import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { setupClubPayPalProducts, validateClubPayPalSetup, getClubPayPalStatus } from "@/lib/paypal-setup"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const status = await getClubPayPalStatus(clubId)
    
    return NextResponse.json(status)
  } catch (error) {
    console.error("Error getting PayPal status:", error)
    return NextResponse.json({ error: "Failed to get PayPal status" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const { monthlyPrice, yearlyPrice, currency, description } = await request.json()

    // Get club details
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)

    if (club.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    const clubData = club[0]
    const paypalSettings = clubData.paypalSettings as any

    if (!paypalSettings?.clientId || !paypalSettings?.clientSecret) {
      return NextResponse.json({ error: "PayPal credentials not configured" }, { status: 400 })
    }

    // Validate required fields
    if (!monthlyPrice || !yearlyPrice || !currency) {
      return NextResponse.json({ error: "Monthly price, yearly price, and currency are required" }, { status: 400 })
    }

    // Setup PayPal products and plans
    const result = await setupClubPayPalProducts({
      clubId,
      clubName: clubData.name,
      monthlyPrice,
      yearlyPrice,
      currency,
      description
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      productId: result.productId,
      monthlyPlanId: result.monthlyPlanId,
      yearlyPlanId: result.yearlyPlanId,
      message: "PayPal products and plans created successfully"
    })
  } catch (error) {
    console.error("Error setting up PayPal products:", error)
    return NextResponse.json({ error: "Failed to setup PayPal products" }, { status: 500 })
  }
}
