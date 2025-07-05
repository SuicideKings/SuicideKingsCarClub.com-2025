import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { deleteImage } from "@/lib/blob-storage"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const chapter = searchParams.get("chapter")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "20", 10)
    const offset = (page - 1) * limit

    // Note: This needs to be updated to use Drizzle ORM with proper schema
    // const images = await db.select().from(galleryImages)
    // For now, returning empty array until schema is properly defined
    const images: any[] = []

    // TODO: Implement filtering, sorting, and pagination with Drizzle ORM
    // This is a placeholder implementation
    
    return NextResponse.json({
      images,
      total: 0,
      page,
      limit,
      totalPages: 0,
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

    // TODO: Implement image insertion with Drizzle ORM
    // const newImage = await db.insert(galleryImages).values({
    //   title,
    //   description,
    //   blob_url: blobUrl,
    //   pathname,
    //   chapter,
    //   category,
    //   content_type: contentType,
    // })
    
    return NextResponse.json({ 
      success: true, 
      message: "Gallery image creation not yet implemented with Drizzle ORM" 
    }, { status: 501 })
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

    // TODO: Implement image deletion with Drizzle ORM
    // const image = await db.select().from(galleryImages).where(eq(galleryImages.id, id))
    // if (!image.length) {
    //   return NextResponse.json({ error: "Image not found" }, { status: 404 })
    // }
    // await db.delete(galleryImages).where(eq(galleryImages.id, id))
    
    return NextResponse.json({ 
      success: true, 
      message: "Image deletion not yet implemented with Drizzle ORM" 
    }, { status: 501 })
  } catch (error) {
    console.error("Error deleting image:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
