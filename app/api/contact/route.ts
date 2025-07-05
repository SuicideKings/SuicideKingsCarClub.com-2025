import { type NextRequest, NextResponse } from "next/server"
import { contactRateLimit, withRateLimit } from "@/lib/rate-limit"
import { contactFormSchema, validateRequest, sanitizeText } from "@/lib/validation"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = withRateLimit(contactRateLimit)(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    const body = await request.json()

    // Validate and sanitize input
    const validation = validateRequest(contactFormSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed", 
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    const { name, email, subject, message } = validation.data

    // Sanitize text inputs to prevent XSS
    const sanitizedData = {
      name: sanitizeText(name),
      email: sanitizeText(email),
      subject: sanitizeText(subject),
      message: sanitizeText(message),
    }

    // Additional security: Check for potential spam patterns
    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'urgent']
    const messageText = `${sanitizedData.subject} ${sanitizedData.message}`.toLowerCase()
    
    if (spamKeywords.some(keyword => messageText.includes(keyword))) {
      // Log potential spam attempt
      console.warn(`Potential spam detected from ${sanitizedData.email}:`, {
        ip: request.headers.get('x-forwarded-for') || request.ip,
        userAgent: request.headers.get('user-agent'),
        timestamp: new Date().toISOString(),
      })
      
      // Still return success to avoid giving feedback to spammers
      return NextResponse.json({
        success: true,
        message: "Thank you for your message. We'll get back to you soon!",
      })
    }

    // Log the submission for audit trail
    console.log("Contact form submission:", {
      ...sanitizedData,
      ip: request.headers.get('x-forwarded-for') || request.ip,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    })

    // In a real implementation, you would:
    // 1. Save to database with proper sanitization
    // 2. Send email notification to admins
    // 3. Send confirmation email to user
    // 4. Add to CRM system
    // 5. Log for analytics

    // Simulate sending email (you would implement actual email sending here)
    if (process.env.NODE_ENV === 'development') {
      console.log(`
=== CONTACT FORM SUBMISSION ===
From: ${sanitizedData.name} <${sanitizedData.email}>
Subject: ${sanitizedData.subject}
Message: ${sanitizedData.message}
Time: ${new Date().toLocaleString()}
===============================
      `)
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
    })

  } catch (error) {
    console.error("Contact form error:", error)
    
    // Don't leak internal error details to client
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
