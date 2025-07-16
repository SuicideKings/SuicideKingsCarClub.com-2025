import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { members, clubs } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memberId = parseInt(params.id)
    
    if (isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    // Get member with club information
    const [member] = await db
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
      .where(eq(members.id, memberId))

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    return NextResponse.json({ member })
  } catch (error) {
    console.error("Error fetching member:", error)
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memberId = parseInt(params.id)
    
    if (isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      clubId,
      role,
      membershipStatus,
      bio,
      carInfo,
      membershipTier,
      profileImageUrl,
      paypalSubscriptionId,
      subscriptionStatus,
      subscriptionStartDate,
      subscriptionEndDate,
    } = body

    // Check if member exists
    const [existingMember] = await db
      .select()
      .from(members)
      .where(eq(members.id, memberId))

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingMember.email) {
      const [emailExists] = await db
        .select()
        .from(members)
        .where(eq(members.email, email))

      if (emailExists) {
        return NextResponse.json(
          { error: "A member with this email already exists" },
          { status: 409 }
        )
      }
    }

    // Update member
    const [updatedMember] = await db
      .update(members)
      .set({
        ...(name && { name }),
        ...(email && { email }),
        ...(phone !== undefined && { phone }),
        ...(clubId && { clubId: parseInt(clubId) }),
        ...(role && { role }),
        ...(membershipStatus && { membershipStatus }),
        ...(bio !== undefined && { bio }),
        ...(carInfo !== undefined && { carInfo }),
        ...(membershipTier && { membershipTier }),
        ...(profileImageUrl !== undefined && { profileImageUrl }),
        ...(paypalSubscriptionId !== undefined && { paypalSubscriptionId }),
        ...(subscriptionStatus && { subscriptionStatus }),
        ...(subscriptionStartDate && { subscriptionStartDate: new Date(subscriptionStartDate) }),
        ...(subscriptionEndDate && { subscriptionEndDate: new Date(subscriptionEndDate) }),
        updatedAt: new Date(),
      })
      .where(eq(members.id, memberId))
      .returning()

    return NextResponse.json({ member: updatedMember })
  } catch (error) {
    console.error("Error updating member:", error)
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const memberId = parseInt(params.id)
    
    if (isNaN(memberId)) {
      return NextResponse.json({ error: "Invalid member ID" }, { status: 400 })
    }

    // Check if member exists and get their club ID
    const [existingMember] = await db
      .select({ clubId: members.clubId })
      .from(members)
      .where(eq(members.id, memberId))

    if (!existingMember) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 })
    }

    // Delete member
    await db.delete(members).where(eq(members.id, memberId))

    // Update club member count
    if (existingMember.clubId) {
      await db.execute(
        sql`UPDATE clubs SET member_count = member_count - 1 WHERE id = ${existingMember.clubId}`
      )
    }

    return NextResponse.json({ message: "Member deleted successfully" })
  } catch (error) {
    console.error("Error deleting member:", error)
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 })
  }
}