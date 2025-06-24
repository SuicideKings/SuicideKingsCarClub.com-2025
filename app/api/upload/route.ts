import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

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

    // Note: Gallery metadata storage removed with Supabase
    // If you need to store metadata, implement with your preferred database

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
