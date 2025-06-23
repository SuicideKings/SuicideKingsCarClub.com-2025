import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { testClubPayPalConnection } from "@/lib/paypal"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clubId = Number.parseInt(params.id)
    const isConnected = await testClubPayPalConnection(clubId)

    if (isConnected) {
      return NextResponse.json({ success: true, message: "PayPal connection successful" })
    } else {
      return NextResponse.json({ error: "PayPal connection failed" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error testing PayPal connection:", error)
    return NextResponse.json({ error: "Failed to test PayPal connection" }, { status: 500 })
  }
}
