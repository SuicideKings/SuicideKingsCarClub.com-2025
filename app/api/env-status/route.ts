import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY ? "✓ Set" : "✗ Missing",
    SUPABASE_URL: process.env.SUPABASE_URL ? "✓ Set" : "✗ Missing",
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Set" : "✗ Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✓ Set" : "✗ Missing",
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "✓ Set" : "✗ Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV || "undefined",
  }

  return NextResponse.json({
    message: "Environment Variables Status",
    variables: envVars,
    timestamp: new Date().toISOString(),
  })
}
