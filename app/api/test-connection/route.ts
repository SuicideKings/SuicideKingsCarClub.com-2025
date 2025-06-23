import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const { data, error } = await supabaseAdmin.from("admin_users").select("count(*)").limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database connection test failed:", error)

    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Database connection failed",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
