import { db } from "./db"
import { websites, jobs, websiteVersions } from "./db/schema"
import { eq, and, desc } from "drizzle-orm"
import { createNotification } from "./notifications"
import { sendWebsiteDeployedEmail } from "./email"
import { uploadToVercel } from "./vercel"
import { mirrorToSubfolder } from "./mirror"
import { createBackup } from "./backup"

export async function deployWebsite(websiteId: number, userId: number) {
  try {
    // Create a deployment job
    const [job] = await db
      .insert(jobs)
      .values({
        type: "deploy",
        status: "pending",
        data: { websiteId, userId },
        websiteId,
      })
      .returning()

    // Start the deployment process asynchronously
    processDeployment(job.id).catch((error) => {
      console.error("Deployment process failed:", error)
    })

    return { success: true, jobId: job.id }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to start deployment:", error)
    }
    throw new Error(`Failed to start deployment: ${error}`)
  }
}

async function processDeployment(jobId: string) {
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

    const { websiteId, userId } = job.data as { websiteId: number; userId: number }

    // Get the website
    const website = await db.query.websites.findFirst({
      where: eq(websites.id, websiteId),
    })

    if (!website) {
      throw new Error("Website not found")
    }

    // Get the active version
    const activeVersion = await db.query.websiteVersions.findFirst({
      where: and(eq(websiteVersions.websiteId, websiteId), eq(websiteVersions.isActive, true)),
    })

    if (!activeVersion) {
      throw new Error("No active version found for the website")
    }

    // 1. Mirror the website to a subfolder
    const mirrorResult = await mirrorToSubfolder(website, activeVersion)

    // 2. Deploy to Vercel
    const deploymentResult = await uploadToVercel(website, mirrorResult.folderPath)

    // 3. Create a backup
    await createBackup(websiteId, userId, "post-deployment")

    // 4. Update the website with the deployment URL
    await db
      .update(websites)
      .set({
        publishedUrl: deploymentResult.url,
        lastDeployed: new Date(),
      })
      .where(eq(websites.id, websiteId))

    // 5. Create a notification
    await createNotification({
      userId,
      clubId: website.clubId,
      type: "deployment",
      title: "Website Deployed Successfully",
      message: `The website "${website.name}" has been successfully deployed to ${deploymentResult.url}`,
    })

    // 6. Send an email notification
    await sendWebsiteDeployedEmail(
      website.clubId,
      website.name,
      deploymentResult.url,
      "admin@example.com", // This should be the user's email
    )

    // Update job status to completed
    await db
      .update(jobs)
      .set({
        status: "completed",
        completedAt: new Date(),
        result: {
          deploymentUrl: deploymentResult.url,
          mirrorPath: mirrorResult.folderPath,
        },
      })
      .where(eq(jobs.id, jobId))

    return { success: true }
  } catch (error) {
    console.error("Deployment process failed:", error)

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

export async function getDeploymentStatus(jobId: string) {
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
      console.error("Failed to get deployment status:", error)
    }
    throw new Error(`Failed to get deployment status: ${error}`)
  }
}

export async function getDeploymentHistory(websiteId: number) {
  try {
    const deployments = await db.query.jobs.findMany({
      where: and(eq(jobs.websiteId, websiteId), eq(jobs.type, "deploy")),
      orderBy: [desc(jobs.createdAt)],
    })

    return deployments
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get deployment history:", error)
    }
    throw new Error(`Failed to get deployment history: ${error}`)
  }
}
