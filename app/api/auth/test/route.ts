import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasStackSecret = !!process.env.STACK_SECRET_SERVER_KEY
    const hasSupabaseUrl = !!process.env.SUPABASE_URL
    const hasSupabaseKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const hasNextPublicSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseAnonKey = !!process.env.SUPABASE_ANON_KEY

    return NextResponse.json({
      status: "success",
      environment: {
        NEXTAUTH_SECRET: hasNextAuthSecret,
        STACK_SECRET_SERVER_KEY: hasStackSecret,
        SUPABASE_URL: hasSupabaseUrl,
        SUPABASE_SERVICE_ROLE_KEY: hasSupabaseKey,
        NEXT_PUBLIC_SUPABASE_URL: hasNextPublicSupabaseUrl,
        SUPABASE_ANON_KEY: hasSupabaseAnonKey,
      },
      nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Test endpoint error:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
