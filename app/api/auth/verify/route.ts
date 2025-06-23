import { type NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key")

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ success: false, error: "No token provided" }, { status: 401 })
    }

    const { payload } = await jwtVerify(token, secret)

    // Here you would typically fetch the latest member data from the database
    // For now, we'll return the payload data
    return NextResponse.json({
      success: true,
      member: {
        id: payload.id,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        membershipStatus: payload.membershipStatus,
        memberNumber: payload.memberNumber,
      },
    })
  } catch (error) {
    console.error("Token verification failed:", error)
    return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 })
  }
}
