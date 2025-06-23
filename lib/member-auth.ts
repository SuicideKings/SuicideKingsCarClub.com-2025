import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"
import { members } from "./db/schema"
import { eq } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-http"

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

export interface MemberSession {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  membershipStatus: string
  clubId: number
  memberNumber: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createMemberSession(member: any): Promise<string> {
  const payload: MemberSession = {
    id: member.id,
    email: member.email,
    firstName: member.firstName,
    lastName: member.lastName,
    role: member.role,
    membershipStatus: member.membershipStatus,
    clubId: member.clubId,
    memberNumber: member.memberNumber,
  }

  return jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "7d",
  })
}

export async function verifyMemberSession(token: string): Promise<MemberSession | null> {
  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as MemberSession
    return decoded
  } catch (error) {
    return null
  }
}

export async function authenticateMember(email: string, password: string) {
  try {
    const member = await db.select().from(members).where(eq(members.email, email)).limit(1)

    if (!member.length || !member[0].password) {
      return { success: false, error: "Invalid credentials" }
    }

    const isValidPassword = await verifyPassword(password, member[0].password)
    if (!isValidPassword) {
      return { success: false, error: "Invalid credentials" }
    }

    if (member[0].membershipStatus !== "active") {
      return { success: false, error: "Account is not active" }
    }

    // Update last login
    await db.update(members).set({ lastLoginAt: new Date() }).where(eq(members.id, member[0].id))

    const token = await createMemberSession(member[0])

    return {
      success: true,
      member: member[0],
      token,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Authentication error:", error)
    }
    return { success: false, error: "Authentication failed" }
  }
}

export async function registerMember(memberData: {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  clubId: number
}) {
  try {
    // Check if member already exists
    const existingMember = await db.select().from(members).where(eq(members.email, memberData.email)).limit(1)

    if (existingMember.length > 0) {
      return { success: false, error: "Email already registered" }
    }

    // Hash password
    const hashedPassword = await hashPassword(memberData.password)

    // Generate member number
    const memberNumber = `SK${Date.now().toString().slice(-6)}`

    // Create member
    const newMember = await db
      .insert(members)
      .values({
        ...memberData,
        password: hashedPassword,
        memberNumber,
        joinDate: new Date(),
        renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      })
      .returning()

    const token = await createMemberSession(newMember[0])

    return {
      success: true,
      member: newMember[0],
      token,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Registration error:", error)
    }
    return { success: false, error: "Registration failed" }
  }
}

export async function getMemberFromToken(token: string) {
  try {
    const session = await verifyMemberSession(token)
    if (!session) return null

    const member = await db.select().from(members).where(eq(members.id, session.id)).limit(1)

    return member.length > 0 ? member[0] : null
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Get member error:", error)
    }
    return null
  }
}
