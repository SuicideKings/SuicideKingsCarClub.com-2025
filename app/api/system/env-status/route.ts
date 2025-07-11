import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { validateEnvironment, getEnvironmentStatus, getRequiredEnvironmentVariables } from "@/lib/env-validation"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const envStatus = getEnvironmentStatus()
    const validation = validateEnvironment()
    const requirements = getRequiredEnvironmentVariables()

    // Check which environment variables are configured
    const configured = {
      database: !!(
        process.env.DATABASE_URL || 
        process.env.POSTGRES_URL || 
        process.env.SUPABASE_URL || 
        process.env.NEON_DATABASE_URL || 
        process.env.PLANETSCALE_DATABASE_URL || 
        process.env.VERCEL_POSTGRES_URL
      ),
      auth: !!(process.env.NEXTAUTH_URL && process.env.NEXTAUTH_SECRET),
      paypal: !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
      email: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD),
      storage: !!(
        (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET) ||
        process.env.BLOB_READ_WRITE_TOKEN
      ),
      ai: !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY)
    }

    return NextResponse.json({
      status: envStatus.status,
      message: envStatus.message,
      configured,
      requirements,
      errors: validation.errors,
      warnings: validation.warnings,
      environment: process.env.NODE_ENV
    })

  } catch (error) {
    console.error("Error checking environment status:", error)
    return NextResponse.json(
      { error: "Failed to check environment status" }, 
      { status: 500 }
    )
  }
}