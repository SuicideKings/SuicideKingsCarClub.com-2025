import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { checkForUpdates, getUpdateStatus } from "@/lib/updates"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const jobId = url.searchParams.get("jobId")

    if (jobId) {
      const status = await getUpdateStatus(jobId)
      return NextResponse.json({ status })
    } else {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching update status:", error)
    return NextResponse.json({ error: "Failed to fetch update status" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await checkForUpdates()

    return NextResponse.json({ success: true, jobId: result.jobId })
  } catch (error) {
    console.error("Error checking for updates:", error)
    return NextResponse.json({ error: "Failed to check for updates" }, { status: 500 })
  }
}
