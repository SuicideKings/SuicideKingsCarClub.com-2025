import { db } from "./db"
import { clubs, websites, jobs } from "./db/schema"
import { eq, lt, and, isNull, or, gt } from "drizzle-orm"
import { sendBillingReminder } from "./email"
import { createBackup } from "./backup"
import { checkForUpdates } from "./updates"

// Schedule billing reminders
export async function scheduleBillingReminders() {
  try {
    // Get clubs with upcoming billing dates
    const now = new Date()
    const thirtyDaysFromNow = new Date(now)
    thirtyDaysFromNow.setDate(now.getDate() + 30)

    const sevenDaysFromNow = new Date(now)
    sevenDaysFromNow.setDate(now.getDate() + 7)

    const threeDaysFromNow = new Date(now)
    threeDaysFromNow.setDate(now.getDate() + 3)

    const oneDayFromNow = new Date(now)
    oneDayFromNow.setDate(now.getDate() + 1)

    // Get clubs with billing dates in the next 30 days
    const clubsWithUpcomingBilling = await db.query.clubs.findMany({
      where: and(
        eq(clubs.active, true),
        eq(clubs.subscriptionStatus, "active"),
        lt(clubs.nextBillingDate, thirtyDaysFromNow),
      ),
    })

    for (const club of clubsWithUpcomingBilling) {
      if (!club.nextBillingDate || !club.billingEmail) continue

      const daysUntilBilling = Math.ceil((club.nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      // Send reminders at 30, 7, 3, and 1 days before billing
      if (
        (daysUntilBilling <= 30 && daysUntilBilling > 7 && club.remindersSent === 0) ||
        (daysUntilBilling <= 7 && daysUntilBilling > 3 && club.remindersSent === 1) ||
        (daysUntilBilling <= 3 && daysUntilBilling > 1 && club.remindersSent === 2) ||
        (daysUntilBilling === 1 && club.remindersSent === 3)
      ) {
        await sendBillingReminder(club.id, daysUntilBilling)

        // Update the reminders sent count
        await db
          .update(clubs)
          .set({
            remindersSent: club.remindersSent + 1,
          })
          .where(eq(clubs.id, club.id))
      }
    }

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error scheduling billing reminders:", error)
    }
    return { success: false, error }
  }
}

// Schedule automatic backups
export async function scheduleAutomaticBackups() {
  try {
    // Get websites that haven't been backed up in the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const websitesNeedingBackup = await db.query.websites.findMany({
      where: and(
        eq(websites.status, "published"),
        or(isNull(websites.lastBackup), lt(websites.lastBackup, sevenDaysAgo)),
      ),
    })

    for (const website of websitesNeedingBackup) {
      // Create a system user ID for automatic backups
      const systemUserId = 0

      // Create an automatic backup
      await createBackup(website.id, systemUserId, "automatic")
    }

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error scheduling automatic backups:", error)
    }
    return { success: false, error }
  }
}

// Schedule update checks
export async function scheduleUpdateChecks() {
  try {
    // Check for updates once a day
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    // Check if we've already checked for updates in the last 24 hours
    const recentUpdateCheck = await db.query.jobs.findFirst({
      where: and(eq(jobs.type, "update-check"), gt(jobs.createdAt, oneDayAgo)),
    })

    if (!recentUpdateCheck) {
      await checkForUpdates()
    }

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error scheduling update checks:", error)
    }
    return { success: false, error }
  }
}
