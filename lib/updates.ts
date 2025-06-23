import { db } from "./db"
import { jobs } from "./db/schema"
import { eq } from "drizzle-orm"
import { createNotification } from "./notifications"
import axios from "axios"

interface UpdateCheckResult {
  hasUpdates: boolean
  latestVersion: string
  currentVersion: string
  updateUrl?: string
  releaseNotes?: string
}

export async function checkForUpdates() {
  try {
    // Create an update check job
    const [job] = await db
      .insert(jobs)
      .values({
        type: "update-check",
        status: "pending",
        data: {},
      })
      .returning()

    // Start the update check process asynchronously
    processUpdateCheck(job.id).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Update check process failed:", error)
      }
    })

    return { success: true, jobId: job.id }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to start update check:", error)
    }
    throw new Error(`Failed to start update check: ${error}`)
  }
}

async function processUpdateCheck(jobId: string) {
  try {
    // Update job status to processing
    await db.update(jobs).set({ status: "processing", startedAt: new Date() }).where(eq(jobs.id, jobId))

    // Get the current version from package.json or environment variable
    const currentVersion = process.env.APP_VERSION || "1.0.0"

    // Check for updates from Context7.com
    const updateResult = await checkContext7ForUpdates(currentVersion)

    // Get all active clubs
    const clubs = await db.query.clubs.findMany({
      where: eq(clubs.active, true),
    })

    // Create notifications for all clubs if updates are available
    if (updateResult.hasUpdates) {
      // Create a notification for each club
      for (const club of clubs) {
        await createNotification({
          clubId: club.id,
          type: "update",
          title: "New Update Available",
          message: `A new update (${updateResult.latestVersion}) is available. Current version: ${updateResult.currentVersion}. ${updateResult.releaseNotes}`,
        })
      }
    }

    // Update job status to completed
    await db
      .update(jobs)
      .set({
        status: "completed",
        completedAt: new Date(),
        result: updateResult,
      })
      .where(eq(jobs.id, jobId))

    return { success: true, updateResult }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Update check process failed:", error)
    }

    // Update job status to failed
    await db
      .update(jobs)
      .set({
        status: "failed",
        completedAt: new Date(),
        error: error instanceof Error ? error.message : String(error),
      })
      .where(eq(jobs.id, jobId))

    throw error
  }
}

async function checkContext7ForUpdates(currentVersion: string): Promise<UpdateCheckResult> {
  try {
    // Make a request to Context7.com API to check for updates
    const response = await axios.get("https://api.context7.com/updates", {
      params: {
        currentVersion,
        appId: "ai-website-builder",
      },
    })

    const data = response.data

    return {
      hasUpdates: data.hasUpdates,
      latestVersion: data.latestVersion,
      currentVersion,
      updateUrl: data.updateUrl,
      releaseNotes: data.releaseNotes,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to check for updates from Context7:", error)
    }

    // Return a default result if the update check fails
    return {
      hasUpdates: false,
      latestVersion: currentVersion,
      currentVersion,
    }
  }
}

export async function getUpdateStatus(jobId: string) {
  try {
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, jobId),
    })

    if (!job) {
      throw new Error("Job not found")
    }

    return {
      status: job.status,
      startedAt: job.startedAt,
      completedAt: job.completedAt,
      result: job.result,
      error: job.error,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get update status:", error)
    }
    throw new Error(`Failed to get update status: ${error}`)
  }
}
