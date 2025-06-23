import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createVersion, getVersionHistory, activateVersion, compareVersions } from "@/lib/versioning"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const websiteId = Number.parseInt(params.id)
    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    if (action === "compare") {
      const version1 = url.searchParams.get("version1")
      const version2 = url.searchParams.get("version2")

      if (!version1 || !version2) {
        return NextResponse.json({ error: "Both version IDs are required for comparison" }, { status: 400 })
      }

      const comparison = await compareVersions(Number.parseInt(version1), Number.parseInt(version2))

      return NextResponse.json({ comparison })
    } else {
      const versions = await getVersionHistory(websiteId)
      return NextResponse.json({ versions })
    }
  } catch (error) {
    console.error("Error fetching website versions:", error)
    return NextResponse.json({ error: "Failed to fetch website versions" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const websiteId = Number.parseInt(params.id)
    const { changes, snapshot, userId } = await request.json()

    if (!changes || !snapshot) {
      return NextResponse.json({ error: "Changes and snapshot are required" }, { status: 400 })
    }

    const version = await createVersion(websiteId, userId || (session.user as any).id, changes, snapshot)

    return NextResponse.json({ version }, { status: 201 })
  } catch (error) {
    console.error("Error creating website version:", error)
    return NextResponse.json({ error: "Failed to create website version" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const websiteId = Number.parseInt(params.id)
    const { versionId, userId } = await request.json()

    if (!versionId) {
      return NextResponse.json({ error: "Version ID is required" }, { status: 400 })
    }

    const result = await activateVersion(versionId, userId || (session.user as any).id)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error activating website version:", error)
    return NextResponse.json({ error: "Failed to activate website version" }, { status: 500 })
  }
}
