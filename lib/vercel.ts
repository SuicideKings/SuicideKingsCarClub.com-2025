import axios from "axios"

// Upload to Vercel
export async function uploadToVercel(
  websiteId: number,
  files: { path: string; content: string | Buffer }[],
  projectName: string,
  teamId?: string,
) {
  try {
    // Vercel API token
    const token = process.env.VERCEL_API_TOKEN

    if (!token) {
      throw new Error("VERCEL_API_TOKEN is not defined")
    }

    // Create a new deployment
    const deploymentResponse = await axios.post(
      "https://api.vercel.com/v13/deployments",
      {
        name: projectName,
        files: files.map((file) => ({
          file: file.path,
          data: typeof file.content === "string" ? file.content : file.content.toString("base64"),
          encoding: typeof file.content === "string" ? "utf8" : "base64",
        })),
        projectSettings: {
          framework: "nextjs",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: teamId ? { teamId } : undefined,
      },
    )

    const { id, url } = deploymentResponse.data

    // Record deployment in database
    await recordDeployment(websiteId, id, url)

    return {
      success: true,
      deploymentId: id,
      url,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error uploading to Vercel:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Record deployment in database
async function recordDeployment(websiteId: number, deploymentId: string, url: string) {
  // This is a placeholder - implement actual database recording
  if (process.env.NODE_ENV === 'development') {
    console.log(`Recording deployment for website ${websiteId}: ${deploymentId} (${url})`)
  }
}
