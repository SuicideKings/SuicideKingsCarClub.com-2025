import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function GET() {
  // Check if we have the required environment variables
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
  const hasSupabaseJwtSecret = !!process.env.SUPABASE_JWT_SECRET
  const hasStackSecretServerKey = !!process.env.SKINGS_STACK_SECRET_SERVER_KEY

  // Check if we have a secret in the auth options
  const hasAuthOptionsSecret = !!authOptions.secret

  return NextResponse.json({
    status: "Auth configuration check",
    environment: {
      NEXTAUTH_SECRET: hasNextAuthSecret ? "✓ Set" : "✗ Missing",
      SUPABASE_JWT_SECRET: hasSupabaseJwtSecret ? "✓ Set" : "✗ Missing",
      SKINGS_STACK_SECRET_SERVER_KEY: hasStackSecretServerKey ? "✓ Set" : "✗ Missing",
    },
    authOptions: {
      secret: hasAuthOptionsSecret ? "✓ Set" : "✗ Missing",
    },
    nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
  })
}
