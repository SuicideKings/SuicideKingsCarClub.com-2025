import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 })
    }

    const { data: image, error } = await supabaseAdmin.from("gallery_images").select("*").eq("id", id).single()

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error fetching image:", error)
      }
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
    }

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json({ image })
  } catch (error) {
    console.error("Error fetching image:", error)
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 })
    }

    const { title, description, chapter, category } = await request.json()

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const { data: image, error } = await supabaseAdmin
      .from("gallery_images")
      .update({
        title,
        description: description || null,
        chapter: chapter || null,
        category: category || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Error updating image:", error)
      }
      return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
    }

    return NextResponse.json({ image })
  } catch (error) {
    console.error("Error updating image:", error)
    return NextResponse.json({ error: "Failed to update image" }, { status: 500 })
  }
}
