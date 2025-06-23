import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Mock data store - in production, this would use a database
let pages: any[] = [
  {
    id: "home",
    name: "Home Page",
    slug: "",
    title: "Suicide Kings Car Club",
    description: "Official website of the Suicide Kings Car Club",
    elements: [],
    styles: {
      backgroundColor: "#000000",
      color: "#ffffff",
      fontFamily: "Inter, sans-serif",
    },
    isPublished: true,
  },
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ pages })
  } catch (error) {
    console.error("Failed to fetch pages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pageData = await request.json()

    // Find existing page or create new one
    const existingIndex = pages.findIndex((p) => p.id === pageData.id)

    if (existingIndex >= 0) {
      pages[existingIndex] = pageData
    } else {
      pages.push(pageData)
    }

    return NextResponse.json({ success: true, page: pageData })
  } catch (error) {
    console.error("Failed to save page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get("id")

    if (!pageId) {
      return NextResponse.json({ error: "Page ID required" }, { status: 400 })
    }

    pages = pages.filter((p) => p.id !== pageId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete page:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
