import { NextResponse } from "next/server"
import { generateDeploymentFiles } from "@/lib/deployment-generator"
import { deployToProvider } from "@/lib/deployment-providers"

export async function POST(request: Request) {
  try {
    const config = await request.json()

    // Generate deployment files based on selected providers
    const deploymentFiles = await generateDeploymentFiles(config)

    // Deploy to the selected hosting provider
    const deploymentResult = await deployToProvider(config, deploymentFiles)

    if (deploymentResult.success) {
      return NextResponse.json({
        success: true,
        url: deploymentResult.url,
        deploymentId: deploymentResult.deploymentId,
      })
    } else {
      throw new Error(deploymentResult.error)
    }
  } catch (error) {
    console.error("Deployment error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Deployment failed" },
      { status: 500 },
    )
  }
}
