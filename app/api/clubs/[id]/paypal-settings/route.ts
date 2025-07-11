import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { updateClubPayPalSettings, getClubPayPalSettings, testClubPayPalConnection } from "@/lib/paypal"
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
    
    // Verify club exists
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    if (club.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    const settings = await getClubPayPalSettings(clubId)
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error getting club PayPal settings:", error)
    return NextResponse.json({ error: "Failed to get PayPal settings" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const {
      clientId,
      clientSecret,
      webhookId,
      isProduction,
    } = await request.json()

    // Verify club exists
    const club = await db.select().from(clubs).where(eq(clubs.id, clubId)).limit(1)
    if (club.length === 0) {
      return NextResponse.json({ error: "Club not found" }, { status: 404 })
    }

    // Validate required fields
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Client ID and Client Secret are required" }, { status: 400 })
    }

    // Update PayPal settings
    await updateClubPayPalSettings(clubId, {
      clientId,
      clientSecret,
      webhookId,
      isProduction: isProduction || false,
    })

    // Test the connection
    const connectionTest = await testClubPayPalConnection(clubId)
    if (!connectionTest.success) {
      return NextResponse.json({ 
        error: "PayPal connection test failed", 
        details: connectionTest.error 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: "PayPal settings updated successfully",
      connectionTest: connectionTest.data 
    })
  } catch (error) {
    console.error("Error updating club PayPal settings:", error)
    return NextResponse.json({ error: "Failed to update PayPal settings" }, { status: 500 })
  }
}
