import { type NextRequest, NextResponse } from "next/server"
import { registerMember } from "@/lib/member-auth"
import { authRateLimit, withRateLimit } from "@/lib/rate-limit"
import { memberRegistrationSchema, validateRequest, sanitizeText } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = withRateLimit(authRateLimit)(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const memberData = await request.json()

    // Validate input data
    const validation = validateRequest(memberRegistrationSchema, memberData)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Registration data validation failed", 
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    const { firstName, lastName, email, phone, password, clubId, agreedToTerms } = validation.data

    // Sanitize text inputs
    const sanitizedData = {
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizeText(email),
      phone: phone ? sanitizeText(phone) : undefined,
      password, // Don't sanitize password as it will be hashed
      clubId,
      agreedToTerms,
    }

    // Additional security checks
    if (!agreedToTerms) {
      return NextResponse.json(
        { success: false, error: "You must agree to the terms and conditions" },
        { status: 400 }
      )
    }

    // Log registration attempt for audit trail
    console.log("Member registration attempt:", {
      email: sanitizedData.email,
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      clubId: sanitizedData.clubId,
      ip: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    })

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /test\d+@/i,
      /admin@/i,
      /noreply@/i,
      /test.*test/i,
    ]

    if (suspiciousPatterns.some(pattern => pattern.test(sanitizedData.email))) {
      console.warn("Suspicious registration attempt:", {
        email: sanitizedData.email,
        ip: request.headers.get('x-forwarded-for') || request.ip,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
      })
    }

    const result = await registerMember({
      firstName: sanitizedData.firstName,
      lastName: sanitizedData.lastName,
      email: sanitizedData.email,
      phone: sanitizedData.phone,
      password: sanitizedData.password,
      clubId: sanitizedData.clubId,
    })

    if (result.success) {
      // Log successful registration
      console.log("Member registered successfully:", {
        memberId: result.member.id,
        memberNumber: result.member.memberNumber,
        email: result.member.email,
        timestamp: new Date().toISOString(),
      })

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

      // Set secure HTTP-only cookie
      response.cookies.set("memberToken", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return response
    } else {
      // Log failed registration
      console.warn("Member registration failed:", {
        email: sanitizedData.email,
        error: result.error,
        timestamp: new Date().toISOString(),
      })

      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Registration error:", error)
    
    // Don't leak internal error details
    return NextResponse.json(
      { success: false, error: "Registration failed. Please try again." },
      { status: 500 }
    )
  }
}
