import Anthropic from "@anthropic-ai/sdk"
import type { AIGenerationOptions, AIResponse } from "./index"

interface AnthropicGenerationOptions extends AIGenerationOptions {
  apiKey: string
}

export async function generateWithAnthropic(options: AnthropicGenerationOptions): Promise<AIResponse> {
  const {
    prompt,
    maxTokens = 1000,
    temperature = 0.7,
    apiKey,
    systemPrompt = "You are a helpful assistant that provides accurate and concise information.",
  } = options

  const anthropic = new Anthropic({
    apiKey,
  })

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    return {
      text: response.content[0].text,
      provider: "anthropic" as const,
      promptTokens: response.usage.input_tokens,
      completionTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      generatedAt: new Date(),
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Anthropic text generation error:", error)
    }
    throw new Error(`Anthropic generation failed: ${error}`)
  }
}
