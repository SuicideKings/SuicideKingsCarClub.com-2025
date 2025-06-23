import { type NextRequest, NextResponse } from "next/server"
import { registerMember } from "@/lib/member-auth"

export async function POST(request: NextRequest) {
  try {
    const memberData = await request.json()

    const { firstName, lastName, email, phone, password, clubId } = memberData

    if (!firstName || !lastName || !email || !password || !clubId) {
      return NextResponse.json({ success: false, error: "All required fields must be provided" }, { status: 400 })
    }

    const result = await registerMember({
      firstName,
      lastName,
      email,
      phone,
      password,
      clubId: Number.parseInt(clubId),
    })

    if (result.success) {
      const response = NextResponse.json({
        success: true,
        member: {
          id: result.member.id,
          email: result.member.email,
          firstName: result.member.firstName,
          lastName: result.member.lastName,
          role: result.member.role,
          membershipStatus: result.member.membershipStatus,
          memberNumber: result.member.memberNumber,
        },
        token: result.token,
      })

      // Set HTTP-only cookie
      response.cookies.set("memberToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return response
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
