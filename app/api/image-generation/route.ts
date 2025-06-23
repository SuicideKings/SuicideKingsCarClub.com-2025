import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateImages, getAvailableProviders } from "@/lib/image-generation"

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

    const providers = await getAvailableProviders(Number.parseInt(clubId))

    return NextResponse.json({ providers })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching available image providers:", error)
    }
    return NextResponse.json({ error: "Failed to fetch available image providers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt, negativePrompt, width, height, numImages, clubId, provider } = await request.json()

    if (!prompt || !clubId || !provider) {
      return NextResponse.json({ error: "Prompt, club ID, and provider are required" }, { status: 400 })
    }

    const images = await generateImages({
      prompt,
      negativePrompt,
      width,
      height,
      numImages,
      clubId,
      provider,
    })

    return NextResponse.json({ images })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating images:", error)
    }
    return NextResponse.json({ error: "Failed to generate images" }, { status: 500 })
  }
}
