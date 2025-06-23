import { db } from "./db"
import { websites, websiteVersions } from "./db/schema"
import { eq, and, desc } from "drizzle-orm"
import { createNotification } from "./notifications"

export interface WebsiteSnapshot {
  pages: Record<string, any>
  components: Record<string, any>
  assets: Record<string, any>
  settings: Record<string, any>
  metadata: Record<string, any>
}

export async function createVersion(websiteId: number, userId: number, changes: string, snapshot: WebsiteSnapshot) {
  try {
    // Get the latest version number
    const latestVersion = await db.query.websiteVersions.findFirst({
      where: eq(websiteVersions.websiteId, websiteId),
      orderBy: [desc(websiteVersions.versionNumber)],
    })

    const newVersionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1

    // Create the new version
    const [newVersion] = await db
      .insert(websiteVersions)
      .values({
        websiteId,
        versionNumber: newVersionNumber,
        createdBy: userId,
        changes,
        snapshot,
        isActive: false,
      })
      .returning()

    // Get the website and club info for notification
    const website = await db.query.websites.findFirst({
      where: eq(websites.id, websiteId),
    })

    if (website) {
      // Create a notification for the new version
      await createNotification({
        userId,
        clubId: website.clubId,
        type: "version",
        title: `New version created: v${newVersionNumber}`,
        message: `A new version (v${newVersionNumber}) has been created for website "${website.name}". ${changes}`,
      })
    }

    return newVersion
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to create version:", error)
    }
    throw new Error(`Failed to create version: ${error}`)
  }
}

export async function activateVersion(versionId: number, userId: number) {
  try {
    // Get the version to activate
    const version = await db.query.websiteVersions.findFirst({
      where: eq(websiteVersions.id, versionId),
      with: {
        website: true,
      },
    })

    if (!version) {
      throw new Error("Version not found")
    }

    // Deactivate all other versions for this website
    await db
      .update(websiteVersions)
      .set({ isActive: false })
      .where(and(eq(websiteVersions.websiteId, version.websiteId), eq(websiteVersions.isActive, true)))

    // Activate the requested version
    await db.update(websiteVersions).set({ isActive: true }).where(eq(websiteVersions.id, versionId))

    // Create a notification for the version activation
    await createNotification({
      userId,
      clubId: version.website.clubId,
      type: "version",
      title: `Version v${version.versionNumber} activated`,
      message: `Version v${version.versionNumber} has been activated for website "${version.website.name}".`,
    })

    return { success: true, version }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to activate version:", error)
    }
    throw new Error(`Failed to activate version: ${error}`)
  }
}

export async function getVersionHistory(websiteId: number) {
  try {
    const versions = await db.query.websiteVersions.findMany({
      where: eq(websiteVersions.websiteId, websiteId),
      orderBy: [desc(websiteVersions.versionNumber)],
      with: {
        creator: {
          columns: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return versions
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to get version history:", error)
    }
    throw new Error(`Failed to get version history: ${error}`)
  }
}

export async function compareVersions(versionId1: number, versionId2: number) {
  try {
    const version1 = await db.query.websiteVersions.findFirst({
      where: eq(websiteVersions.id, versionId1),
    })

    const version2 = await db.query.websiteVersions.findFirst({
      where: eq(websiteVersions.id, versionId2),
    })

    if (!version1 || !version2) {
      throw new Error("One or both versions not found")
    }

    // Implement your comparison logic here
    // This is a simplified example
    const snapshot1 = version1.snapshot as WebsiteSnapshot
    const snapshot2 = version2.snapshot as WebsiteSnapshot

    const differences = {
      pages: compareObjects(snapshot1.pages, snapshot2.pages),
      components: compareObjects(snapshot1.components, snapshot2.components),
      assets: compareObjects(snapshot1.assets, snapshot2.assets),
      settings: compareObjects(snapshot1.settings, snapshot2.settings),
      metadata: compareObjects(snapshot1.metadata, snapshot2.metadata),
    }

    return {
      version1: {
        id: version1.id,
        versionNumber: version1.versionNumber,
        createdAt: version1.createdAt,
      },
      version2: {
        id: version2.id,
        versionNumber: version2.versionNumber,
        createdAt: version2.createdAt,
      },
      differences,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to compare versions:", error)
    }
    throw new Error(`Failed to compare versions: ${error}`)
  }
}

// Helper function to compare objects
function compareObjects(obj1: Record<string, any>, obj2: Record<string, any>) {
  const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])
  const differences: Record<string, { added?: boolean; removed?: boolean; modified?: boolean }> = {}

  for (const key of allKeys) {
    if (!(key in obj1)) {
      differences[key] = { added: true }
    } else if (!(key in obj2)) {
      differences[key] = { removed: true }
    } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
      differences[key] = { modified: true }
    }
  }

  return differences
}
