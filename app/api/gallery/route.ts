import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/db"
import { deleteImage } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const chapter = searchParams.get("chapter")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    // Build query
    let query = supabaseAdmin.from("gallery_images").select("*", { count: "exact" })

    // Add filters if provided
    if (chapter && chapter !== "all") {
      query = query.eq("chapter", chapter)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    // Add pagination
    query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    // Execute query
    const { data: images, count, error } = await query

    if (error) {
      console.error("Error fetching gallery images:", error)
      return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
    }

    return NextResponse.json({
      images: images || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("Error in gallery route:", error)
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const blobUrl = formData.get("blob_url") as string
    const pathname = formData.get("pathname") as string
    const chapter = formData.get("chapter") as string
    const category = formData.get("category") as string
    const contentType = formData.get("content_type") as string

    const { data, error } = await supabaseAdmin.from("gallery_images").insert({
      title,
      description,
      blob_url: blobUrl,
      pathname,
      chapter,
      category,
      content_type: contentType,
    })

    if (error) {
      console.error("Supabase error inserting gallery image:", error)
      return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 })
    }

    return NextResponse.json({ message: "Gallery image created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error in POST handler:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Get the image URL first
    const { data: image, error: fetchError } = await supabaseAdmin
      .from("gallery_images")
      .select("blob_url")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching image:", fetchError)
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
    }

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const blobUrl = image.blob_url

    // Delete from database
    const { error: deleteError } = await supabaseAdmin.from("gallery_images").delete().eq("id", id)

    if (deleteError) {
      console.error("Error deleting image from database:", deleteError)
      return NextResponse.json({ error: "Failed to delete image from database" }, { status: 500 })
    }

    // Delete from Vercel Blob
    try {
      await deleteImage(blobUrl)
    } catch (error) {
      console.error("Error deleting blob:", error)
      // Continue even if blob deletion fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
