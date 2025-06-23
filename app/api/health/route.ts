import { NextResponse } from "next/server"
import { validateRequiredEnvVars } from "@/lib/env-check"

export async function GET() {
  try {
    const envValid = validateRequiredEnvVars()

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      envValid,
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
