import axios from "axios"

interface DeepseekOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  apiKey?: string
}

export async function generateWithDeepseek(prompt: string, options: DeepseekOptions = {}) {
  try {
    const { model = "deepseek-coder", temperature = 0.7, maxTokens = 1024, topP = 0.95, apiKey } = options

    // Use provided API key or fall back to environment variable
    const key = apiKey || process.env.DEEPSEEK_API_KEY

    if (!key) {
      throw new Error("Deepseek API key is required")
    }

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      },
    )

    return {
      success: true,
      text: response.data.choices[0].message.content,
      usage: response.data.usage,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating with Deepseek:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
