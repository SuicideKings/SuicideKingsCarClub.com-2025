import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { createBackup, getBackupStatus, getBackupHistory, restoreFromBackup } from "@/lib/backup"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const websiteId = Number.parseInt(params.id)
    const url = new URL(request.url)
    const jobId = url.searchParams.get("jobId")

    if (jobId) {
      const status = await getBackupStatus(jobId)
      return NextResponse.json({ status })
    } else {
      const history = await getBackupHistory(websiteId)
      return NextResponse.json({ history })
    }
  } catch (error) {
    console.error("Error fetching backup information:", error)
    return NextResponse.json({ error: "Failed to fetch backup information" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const websiteId = Number.parseInt(params.id)
    const { userId, type } = await request.json()

    const result = await createBackup(websiteId, userId || (session.user as any).id, type || "manual")

    return NextResponse.json({ success: true, jobId: result.jobId })
  } catch (error) {
    console.error("Error creating backup:", error)
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { backupId, userId } = await request.json()

    if (!backupId) {
      return NextResponse.json({ error: "Backup ID is required" }, { status: 400 })
    }

    const result = await restoreFromBackup(backupId, userId || (session.user as any).id)

    return NextResponse.json({ success: true, jobId: result.jobId })
  } catch (error) {
    console.error("Error restoring from backup:", error)
    return NextResponse.json({ error: "Failed to restore from backup" }, { status: 500 })
  }
}
