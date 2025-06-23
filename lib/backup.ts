import { db } from "./db"
import { backups, websites, jobs } from "./db/schema"
import { eq, desc } from "drizzle-orm"
import { createNotification } from "./notifications"
import { sendBackupCompletedEmail } from "./email"
import { uploadToS3 } from "./storage"
import { archiveWebsite } from "./archive"

export async function createBackup(websiteId: number, userId: number, type: "automatic" | "manual" = "manual") {
  try {
    // Create a backup job
    const [job] = await db
      .insert(jobs)
      .values({
        type: "backup",
        status: "pending",
        data: { websiteId, userId, backupType: type },
        websiteId,
      })
      .returning()

    // Start the backup process asynchronously
    processBackup(job.id).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Backup process failed:", error)
      }
    })

    return { success: true, jobId: job.id }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to start backup:", error)
    }
    throw new Error(`Failed to start backup: ${error}`)
  }
}

async function processBackup(jobId: string) {
  try {
    // Update job status to processing
    await db.update(jobs).set({ status: "processing", startedAt: new Date() }).where(eq(jobs.id, jobId))

    // Get the job data
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, jobId),
    })

    if (!job) {
      throw new Error("Job not found")
    }

    const { websiteId, userId, backupType } = job.data as {
      websiteId: number
      userId: number
      backupType: "automatic" | "manual"
    }

    // Get the website
    const website = await db.query.websites.findFirst({
      where: eq(websites.id, websiteId),
    })

    if (!website) {
      throw new Error("Website not found")
    }

    // 1. Archive the website
    const archiveResult = await archiveWebsite(website)

    // 2. Upload the archive to S3
    const uploadResult = await uploadToS3(
      archiveResult.archivePath,
      `backups/${website.slug}/${new Date().toISOString()}.zip`,
    )

    // 3. Create a backup record
    const [backup] = await db
      .insert(backups)
      .values({
        websiteId,
        storageUrl: uploadResult.url,
        size: archiveResult.size,
        type: backupType,
      })
      .returning()

    // 4. Update the website with the last backup date
    await db
      .update(websites)
      .set({
        lastBackup: new Date(),
      })
      .where(eq(websites.id, websiteId))

    // 5. Create a notification
    await createNotification({
      userId,
      clubId: website.clubId,
      type: "backup",
      title: "Website Backup Completed",
      message: `A ${backupType} backup for "${website.name}" has been completed. Backup size: ${formatBytes(archiveResult.size)}`,
    })

    // 6. Send an email notification
    await sendBackupCompletedEmail(
      website.clubId,
      website.name,
      formatBytes(archiveResult.size),
      "admin@example.com", // This should be the user's email
    )

    // Update job status to completed
    await db
      .update(jobs)
      .set({
        status: "completed",
        completedAt: new Date(),
        result: {
          backupId: backup.id,
          storageUrl: uploadResult.url,
          size: archiveResult.size,
        },
      })
      .where(eq(jobs.id, jobId))

    return { success: true, backupId: backup.id }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Backup process failed:", error)
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

export async function getBackupStatus(jobId: string) {
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
      console.error("Failed to get backup status:", error)
    }
    throw new Error(`Failed to get backup status: ${error}`)
  }
}

export async function getBackupHistory(websiteId: number) {
  try {
    const backupHistory = await db.query.backups.findMany({
      where: eq(backups.websiteId, websiteId),
      orderBy: [desc(backups.createdAt)],
    })

    return backupHistory
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get backup history:", error)
    }
    throw new Error(`Failed to get backup history: ${error}`)
  }
}

export async function restoreFromBackup(backupId: number, userId: number) {
  try {
    // Get the backup
    const backup = await db.query.backups.findFirst({
      where: eq(backups.id, backupId),
      with: {
        website: true,
      },
    })

    if (!backup) {
      throw new Error("Backup not found")
    }

    // Create a restore job
    const [job] = await db
      .insert(jobs)
      .values({
        type: "restore",
        status: "pending",
        data: { backupId, userId },
        websiteId: backup.websiteId,
      })
      .returning()

    // Start the restore process asynchronously
    processRestore(job.id).catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error("Restore process failed:", error)
      }
    })

    return { success: true, jobId: job.id }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to start restore:", error)
    }
    throw new Error(`Failed to start restore: ${error}`)
  }
}

async function processRestore(jobId: string) {
  // Implementation of the restore process
  // This would download the backup from S3, extract it, and restore the website
  // Similar to the backup process but in reverse
}

// Helper function to format bytes
function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
