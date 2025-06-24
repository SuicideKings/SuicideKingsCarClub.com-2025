import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    STACK_SECRET_SERVER_KEY: process.env.STACK_SECRET_SERVER_KEY ? "✓ Set" : "✗ Missing",

    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV || "undefined",
  }

  return NextResponse.json({
    message: "Environment Variables Status",
    variables: envVars,
    timestamp: new Date().toISOString(),
  })
}
