import OpenAI from "openai"
import type { ImageGenerationOptions, GeneratedImage } from "./index"

interface OpenAIGenerationOptions extends ImageGenerationOptions {
  apiKey: string
}

export async function generateWithOpenAI(options: OpenAIGenerationOptions): Promise<GeneratedImage[]> {
  const { prompt, width = 1024, height = 1024, numImages = 1, apiKey } = options

  const openai = new OpenAI({
    apiKey,
  })

  try {
    const response = await openai.images.generate({
      prompt,
      n: numImages,
      size: `${width}x${height}`,
      response_format: "url",
    })

    return response.data.map((image) => ({
      url: image.url!,
      width,
      height,
      provider: "openai" as const,
      prompt,
      generatedAt: new Date(),
    }))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("OpenAI image generation error:", error)
    }
    throw new Error(`OpenAI image generation failed: ${error}`)
  }
}
