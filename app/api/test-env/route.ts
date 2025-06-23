import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db"

export async function GET() {
  // Check environment variables without referencing sensitive ones
  const envStatus = {
    nextAuth: {
      secret: !!process.env.NEXTAUTH_SECRET,
      url: !!process.env.NEXTAUTH_URL,
    },
    database: {
      url: !!process.env.DATABASE_URL,
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
    },
  }

  // Test database connection
  const dbConnection = await testConnection()

  return NextResponse.json({
    status: "success",
    environment: envStatus,
    database: dbConnection,
    timestamp: new Date().toISOString(),
  })
}
