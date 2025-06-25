import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"

export async function GET() {
  // Check if we have the required environment variables
  const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
  const hasStackSecret = !!process.env.STACK_SECRET_SERVER_KEY

  // Check if we have a secret in the auth options
  const hasAuthOptionsSecret = !!authOptions.secret

  return NextResponse.json({
    status: "Auth configuration check",
    environment: {
      NEXTAUTH_SECRET: hasNextAuthSecret ? "✓ Set" : "✗ Missing",
      STACK_SECRET_SERVER_KEY: hasStackSecret ? "✓ Set" : "✗ Missing",
    },
    authOptions: {
      secret: hasAuthOptionsSecret ? "✓ Set" : "✗ Missing",
    },
    nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
  })
}
