import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const {
      paypalClientId,
      paypalClientSecret,
      paypalWebhookId,
      monthlyPrice,
      yearlyPrice,
      currency,
      paypalEnvironment,
    } = await request.json()

    const [updatedClub] = await db
      .update(clubs)
      .set({
        paypalClientId,
        paypalClientSecret,
        paypalWebhookId,
        monthlyPrice,
        yearlyPrice,
        currency,
        paypalEnvironment,
        updatedAt: new Date(),
      })
      .where(eq(clubs.id, clubId))
      .returning()

    if (!updatedClub) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error updating PayPal settings:", error)
    }
    return NextResponse.json({ error: "Failed to update PayPal settings" }, { status: 500 })
  }
}
