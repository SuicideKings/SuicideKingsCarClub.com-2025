import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { clubs, users, websites, jobs } from "@/lib/db/schema"
import { count, eq } from "drizzle-orm"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check database connectivity
    const dbStatus = await checkDatabaseStatus()

    // Check system statistics
    const stats = await getSystemStats()

    // Check environment variables
    const envStatus = checkEnvironmentVariables()

    // Check external services
    const servicesStatus = await checkExternalServices()

    return NextResponse.json({
      status: "operational",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      statistics: stats,
      environment: envStatus,
      services: servicesStatus,
    })
  } catch (error) {
    console.error("Error checking system status:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Failed to check system status",
      },
      { status: 500 },
    )
  }
}

async function checkDatabaseStatus() {
  try {
    // Test basic database connectivity
    const [clubCount] = await db.select({ count: count() }).from(clubs)
    const [userCount] = await db.select({ count: count() }).from(users)
    const [websiteCount] = await db.select({ count: count() }).from(websites)

    return {
      connected: true,
      tables: {
        clubs: clubCount.count,
        users: userCount.count,
        websites: websiteCount.count,
      },
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database error",
    }
  }
}

async function getSystemStats() {
  try {
    const [activeClubs] = await db.select({ count: count() }).from(clubs).where(eq(clubs.active, true))

    const [pendingJobs] = await db.select({ count: count() }).from(jobs).where(eq(jobs.status, "pending"))

    const [runningJobs] = await db.select({ count: count() }).from(jobs).where(eq(jobs.status, "running"))

    return {
      activeClubs: activeClubs.count,
      pendingJobs: pendingJobs.count,
      runningJobs: runningJobs.count,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to get system stats",
    }
  }
}

function checkEnvironmentVariables() {
  const requiredVars = [
    "NEON_DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
    "EMAIL_SERVER_HOST",
    "EMAIL_SERVER_USER",
    "EMAIL_FROM",
  ]

  const optionalVars = ["PAYPAL_CLIENT_ID", "PAYPAL_CLIENT_SECRET", "CRON_SECRET"]

  const status = {
    required: {} as Record<string, boolean>,
    optional: {} as Record<string, boolean>,
  }

  requiredVars.forEach((varName) => {
    status.required[varName] = !!process.env[varName]
  })

  optionalVars.forEach((varName) => {
    status.optional[varName] = !!process.env[varName]
  })

  return status
}

async function checkExternalServices() {
  const services = {
    email: await checkEmailService(),
    paypal: await checkPayPalService(),
    storage: await checkStorageService(),
  }

  return services
}

async function checkEmailService() {
  try {
    // Basic check for email configuration
    const hasEmailConfig = !!(process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_FROM)

    return {
      configured: hasEmailConfig,
      status: hasEmailConfig ? "ready" : "not_configured",
    }
  } catch (error) {
    return {
      configured: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown email service error",
    }
  }
}

async function checkPayPalService() {
  try {
    // Check if PayPal environment variables are set
    const hasPayPalConfig = !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)

    return {
      configured: hasPayPalConfig,
      status: hasPayPalConfig ? "ready" : "not_configured",
    }
  } catch (error) {
    return {
      configured: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown PayPal service error",
    }
  }
}

async function checkStorageService() {
  try {
    // Check if blob storage is configured
    const hasBlobConfig = !!process.env.BLOB_READ_WRITE_TOKEN

    return {
      configured: hasBlobConfig,
      status: hasBlobConfig ? "ready" : "not_configured",
    }
  } catch (error) {
    return {
      configured: false,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown storage service error",
    }
  }
}
