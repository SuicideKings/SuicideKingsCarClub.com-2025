// Advanced analytics and reporting system
export interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: Date
}

export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  memberActivity: {
    newMembers: number
    activeMembers: number
    memberRetention: number
  }
  eventMetrics: {
    totalEvents: number
    averageAttendance: number
    upcomingEvents: number
  }
  forumActivity: {
    totalPosts: number
    activeTopics: number
    newTopics: number
  }
  storeMetrics: {
    totalOrders: number
    revenue: number
    topProducts: Array<{
      name: string
      sales: number
      revenue: number
    }>
  }
}

class AnalyticsManager {
  private static instance: AnalyticsManager
  private events: AnalyticsEvent[] = []

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager()
    }
    return AnalyticsManager.instance
  }

  // Track events
  track(event: string, properties?: Record<string, any>, userId?: string): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      userId,
      timestamp: new Date(),
    }

    this.events.push(analyticsEvent)

    // Send to analytics service (Google Analytics, Mixpanel, etc.)
    this.sendToAnalyticsService(analyticsEvent)

    // Store locally for offline capability
    this.storeLocally(analyticsEvent)
  }

  // Track page views
  trackPageView(page: string, userId?: string): void {
    this.track("page_view", { page }, userId)
  }

  // Track member actions
  trackMemberAction(action: string, memberId: string, properties?: Record<string, any>): void {
    this.track("member_action", { action, ...properties }, memberId)
  }

  // Track event interactions
  trackEventInteraction(eventId: string, action: string, memberId?: string): void {
    this.track("event_interaction", { eventId, action }, memberId)
  }

  // Track store interactions
  trackStoreInteraction(action: string, productId?: string, memberId?: string): void {
    this.track("store_interaction", { action, productId }, memberId)
  }

  // Get analytics data
  async getAnalyticsData(startDate: Date, endDate: Date): Promise<AnalyticsData> {
    try {
      const response = await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate }),
      })

      if (!response.ok) throw new Error("Failed to fetch analytics")

      return await response.json()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Analytics fetch error:", error)
      }
      throw error
    }
  }

  // Generate reports
  async generateReport(type: "member" | "event" | "financial" | "engagement", options: any): Promise<any> {
    try {
      const response = await fetch("/api/analytics/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, options }),
      })

      if (!response.ok) throw new Error("Failed to generate report")

      return await response.json()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Report generation error:", error)
      }
      throw error
    }
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // Integration with Google Analytics 4
    if (typeof gtag !== "undefined") {
      ;(window as any).gtag("event", event.event, {
        custom_parameter: event.properties,
        user_id: event.userId,
      })
    }

    // Integration with other analytics services can be added here
  }

  private storeLocally(event: AnalyticsEvent): void {
    try {
      const stored = localStorage.getItem("analytics_events") || "[]"
      const events = JSON.parse(stored)
      events.push(event)

      // Keep only last 100 events locally
      if (events.length > 100) {
        events.splice(0, events.length - 100)
      }

      localStorage.setItem("analytics_events", JSON.stringify(events))
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Local storage error:", error)
      }
    }
  }

  // Sync offline events when back online
  async syncOfflineEvents(): Promise<void> {
    try {
      const stored = localStorage.getItem("analytics_events")
      if (!stored) return

      const events = JSON.parse(stored)
      if (events.length === 0) return

      await fetch("/api/analytics/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      })

      // Clear synced events
      localStorage.removeItem("analytics_events")
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Sync error:", error)
      }
    }
  }
}

export default AnalyticsManager
