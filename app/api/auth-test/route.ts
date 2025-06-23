import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: {
          name: session.user?.name,
          email: session.user?.email,
          // Don't include sensitive information
        }
      } : null,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Auth test error:", error)
    return NextResponse.json({
      error: "Failed to check authentication",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}
