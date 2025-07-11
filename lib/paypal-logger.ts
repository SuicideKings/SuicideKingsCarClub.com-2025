import { db } from "@/lib/db"
import { paypalWebhookLogs, paypalTransactions } from "@/lib/db/schema"

export interface PayPalLogEntry {
  level: "info" | "warn" | "error"
  operation: string
  clubId: number
  message: string
  data?: any
  error?: Error
  timestamp?: Date
}

export class PayPalLogger {
  private static instance: PayPalLogger
  private logQueue: PayPalLogEntry[] = []
  private processingQueue = false

  static getInstance(): PayPalLogger {
    if (!PayPalLogger.instance) {
      PayPalLogger.instance = new PayPalLogger()
    }
    return PayPalLogger.instance
  }

  /**
   * Log a PayPal operation
   */
  async log(entry: PayPalLogEntry): Promise<void> {
    const logEntry: PayPalLogEntry = {
      ...entry,
      timestamp: new Date()
    }

    // Console logging for immediate feedback
    const logMessage = `[PayPal-${entry.level.toUpperCase()}] Club ${entry.clubId} - ${entry.operation}: ${entry.message}`
    
    switch (entry.level) {
      case "error":
        console.error(logMessage, entry.error || entry.data)
        break
      case "warn":
        console.warn(logMessage, entry.data)
        break
      default:
        console.info(logMessage, entry.data)
    }

    // Queue for database logging
    this.logQueue.push(logEntry)
    
    // Process queue if not already processing
    if (!this.processingQueue) {
      this.processQueue()
    }
  }

  /**
   * Log PayPal API errors
   */
  async logApiError(clubId: number, operation: string, error: Error, requestData?: any): Promise<void> {
    await this.log({
      level: "error",
      operation: `API-${operation}`,
      clubId,
      message: `PayPal API error: ${error.message}`,
      data: { requestData, errorStack: error.stack },
      error
    })
  }

  /**
   * Log PayPal webhook events
   */
  async logWebhookEvent(clubId: number, eventType: string, success: boolean, data?: any, error?: Error): Promise<void> {
    await this.log({
      level: success ? "info" : "error",
      operation: `WEBHOOK-${eventType}`,
      clubId,
      message: success ? `Webhook processed successfully` : `Webhook processing failed: ${error?.message || "Unknown error"}`,
      data,
      error
    })
  }

  /**
   * Log PayPal transaction events
   */
  async logTransaction(clubId: number, transactionType: string, amount: string, currency: string, success: boolean, data?: any): Promise<void> {
    await this.log({
      level: success ? "info" : "error",
      operation: `TRANSACTION-${transactionType}`,
      clubId,
      message: success ? `Transaction successful: ${amount} ${currency}` : `Transaction failed: ${amount} ${currency}`,
      data
    })
  }

  /**
   * Log PayPal setup operations
   */
  async logSetupOperation(clubId: number, operation: string, success: boolean, message: string, data?: any): Promise<void> {
    await this.log({
      level: success ? "info" : "error",
      operation: `SETUP-${operation}`,
      clubId,
      message,
      data
    })
  }

  /**
   * Process the log queue by writing to database
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.logQueue.length === 0) {
      return
    }

    this.processingQueue = true

    try {
      const batch = this.logQueue.splice(0, 10) // Process in batches of 10
      
      for (const entry of batch) {
        try {
          // Store in webhook logs table for now (we could create a separate logs table)
          await db.insert(paypalWebhookLogs).values({
            clubId: entry.clubId,
            webhookId: `LOG-${Date.now()}`,
            eventType: entry.operation,
            eventData: {
              level: entry.level,
              message: entry.message,
              data: entry.data,
              error: entry.error ? {
                message: entry.error.message,
                stack: entry.error.stack
              } : undefined,
              timestamp: entry.timestamp
            },
            processed: true,
            createdAt: entry.timestamp || new Date(),
            processedAt: new Date()
          })
        } catch (dbError) {
          console.error("Failed to log PayPal entry to database:", dbError)
        }
      }

      // Continue processing if there are more entries
      if (this.logQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100)
      } else {
        this.processingQueue = false
      }
    } catch (error) {
      console.error("Error processing PayPal log queue:", error)
      this.processingQueue = false
    }
  }

  /**
   * Get recent logs for a club
   */
  async getRecentLogs(clubId: number, limit: number = 100): Promise<any[]> {
    try {
      const logs = await db
        .select()
        .from(paypalWebhookLogs)
        .where(eq(paypalWebhookLogs.clubId, clubId))
        .orderBy(desc(paypalWebhookLogs.createdAt))
        .limit(limit)

      return logs.map(log => ({
        id: log.id,
        operation: log.eventType,
        level: log.eventData?.level || "info",
        message: log.eventData?.message || "No message",
        data: log.eventData?.data,
        error: log.eventData?.error,
        timestamp: log.createdAt
      }))
    } catch (error) {
      console.error("Failed to retrieve PayPal logs:", error)
      return []
    }
  }

  /**
   * Get error logs for a club
   */
  async getErrorLogs(clubId: number, limit: number = 50): Promise<any[]> {
    try {
      const logs = await db
        .select()
        .from(paypalWebhookLogs)
        .where(and(
          eq(paypalWebhookLogs.clubId, clubId),
          eq(paypalWebhookLogs.processed, false)
        ))
        .orderBy(desc(paypalWebhookLogs.createdAt))
        .limit(limit)

      return logs.map(log => ({
        id: log.id,
        operation: log.eventType,
        message: log.eventData?.message || log.errorMessage || "Unknown error",
        data: log.eventData?.data,
        error: log.eventData?.error,
        timestamp: log.createdAt
      }))
    } catch (error) {
      console.error("Failed to retrieve PayPal error logs:", error)
      return []
    }
  }

  /**
   * Clean up old logs
   */
  async cleanupOldLogs(olderThanDays: number = 30): Promise<void> {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays)

      await db
        .delete(paypalWebhookLogs)
        .where(
          and(
            lt(paypalWebhookLogs.createdAt, cutoffDate),
            like(paypalWebhookLogs.webhookId, "LOG-%")
          )
        )

      await this.log({
        level: "info",
        operation: "CLEANUP",
        clubId: 0,
        message: `Cleaned up PayPal logs older than ${olderThanDays} days`
      })
    } catch (error) {
      console.error("Failed to cleanup PayPal logs:", error)
    }
  }
}

// Export singleton instance
export const paypalLogger = PayPalLogger.getInstance()

// Helper functions for common logging patterns
export async function logPayPalError(clubId: number, operation: string, error: Error, data?: any): Promise<void> {
  await paypalLogger.logApiError(clubId, operation, error, data)
}

export async function logPayPalSuccess(clubId: number, operation: string, message: string, data?: any): Promise<void> {
  await paypalLogger.log({
    level: "info",
    operation,
    clubId,
    message,
    data
  })
}

export async function logPayPalWarning(clubId: number, operation: string, message: string, data?: any): Promise<void> {
  await paypalLogger.log({
    level: "warn",
    operation,
    clubId,
    message,
    data
  })
}

// Import necessary functions for the database operations
import { eq, and, lt, desc, like } from "drizzle-orm"