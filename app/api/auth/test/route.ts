import { NextResponse } from "next/server"

export async function GET() {
  try {
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
  const hasStackSecret = !!process.env.STACK_SECRET_SERVER_KEY

    return NextResponse.json({
      status: "success",
      environment: {
      NEXTAUTH_SECRET: hasNextAuthSecret,
      STACK_SECRET_SERVER_KEY: hasStackSecret,
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
