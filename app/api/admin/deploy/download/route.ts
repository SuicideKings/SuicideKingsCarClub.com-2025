import { NextResponse } from "next/server"
import { generateAllDeploymentFiles } from "@/lib/deployment-generator"
import JSZip from "jszip"

export async function POST(request: Request) {
  try {
    const config = await request.json()

    // Generate ALL deployment files
    const files = await generateAllDeploymentFiles(config)

    // Create a ZIP file with all the files
    const zip = new JSZip()

    // Add all files to the ZIP
    files.forEach((file) => {
      zip.file(file.path, file.content)
    })

    // Generate the ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" })

    // Return the ZIP file
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="suicide-kings-${config.hosting}-${config.database}.zip"`,
      },
    })
  } catch (error) {
    console.error("File generation error:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "File generation failed" },
      { status: 500 },
    )
  }
}
