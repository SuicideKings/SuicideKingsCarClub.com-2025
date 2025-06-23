import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"
import { BLOB_TOKEN } from "./env-direct"

// Check if we have a blob token
if (!BLOB_TOKEN) {
  if (process.env.NODE_ENV === 'development') {
      console.error("Missing blob storage token environment variable")
    }
}

/**
 * Upload an image to Vercel Blob storage
 * @param file File to upload
 * @param folder Optional folder path
 * @returns URL and pathname of the uploaded image
 */
export async function uploadImage(file: File, folder = "images"): Promise<{ url: string; pathname: string }> {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("Missing blob storage token")
    }

    // Generate a unique filename with original extension
    const extension = file.name.split(".").pop()
    const filename = `${nanoid()}.${extension}`
    const pathname = `${folder}/${filename}`

    // Upload to Vercel Blob
    const { url } = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    })

    return { url, pathname }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error uploading image to blob storage:", error)
    }
    throw new Error(`Blob storage upload failed: ${error}`)
  }
}

/**
 * List all images in a folder
 * @param folder Folder path
 * @param limit Maximum number of items to return
 * @returns Array of blob objects
 */
export async function listImages(folder = "images", limit = 100) {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("Missing blob storage token")
    }

    const { blobs } = await list({
      prefix: folder,
      limit,
    })

    return blobs
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error listing images from blob storage:", error)
    }
    throw new Error(`Failed to list images: ${error}`)
  }
}

/**
 * Delete an image from Vercel Blob storage
 * @param url URL of the image to delete
 * @returns Success status
 */
export async function deleteImage(url: string): Promise<boolean> {
  try {
    if (!BLOB_TOKEN) {
      throw new Error("Missing blob storage token")
    }

    await del(url)
    return true
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error deleting image from blob storage:", error)
    }
    throw new Error(`Failed to delete image: ${error}`)
  }
}
