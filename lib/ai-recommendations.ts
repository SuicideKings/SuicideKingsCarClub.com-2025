// AI-powered recommendation system
export interface RecommendationContext {
  memberId: string
  memberPreferences: Record<string, any>
  memberHistory: Array<{
    type: "event" | "product" | "forum" | "car"
    id: string
    interaction: string
    timestamp: Date
  }>
  currentLocation?: {
    lat: number
    lng: number
  }
}

export interface Recommendation {
  id: string
  type: "event" | "product" | "member" | "forum_topic" | "car"
  title: string
  description: string
  score: number
  reason: string
  metadata: Record<string, any>
}

class AIRecommendationEngine {
  private static instance: AIRecommendationEngine

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine()
    }
    return AIRecommendationEngine.instance
  }

  // Get personalized recommendations
  async getRecommendations(context: RecommendationContext): Promise<Recommendation[]> {
    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      })

      if (!response.ok) throw new Error("Failed to get recommendations")

      return await response.json()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Recommendation error:", error)
      }
      return this.getFallbackRecommendations(context)
    }
  }

  // Get event recommendations
  async getEventRecommendations(memberId: string): Promise<Recommendation[]> {
    const context = await this.buildMemberContext(memberId)
    const allRecommendations = await this.getRecommendations(context)
    return allRecommendations.filter((r) => r.type === "event")
  }

  // Get product recommendations
  async getProductRecommendations(memberId: string): Promise<Recommendation[]> {
    const context = await this.buildMemberContext(memberId)
    const allRecommendations = await this.getRecommendations(context)
    return allRecommendations.filter((r) => r.type === "product")
  }

  // Get member connection recommendations
  async getMemberRecommendations(memberId: string): Promise<Recommendation[]> {
    const context = await this.buildMemberContext(memberId)
    const allRecommendations = await this.getRecommendations(context)
    return allRecommendations.filter((r) => r.type === "member")
  }

  // Get forum topic recommendations
  async getForumRecommendations(memberId: string): Promise<Recommendation[]> {
    const context = await this.buildMemberContext(memberId)
    const allRecommendations = await this.getRecommendations(context)
    return allRecommendations.filter((r) => r.type === "forum_topic")
  }

  // Build member context for recommendations
  private async buildMemberContext(memberId: string): Promise<RecommendationContext> {
    try {
      const response = await fetch(`/api/members/${memberId}/context`)
      if (!response.ok) throw new Error("Failed to get member context")

      return await response.json()
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Context building error:", error)
      }
      return {
        memberId,
        memberPreferences: {},
        memberHistory: [],
      }
    }
  }

  // Fallback recommendations when AI service is unavailable
  private getFallbackRecommendations(context: RecommendationContext): Recommendation[] {
    return [
      {
        id: "fallback-1",
        type: "event",
        title: "Upcoming Chapter Meeting",
        description: "Join your local chapter for the monthly meeting",
        score: 0.8,
        reason: "Based on your chapter membership",
        metadata: {},
      },
      {
        id: "fallback-2",
        type: "product",
        title: "SKCC Merchandise",
        description: "Show your club pride with official merchandise",
        score: 0.7,
        reason: "Popular among members",
        metadata: {},
      },
    ]
  }

  // Track recommendation interactions
  async trackRecommendationInteraction(
    recommendationId: string,
    memberId: string,
    action: "view" | "click" | "dismiss" | "convert",
  ): Promise<void> {
    try {
      await fetch("/api/ai/recommendations/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId,
          memberId,
          action,
          timestamp: new Date(),
        }),
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Tracking error:", error)
      }
    }
  }
}

export default AIRecommendationEngine
