import path from "path"
import { mkdir, copyFile, readdir } from "fs/promises"

// Mirror website to subfolder
export async function mirrorToSubfolder(websiteId: number, sourcePath: string, targetSubfolder: string) {
  try {
    // Create target directory if it doesn't exist
    const targetPath = path.join(process.cwd(), "public", targetSubfolder)
    await mkdir(targetPath, { recursive: true })

    // Copy files recursively
    await copyFilesRecursively(sourcePath, targetPath)

    return {
      success: true,
      targetPath,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error mirroring to subfolder:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Helper function to copy files recursively
async function copyFilesRecursively(source: string, target: string) {
  const entries = await readdir(source, { withFileTypes: true })

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)

    if (entry.isDirectory()) {
      await mkdir(targetPath, { recursive: true })
      await copyFilesRecursively(sourcePath, targetPath)
    } else {
      await copyFile(sourcePath, targetPath)
    }
  }
}
