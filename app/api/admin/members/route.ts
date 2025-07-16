import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { members, clubs } from "@/lib/db/schema"
import { desc, eq, ilike, and, or, sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || ""
    const clubId = searchParams.get("clubId")

    const offset = (page - 1) * limit

    // Build query conditions
    const conditions = []
    
    if (search) {
      conditions.push(
        or(
          ilike(members.name, `%${search}%`),
          ilike(members.email, `%${search}%`)
        )
      )
    }
    
    if (status) {
      conditions.push(eq(members.membershipStatus, status))
    }
    
    if (clubId) {
      conditions.push(eq(members.clubId, parseInt(clubId)))
    }

    // Get members with club information
    const membersResult = await db
      .select({
        id: members.id,
        name: members.name,
        email: members.email,
        phone: members.phone,
        role: members.role,
        joinDate: members.joinDate,
        membershipStatus: members.membershipStatus,
        profileImageUrl: members.profileImageUrl,
        bio: members.bio,
        carInfo: members.carInfo,
        isEmailVerified: members.isEmailVerified,
        paypalSubscriptionId: members.paypalSubscriptionId,
        subscriptionStatus: members.subscriptionStatus,
        subscriptionStartDate: members.subscriptionStartDate,
        subscriptionEndDate: members.subscriptionEndDate,
        membershipTier: members.membershipTier,
        lastLoginAt: members.lastLoginAt,
        createdAt: members.createdAt,
        updatedAt: members.updatedAt,
        club: {
          id: clubs.id,
          name: clubs.name,
          slug: clubs.slug,
          location: clubs.location,
        },
      })
      .from(members)
      .leftJoin(clubs, eq(members.clubId, clubs.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(members.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(members)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    // Get summary statistics
    const [stats] = await db
      .select({
        total: sql`count(*)`,
        active: sql`sum(case when membership_status = 'active' then 1 else 0 end)`,
        pending: sql`sum(case when membership_status = 'pending' then 1 else 0 end)`,
        expired: sql`sum(case when membership_status = 'expired' then 1 else 0 end)`,
      })
      .from(members)

    return NextResponse.json({
      members: membersResult,
      pagination: {
        page,
        limit,
        total: Number(count),
        totalPages: Math.ceil(Number(count) / limit),
      },
      stats: {
        total: Number(stats.total),
        active: Number(stats.active),
        pending: Number(stats.pending),
        expired: Number(stats.expired),
      },
    })
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      clubId,
      role = "member",
      membershipStatus = "active",
      bio,
      carInfo,
      membershipTier,
    } = body

    // Validate required fields
    if (!name || !email || !clubId) {
      return NextResponse.json(
        { error: "Name, email, and club ID are required" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingMember = await db
      .select()
      .from(members)
      .where(eq(members.email, email))
      .limit(1)

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: "A member with this email already exists" },
        { status: 409 }
      )
    }

    // Create new member
    const [newMember] = await db
      .insert(members)
      .values({
        name,
        email,
        phone,
        clubId: parseInt(clubId),
        role,
        membershipStatus,
        bio,
        carInfo,
        membershipTier,
        joinDate: new Date(),
      })
      .returning()

    // Update club member count
    await db.execute(
      sql`UPDATE clubs SET member_count = member_count + 1 WHERE id = ${clubId}`
    )

    return NextResponse.json({ member: newMember })
  } catch (error) {
    console.error("Error creating member:", error)
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 })
  }
}