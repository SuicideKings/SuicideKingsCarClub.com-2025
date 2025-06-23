import axios from "axios"

interface StabilityAIOptions {
  height?: number
  width?: number
  cfgScale?: number
  steps?: number
  apiKey?: string
  engine?: string
}

export async function generateWithStabilityAI(prompt: string, options: StabilityAIOptions = {}) {
  try {
    const {
      height = 512,
      width = 512,
      cfgScale = 7,
      steps = 30,
      apiKey,
      engine = "stable-diffusion-xl-1024-v1-0",
    } = options

    // Use provided API key or fall back to environment variable
    const key = apiKey || process.env.STABILITY_API_KEY

    if (!key) {
      throw new Error("Stability AI API key is required")
    }

    const response = await axios.post(
      `https://api.stability.ai/v1/generation/${engine}/text-to-image`,
      {
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
        cfg_scale: cfgScale,
        height,
        width,
        steps,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${key}`,
        },
        responseType: "json",
      },
    )

    const images = response.data.artifacts.map((artifact: any) => ({
      base64: artifact.base64,
      seed: artifact.seed,
      finishReason: artifact.finish_reason,
    }))

    return {
      success: true,
      images,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating with Stability AI:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
