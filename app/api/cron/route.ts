import { NextResponse } from "next/server"
import { scheduleBillingReminders, scheduleAutomaticBackups, scheduleUpdateChecks } from "@/lib/scheduled-tasks"

// This endpoint should be secured with a cron secret
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const cronSecret = url.searchParams.get("secret")

    // Verify the cron secret
    if (cronSecret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Run the scheduled tasks
    const billingRemindersResult = await scheduleBillingReminders()
    const automaticBackupsResult = await scheduleAutomaticBackups()
    const updateChecksResult = await scheduleUpdateChecks()

    return NextResponse.json({
      success: true,
      results: {
        billingReminders: billingRemindersResult,
        automaticBackups: automaticBackupsResult,
        updateChecks: updateChecksResult,
      },
    })
  } catch (error) {
    console.error("Error running scheduled tasks:", error)
    return NextResponse.json({ error: "Failed to run scheduled tasks" }, { status: 500 })
  }
}
