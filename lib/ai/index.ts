import { generateWithAnthropic } from "./anthropic"
import { generateWithDeepseek } from "./deepseek"
import { db } from "../db"
import { apiKeys } from "../db/schema"
import { eq, and } from "drizzle-orm"

export type AIProvider = "anthropic" | "deepseek"

export interface AIGenerationOptions {
  prompt: string
  maxTokens?: number
  temperature?: number
  clubId: number
  provider: AIProvider
  systemPrompt?: string
}

export interface AIResponse {
  text: string
  provider: AIProvider
  promptTokens: number
  completionTokens: number
  totalTokens: number
  generatedAt: Date
}

export async function generateText(options: AIGenerationOptions): Promise<AIResponse> {
  // Get the API key for the specified provider and club
  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.clubId, options.clubId), eq(apiKeys.service, options.provider), eq(apiKeys.isActive, true)),
  })

  if (!apiKeyRecord) {
    throw new Error(`No active API key found for ${options.provider}`)
  }

  // Generate text based on the provider
  switch (options.provider) {
    case "anthropic":
      return generateWithAnthropic({
        ...options,
        apiKey: apiKeyRecord.apiKey,
      })
    case "deepseek":
      return generateWithDeepseek({
        ...options,
        apiKey: apiKeyRecord.apiKey,
      })
    default:
      throw new Error(`Unsupported provider: ${options.provider}`)
  }
}

// Get available AI providers for a club
export async function getAvailableAIProviders(clubId: number): Promise<AIProvider[]> {
  const availableKeys = await db.query.apiKeys.findMany({
    where: and(eq(apiKeys.clubId, clubId), eq(apiKeys.isActive, true)),
  })

  return availableKeys
    .map((key) => key.service as AIProvider)
    .filter((service) => ["anthropic", "deepseek"].includes(service))
}
