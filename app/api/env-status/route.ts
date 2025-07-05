import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY ? "✓ Set" : "✗ Missing",
    NEON_DATABASE_URL: process.env.NEON_DATABASE_URL ? "✓ Set" : "✗ Missing",
    DATABASE_URL: process.env.DATABASE_URL ? "✓ Set" : "✗ Missing",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV || "undefined",
  }

  return NextResponse.json({
    message: "Environment Variables Status",
    variables: envVars,
    timestamp: new Date().toISOString(),
  })
}
