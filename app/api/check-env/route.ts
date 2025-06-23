import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const dbResult = await testConnection()

    // Check for required environment variables
    const envVars = {
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    }

    return NextResponse.json({
      database: dbResult,
      environment: envVars,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Environment check error:", error)
    return NextResponse.json(
      {
        error: "Failed to check environment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
