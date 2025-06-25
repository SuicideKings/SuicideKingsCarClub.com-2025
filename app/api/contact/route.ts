import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      )
    }

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Send email notification to admins
    // 3. Send confirmation email to user

    // For now, we'll just log the message and return success
    console.log("Contact form submission:", {
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // Simulate sending email (you would implement actual email sending here)
    if (process.env.NODE_ENV === 'development') {
      console.log(`
=== CONTACT FORM SUBMISSION ===
From: ${name} <${email}>
Subject: ${subject}
Message: ${message}
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
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
