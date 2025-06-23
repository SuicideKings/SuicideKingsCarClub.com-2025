import axios from "axios"

interface DalleOptions {
  n?: number
  size?: "256x256" | "512x512" | "1024x1024" | "1792x1024" | "1024x1792"
  quality?: "standard" | "hd"
  style?: "vivid" | "natural"
  apiKey?: string
  model?: string
}

export async function generateWithDalle(prompt: string, options: DalleOptions = {}) {
  try {
    const { n = 1, size = "1024x1024", quality = "standard", style = "vivid", apiKey, model = "dall-e-3" } = options

    // Use provided API key or fall back to environment variable
    const key = apiKey || process.env.OPENAI_API_KEY

    if (!key) {
      throw new Error("OpenAI API key is required")
    }

    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model,
        prompt,
        n,
        size,
        quality,
        style,
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
      data: response.data.data,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating with DALL-E:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
