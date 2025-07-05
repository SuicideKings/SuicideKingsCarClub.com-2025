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
      neonDatabaseUrl: !!process.env.NEON_DATABASE_URL,
      databaseUrl: !!process.env.DATABASE_URL,
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
