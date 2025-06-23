import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { jobs } from "@/lib/db/schema"
import { desc } from "drizzle-orm"

// Get jobs
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clubId = searchParams.get("clubId")
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    const query = db.query.jobs.findMany({
      orderBy: [desc(jobs.createdAt)],
      limit: 100,
    })

    // Apply filters if provided
    // Note: This is a simplified version - in production you'd want more sophisticated filtering

    const allJobs = await query

    return NextResponse.json(allJobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

// Create new job
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, data, websiteId, clubId } = await request.json()

    if (!type) {
      return NextResponse.json({ error: "Job type required" }, { status: 400 })
    }

    const [newJob] = await db
      .insert(jobs)
      .values({
        type,
        data,
        websiteId: websiteId ? Number.parseInt(websiteId) : null,
        clubId: clubId ? Number.parseInt(clubId) : null,
      })
      .returning()

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
