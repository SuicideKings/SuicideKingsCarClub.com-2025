import { type NextRequest, NextResponse } from "next/server"
import { getMemberFromToken } from "@/lib/member-auth"
import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { memberCars } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"

// Initialize database connection only when environment variables are available
function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  if (!databaseUrl) {
    throw new Error('No database connection string was provided. Please set DATABASE_URL or NEON_DATABASE_URL environment variable.')
  }
  const sql = neon(databaseUrl)
  return drizzle(sql)
}

const carSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  vin: z.string().optional(),
  modifications: z.string().optional(),
  isPrimary: z.boolean().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const member = await getMemberFromToken(token)

    if (!member) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const db = getDatabase()
    const cars = await db
      .select()
      .from(memberCars)
      .where(eq(memberCars.memberId, member.id))
      .orderBy(memberCars.isPrimary)

    return NextResponse.json({ success: true, data: cars })
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch cars" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const member = await getMemberFromToken(token)

    if (!member) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const validated = carSchema.parse(body)

    const db = getDatabase()
    // If setting as primary, first unset any existing primary car
    if (validated.isPrimary) {
      await db
        .update(memberCars)
        .set({ isPrimary: false })
        .where(
          and(
            eq(memberCars.memberId, member.id),
            eq(memberCars.isPrimary, true)
          )
        )
    }

    const [newCar] = await db
      .insert(memberCars)
      .values({
        ...validated,
        memberId: member.id,
        isPrimary: validated.isPrimary ?? false,
      })
      .returning()

    return NextResponse.json({ success: true, data: newCar }, { status: 201 })
  } catch (error) {
    console.error("Error adding car:", error)
    return NextResponse.json(
      { success: false, error: "Failed to add car" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const member = await getMemberFromToken(token)

    if (!member) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const validated = carSchema.parse(body)

    const db = getDatabase()
    // If setting as primary, first unset any existing primary car
    if (validated.isPrimary) {
      await db
        .update(memberCars)
        .set({ isPrimary: false })
        .where(
          and(
            eq(memberCars.memberId, member.id),
            eq(memberCars.isPrimary, true)
          )
        )
    }

    const [updatedCar] = await db
      .update(memberCars)
      .set(validated)
      .where(
        and(
          eq(memberCars.id, body.id),
          eq(memberCars.memberId, member.id)
        )
      )
      .returning()

    return NextResponse.json({ success: true, data: updatedCar })
  } catch (error) {
    console.error("Error updating car:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update car" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const member = await getMemberFromToken(token)

    if (!member) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
    }

    const { id } = await request.json()

    const db = getDatabase()
    await db
      .delete(memberCars)
      .where(
        and(
          eq(memberCars.id, id),
          eq(memberCars.memberId, member.id)
        )
      )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting car:", error)
    return NextResponse.json(
      { success: false, error: "Failed to delete car" },
      { status: 500 }
    )
  }
}