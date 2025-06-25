import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs } from "@/lib/db/schema"

// Get all clubs
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const allClubs = await db.query.clubs.findMany({
      columns: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        subscriptionStatus: true,
        nextBillingDate: true,
        active: true,
        createdAt: true,
      },
    })

    return NextResponse.json(allClubs)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching clubs:", error)
    }
    return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 })
  }
}

// Create new club
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, slug, billingEmail, monthlyPrice, yearlyPrice, currency } = await request.json()

    if (!name || !slug || !billingEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const [newClub] = await db
      .insert(clubs)
      .values({
        name,
        slug,
        billingEmail,
        monthlyPrice: monthlyPrice || "99.99",
        yearlyPrice: yearlyPrice || "999.99",
        currency: currency || "USD",
      })
      .returning()

    return NextResponse.json(newClub, { status: 201 })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error creating club:", error)
    }
    return NextResponse.json({ error: "Failed to create club" }, { status: 500 })
  }
}
