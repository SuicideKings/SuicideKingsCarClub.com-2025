import { type NextRequest, NextResponse } from "next/server"
import { authenticateMember } from "@/lib/member-auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
    }

    const result = await authenticateMember(email, password)

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
        redirectUrl: "/member/dashboard",
      })

      // Set HTTP-only cookie
      response.cookies.set("memberToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return response
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 })
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
