import { db } from "./db"
import { notifications } from "./db/schema"
import { eq, count, and, desc } from "drizzle-orm"

export interface CreateNotificationParams {
  userId?: number
  clubId: number
  type: string
  title: string
  message: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const [notification] = await db
      .insert(notifications)
      .values({
        userId: params.userId,
        clubId: params.clubId,
        type: params.type,
        title: params.title,
        message: params.message,
      })
      .returning()

    return notification
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to create notification:", error)
    }
    throw new Error(`Failed to create notification: ${error}`)
  }
}

export async function markNotificationAsRead(notificationId: number) {
  try {
    await db.update(notifications).set({ read: true }).where(eq(notifications.id, notificationId))

    return { success: true }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to mark notification as read:", error)
    }
    throw new Error(`Failed to mark notification as read: ${error}`)
  }
}

export async function getUnreadNotificationsCount(userId: number) {
  try {
    const result = await db
      .select({ count: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))

    return result[0]?.count || 0
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get unread notifications count:", error)
    }
    throw new Error(`Failed to get unread notifications count: ${error}`)
  }
}

export async function getUserNotifications(userId: number, limit = 20, offset = 0) {
  try {
    const userNotifications = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    })

    return userNotifications
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get user notifications:", error)
    }
    throw new Error(`Failed to get user notifications: ${error}`)
  }
}

export async function getClubNotifications(clubId: number, limit = 20, offset = 0) {
  try {
    const clubNotifications = await db.query.notifications.findMany({
      where: eq(notifications.clubId, clubId),
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    })

    return clubNotifications
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get club notifications:", error)
    }
    throw new Error(`Failed to get club notifications: ${error}`)
  }
}
