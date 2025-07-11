import { db } from "./db"
import { paypalWebhookLogs, paypalTransactions, clubs } from "./db/schema"
import { eq, and, gte, lte, desc, sql } from "drizzle-orm"

export interface PayPalMetrics {
  totalTransactions: number
  totalRevenue: number
  successfulTransactions: number
  failedTransactions: number
  pendingTransactions: number
  averageTransactionAmount: number
  webhookEvents: {
    total: number
    processed: number
    failed: number
  }
  recentActivity: Array<{
    type: 'transaction' | 'webhook'
    status: string
    amount?: number
    timestamp: Date
    description: string
  }>
}

export interface ClubPayPalHealth {
  clubId: number
  clubName: string
  hasCredentials: boolean
  hasProducts: boolean
  connectionStatus: 'healthy' | 'warning' | 'error'
  lastSuccessfulWebhook?: Date
  lastFailedWebhook?: Date
  transactionCount: number
  revenue: number
  issues: string[]
}

export async function getClubPayPalMetrics(
  clubId: number, 
  startDate?: Date, 
  endDate?: Date
): Promise<PayPalMetrics> {
  const start = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  const end = endDate || new Date()

  try {
    // Get transaction metrics
    const transactions = await db
      .select({
        count: sql<number>`count(*)`,
        totalAmount: sql<number>`sum(${paypalTransactions.amount})`,
        averageAmount: sql<number>`avg(${paypalTransactions.amount})`,
        status: paypalTransactions.status
      })
      .from(paypalTransactions)
      .where(
        and(
          eq(paypalTransactions.clubId, clubId),
          gte(paypalTransactions.createdAt, start),
          lte(paypalTransactions.createdAt, end)
        )
      )
      .groupBy(paypalTransactions.status)

    // Get webhook metrics
    const webhookStats = await db
      .select({
        total: sql<number>`count(*)`,
        processed: sql<number>`sum(case when ${paypalWebhookLogs.processed} then 1 else 0 end)`,
        failed: sql<number>`sum(case when not ${paypalWebhookLogs.processed} then 1 else 0 end)`
      })
      .from(paypalWebhookLogs)
      .where(
        and(
          eq(paypalWebhookLogs.clubId, clubId),
          gte(paypalWebhookLogs.createdAt, start),
          lte(paypalWebhookLogs.createdAt, end)
        )
      )

    // Get recent activity
    const recentTransactions = await db
      .select({
        type: sql<'transaction'>`'transaction'`,
        status: paypalTransactions.status,
        amount: paypalTransactions.amount,
        timestamp: paypalTransactions.createdAt,
        description: paypalTransactions.description
      })
      .from(paypalTransactions)
      .where(eq(paypalTransactions.clubId, clubId))
      .orderBy(desc(paypalTransactions.createdAt))
      .limit(10)

    const recentWebhooks = await db
      .select({
        type: sql<'webhook'>`'webhook'`,
        status: sql<string>`case when ${paypalWebhookLogs.processed} then 'processed' else 'failed' end`,
        amount: sql<null>`null`,
        timestamp: paypalWebhookLogs.createdAt,
        description: sql<string>`concat('Webhook: ', ${paypalWebhookLogs.eventType})`
      })
      .from(paypalWebhookLogs)
      .where(eq(paypalWebhookLogs.clubId, clubId))
      .orderBy(desc(paypalWebhookLogs.createdAt))
      .limit(10)

    // Combine and sort recent activity
    const recentActivity = [...recentTransactions, ...recentWebhooks]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)

    // Calculate totals
    const totalTransactions = transactions.reduce((sum, t) => sum + t.count, 0)
    const totalRevenue = transactions.reduce((sum, t) => sum + (t.totalAmount || 0), 0)
    const successfulTransactions = transactions.find(t => t.status === 'completed')?.count || 0
    const failedTransactions = transactions.find(t => t.status === 'failed')?.count || 0
    const pendingTransactions = transactions.find(t => t.status === 'pending')?.count || 0
    const averageTransactionAmount = transactions.length > 0 
      ? transactions.reduce((sum, t) => sum + (t.averageAmount || 0), 0) / transactions.length 
      : 0

    const webhookEvents = webhookStats[0] || { total: 0, processed: 0, failed: 0 }

    return {
      totalTransactions,
      totalRevenue,
      successfulTransactions,
      failedTransactions,
      pendingTransactions,
      averageTransactionAmount,
      webhookEvents,
      recentActivity
    }

  } catch (error) {
    console.error(`Error getting PayPal metrics for club ${clubId}:`, error)
    throw error
  }
}

export async function getSystemPayPalHealth(): Promise<ClubPayPalHealth[]> {
  try {
    const clubsData = await db
      .select({
        id: clubs.id,
        name: clubs.name,
        paypalSettings: clubs.paypalSettings,
        paypalProductId: clubs.paypalProductId,
        paypalMonthlyPlanId: clubs.paypalMonthlyPlanId,
        paypalYearlyPlanId: clubs.paypalYearlyPlanId
      })
      .from(clubs)
      .where(eq(clubs.isActive, true))

    const healthChecks: ClubPayPalHealth[] = []

    for (const club of clubsData) {
      const paypalSettings = club.paypalSettings as any
      const hasCredentials = !!(paypalSettings?.clientId && paypalSettings?.clientSecret)
      const hasProducts = !!(club.paypalProductId && club.paypalMonthlyPlanId && club.paypalYearlyPlanId)

      // Get recent webhook activity
      const recentWebhooks = await db
        .select({
          processed: paypalWebhookLogs.processed,
          createdAt: paypalWebhookLogs.createdAt
        })
        .from(paypalWebhookLogs)
        .where(eq(paypalWebhookLogs.clubId, club.id))
        .orderBy(desc(paypalWebhookLogs.createdAt))
        .limit(10)

      const lastSuccessfulWebhook = recentWebhooks.find(w => w.processed)?.createdAt
      const lastFailedWebhook = recentWebhooks.find(w => !w.processed)?.createdAt

      // Get transaction stats
      const transactionStats = await db
        .select({
          count: sql<number>`count(*)`,
          totalAmount: sql<number>`sum(${paypalTransactions.amount})`
        })
        .from(paypalTransactions)
        .where(eq(paypalTransactions.clubId, club.id))

      const transactionCount = transactionStats[0]?.count || 0
      const revenue = transactionStats[0]?.totalAmount || 0

      // Determine connection status
      let connectionStatus: 'healthy' | 'warning' | 'error' = 'healthy'
      const issues: string[] = []

      if (!hasCredentials) {
        connectionStatus = 'error'
        issues.push('No PayPal credentials configured')
      } else if (!hasProducts) {
        connectionStatus = 'warning'
        issues.push('PayPal products not configured')
      }

      // Check for recent webhook failures
      const recentFailures = recentWebhooks.filter(w => 
        !w.processed && 
        w.createdAt > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length

      if (recentFailures > 5) {
        connectionStatus = 'error'
        issues.push(`${recentFailures} webhook failures in last 24 hours`)
      } else if (recentFailures > 2) {
        connectionStatus = 'warning'
        issues.push(`${recentFailures} webhook failures in last 24 hours`)
      }

      // Check for old last successful webhook
      if (lastSuccessfulWebhook && lastSuccessfulWebhook < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) {
        if (connectionStatus === 'healthy') connectionStatus = 'warning'
        issues.push('No successful webhooks in last 7 days')
      }

      healthChecks.push({
        clubId: club.id,
        clubName: club.name,
        hasCredentials,
        hasProducts,
        connectionStatus,
        lastSuccessfulWebhook,
        lastFailedWebhook,
        transactionCount,
        revenue,
        issues
      })
    }

    return healthChecks

  } catch (error) {
    console.error('Error getting system PayPal health:', error)
    throw error
  }
}

export async function getPayPalAuditLog(clubId: number, limit = 50) {
  try {
    const auditEntries = await db
      .select({
        id: paypalWebhookLogs.id,
        type: sql<'webhook'>`'webhook'`,
        timestamp: paypalWebhookLogs.createdAt,
        status: sql<string>`case when ${paypalWebhookLogs.processed} then 'success' else 'failed' end`,
        details: sql<string>`concat('Event: ', ${paypalWebhookLogs.eventType})`,
        errorMessage: paypalWebhookLogs.errorMessage,
        metadata: paypalWebhookLogs.eventData
      })
      .from(paypalWebhookLogs)
      .where(eq(paypalWebhookLogs.clubId, clubId))
      .orderBy(desc(paypalWebhookLogs.createdAt))
      .limit(limit)

    return auditEntries

  } catch (error) {
    console.error(`Error getting PayPal audit log for club ${clubId}:`, error)
    throw error
  }
}

export async function cleanupOldLogs(daysToKeep = 90) {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
  
  try {
    // Clean up old webhook logs
    const deletedWebhooks = await db
      .delete(paypalWebhookLogs)
      .where(lte(paypalWebhookLogs.createdAt, cutoffDate))

    // Clean up old transaction records (keep forever, but could be archived)
    console.log(`Cleaned up webhook logs older than ${daysToKeep} days`)
    
    return {
      deletedWebhookLogs: deletedWebhooks.rowCount || 0
    }

  } catch (error) {
    console.error('Error cleaning up old PayPal logs:', error)
    throw error
  }
}