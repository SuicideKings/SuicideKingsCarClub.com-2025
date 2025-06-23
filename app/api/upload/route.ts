import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { supabaseAdmin } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const chapter = formData.get("chapter") as string
    const category = formData.get("category") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const filename = `${folder}/${timestamp}-${file.name.replace(/\s+/g, "-").toLowerCase()}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Store metadata in database if this is a gallery image
    if (folder === "gallery") {
      const { error } = await supabaseAdmin.from("gallery_images").insert({
        title: title || file.name,
        description: description || null,
        blob_url: blob.url,
        pathname: filename,
        chapter: chapter || null,
        category: category || null,
        content_type: file.type,
      })

      if (error) {
        console.error("Error storing image metadata:", error)
        return NextResponse.json({ error: "Failed to store image metadata" }, { status: 500 })
      }
    }

    return NextResponse.json({
      url: blob.url,
      pathname: filename,
      success: true,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
