import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { eq, and } from "drizzle-orm"

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

    const keys = await db.query.apiKeys.findMany({
      where: eq(apiKeys.clubId, Number.parseInt(clubId)),
      orderBy: (apiKeys, { asc }) => [asc(apiKeys.service)],
    })

    // Mask API keys for security
    const maskedKeys = keys.map((key) => ({
      ...key,
      apiKey: maskApiKey(key.apiKey),
    }))

    return NextResponse.json({ apiKeys: maskedKeys })
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return NextResponse.json({ error: "Failed to fetch API keys" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { clubId, service, apiKey } = await request.json()

    if (!clubId || !service || !apiKey) {
      return NextResponse.json({ error: "Club ID, service, and API key are required" }, { status: 400 })
    }

    // Check if an API key for this service already exists
    const existingKey = await db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.clubId, clubId), eq(apiKeys.service, service)),
    })

    if (existingKey) {
      // Update the existing key
      const [updatedKey] = await db
        .update(apiKeys)
        .set({
          apiKey,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(apiKeys.id, existingKey.id))
        .returning()

      return NextResponse.json({
        apiKey: {
          ...updatedKey,
          apiKey: maskApiKey(updatedKey.apiKey),
        },
      })
    } else {
      // Create a new key
      const [newKey] = await db
        .insert(apiKeys)
        .values({
          clubId,
          service,
          apiKey,
        })
        .returning()

      return NextResponse.json(
        {
          apiKey: {
            ...newKey,
            apiKey: maskApiKey(newKey.apiKey),
          },
        },
        { status: 201 },
      )
    }
  } catch (error) {
    console.error("Error creating/updating API key:", error)
    return NextResponse.json({ error: "Failed to create/update API key" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "API key ID is required" }, { status: 400 })
    }

    await db.delete(apiKeys).where(eq(apiKeys.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting API key:", error)
    return NextResponse.json({ error: "Failed to delete API key" }, { status: 500 })
  }
}

// Helper function to mask API keys
function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "****" + apiKey.slice(-4)
  }

  // Show first 4 and last 4 characters, mask the rest
  return apiKey.slice(0, 4) + "****" + apiKey.slice(-4)
}
