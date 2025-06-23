import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateText, getAvailableAIProviders } from "@/lib/ai"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const clubId = url.searchParams.get("clubId")

    if (!clubId) {
      return NextResponse.json({ error: "Club ID is required" }, { status: 400 })
    }

    const providers = await getAvailableAIProviders(Number.parseInt(clubId))

    return NextResponse.json({ providers })
  } catch (error) {
    console.error("Error fetching available AI providers:", error)
    return NextResponse.json({ error: "Failed to fetch available AI providers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, maxTokens, temperature, clubId, provider, systemPrompt } = await request.json()

    if (!prompt || !clubId || !provider) {
      return NextResponse.json({ error: "Prompt, club ID, and provider are required" }, { status: 400 })
    }

    const response = await generateText({
      prompt,
      maxTokens,
      temperature,
      clubId,
      provider,
      systemPrompt,
    })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error generating text:", error)
    return NextResponse.json({ error: "Failed to generate text" }, { status: 500 })
  }
}
