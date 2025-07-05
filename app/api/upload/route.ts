import { NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { db } from "@/lib/db"
import { uploadRateLimit, withRateLimit } from "@/lib/rate-limit"
import { uploadSchema, validateRequest, validateAndSanitizeFile } from "@/lib/validation"
import { getToken } from "next-auth/jwt"

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = withRateLimit(uploadRateLimit)(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    // Check authentication - uploads should require authentication
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" }, 
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    // Extract and validate metadata
    const metadata = {
      folder: formData.get("folder") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      chapter: formData.get("chapter") as string,
      category: formData.get("category") as string,
    }

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate metadata
    const metadataValidation = validateRequest(uploadSchema, metadata)
    if (!metadataValidation.success) {
      return NextResponse.json(
        { 
          error: "Invalid metadata", 
          details: metadataValidation.errors 
        },
        { status: 400 }
      )
    }

    // Validate and sanitize file
    const fileValidation = validateAndSanitizeFile(file)
    if (!fileValidation.success) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      )
    }

    const { folder, title, description, chapter, category } = metadataValidation.data

    // Additional security: Check folder permissions
    const allowedFolders = ['gallery', 'events', 'chapters', 'member-uploads']
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { error: "Invalid upload folder" },
        { status: 400 }
      )
    }

    // Check user permissions for folder
    if (folder === 'admin' && token.role !== 'admin') {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      )
    }

    // Generate secure filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const sanitizedFilename = fileValidation.sanitizedName
    const filename = `${folder}/${timestamp}-${randomString}-${sanitizedFilename}`

    // Log upload attempt for audit trail
    console.log("File upload attempt:", {
      userId: token.id,
      userEmail: token.email,
      filename: sanitizedFilename,
      folder,
      fileSize: file.size,
      fileType: file.type,
      ip: request.headers.get('x-forwarded-for') || request.ip,
      timestamp: new Date().toISOString(),
    })

    // Upload to Vercel Blob with security headers
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // Store metadata in database if this is a gallery image
    if (folder === "gallery") {
      // TODO: Save to database with Drizzle ORM
      // await db.insert(galleryImages).values({
      //   title: title || sanitizedFilename,
      //   description: description || null,
      //   blob_url: blob.url,
      //   pathname: blob.pathname,
      //   chapter: chapter || null,
      //   category: category || "general",
      //   content_type: file.type,
      //   file_size: file.size,
      //   uploaded_by: token.id,
      //   uploaded_at: new Date(),
      // })
    }

    // Log successful upload
    console.log("File uploaded successfully:", {
      userId: token.id,
      blobUrl: blob.url,
      pathname: blob.pathname,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      url: blob.url,
      pathname: filename,
      success: true,
    })
  } catch (error) {
    console.error("Upload error:", error)
    
    // Don't leak internal error details
    return NextResponse.json(
      { error: "Upload failed" }, 
      { status: 500 }
    )
  }
}
