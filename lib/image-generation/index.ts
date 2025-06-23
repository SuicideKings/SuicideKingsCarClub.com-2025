import { generateWithOpenAI } from "./openai"
import { generateWithStabilityAI } from "./stability"
import { generateWithMidjourney } from "./midjourney"
import { generateWithDalle } from "./dalle"
import { db } from "../db"
import { apiKeys } from "../db/schema"
import { eq, and } from "drizzle-orm"

export type ImageGenerationProvider = "openai" | "stability" | "midjourney" | "dalle"

export interface ImageGenerationOptions {
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  numImages?: number
  clubId: number
  provider: ImageGenerationProvider
}

export interface GeneratedImage {
  url: string
  width: number
  height: number
  provider: ImageGenerationProvider
  prompt: string
  generatedAt: Date
}

export async function generateImages(options: ImageGenerationOptions): Promise<GeneratedImage[]> {
  // Get the API key for the specified provider and club
  const apiKeyRecord = await db.query.apiKeys.findFirst({
    where: and(eq(apiKeys.clubId, options.clubId), eq(apiKeys.service, options.provider), eq(apiKeys.isActive, true)),
  })

  if (!apiKeyRecord) {
    throw new Error(`No active API key found for ${options.provider}`)
  }

  // Generate images based on the provider
  switch (options.provider) {
    case "openai":
      return generateWithOpenAI({
        ...options,
        apiKey: apiKeyRecord.apiKey,
      })
    case "stability":
      return generateWithStabilityAI({
        ...options,
        apiKey: apiKeyRecord.apiKey,
      })
    case "midjourney":
      return generateWithMidjourney({
        ...options,
        apiKey: apiKeyRecord.apiKey,
      })
    case "dalle":
      return generateWithDalle({
        ...options,
        apiKey: apiKeyRecord.apiKey,
      })
    default:
      throw new Error(`Unsupported provider: ${options.provider}`)
  }
}

// Get available providers for a club
export async function getAvailableProviders(clubId: number): Promise<ImageGenerationProvider[]> {
  const availableKeys = await db.query.apiKeys.findMany({
    where: and(eq(apiKeys.clubId, clubId), eq(apiKeys.isActive, true)),
  })

  return availableKeys
    .map((key) => key.service as ImageGenerationProvider)
    .filter((service) => ["openai", "stability", "midjourney", "dalle"].includes(service))
}
