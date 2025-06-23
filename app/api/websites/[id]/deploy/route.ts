import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { deployWebsite, getDeploymentStatus, getDeploymentHistory } from "@/lib/deployment"

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
      const status = await getDeploymentStatus(jobId)
      return NextResponse.json({ status })
    } else {
      const history = await getDeploymentHistory(websiteId)
      return NextResponse.json({ history })
    }
  } catch (error) {
    console.error("Error fetching deployment information:", error)
    return NextResponse.json({ error: "Failed to fetch deployment information" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const websiteId = Number.parseInt(params.id)
    const { userId } = await request.json()

    const result = await deployWebsite(websiteId, userId || (session.user as any).id)

    return NextResponse.json({ success: true, jobId: result.jobId })
  } catch (error) {
    console.error("Error deploying website:", error)
    return NextResponse.json({ error: "Failed to deploy website" }, { status: 500 })
  }
}
