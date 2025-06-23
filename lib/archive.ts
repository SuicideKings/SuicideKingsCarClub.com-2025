import { createWriteStream } from "fs"
import { mkdir } from "fs/promises"
import path from "path"
import archiver from "archiver"
import { uploadToS3 } from "./storage"

// Archive website files
export async function archiveWebsite(websiteId: number, websiteSlug: string) {
  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), "temp")
    await mkdir(tempDir, { recursive: true })

    const timestamp = Date.now()
    const archivePath = path.join(tempDir, `${websiteSlug}-${timestamp}.zip`)
    const output = createWriteStream(archivePath)
    const archive = archiver("zip", {
      zlib: { level: 9 }, // Maximum compression
    })

    // Pipe archive data to the file
    archive.pipe(output)

    // Get website files from database or filesystem
    // This is a placeholder - you would need to implement the actual file retrieval
    const websiteFiles = await getWebsiteFiles(websiteId)

    // Add files to the archive
    for (const file of websiteFiles) {
      archive.append(file.content, { name: file.path })
    }

    // Finalize the archive
    await archive.finalize()

    // Wait for the output stream to finish
    await new Promise<void>((resolve, reject) => {
      output.on("close", () => resolve())
      output.on("error", reject)
    })

    // Upload to S3
    const fileBuffer = await import("fs").then((fs) => fs.promises.readFile(archivePath))

    const uploadResult = await uploadToS3(fileBuffer, `${websiteSlug}-${timestamp}.zip`, "application/zip")

    // Clean up temp file
    await import("fs").then((fs) => fs.promises.unlink(archivePath))

    if (uploadResult.success) {
      // Record backup in database
      await recordBackup(websiteId, uploadResult.url, archive.pointer())

      return {
        success: true,
        url: uploadResult.url,
        size: archive.pointer(),
      }
    } else {
      throw new Error(uploadResult.error || "Failed to upload archive")
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error archiving website:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Helper function to get website files
async function getWebsiteFiles(websiteId: number) {
  // This is a placeholder - implement actual file retrieval logic
  return [
    { path: "index.html", content: "<html><body>Hello World</body></html>" },
    { path: "styles.css", content: "body { font-family: sans-serif; }" },
  ]
}

// Record backup in database
async function recordBackup(websiteId: number, url: string, size: number) {
  // This is a placeholder - implement actual database recording
  if (process.env.NODE_ENV === 'development') {
    console.log(`Recording backup for website ${websiteId}: ${url} (${size} bytes)`)
  }
}
