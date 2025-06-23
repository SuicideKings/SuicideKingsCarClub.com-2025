import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

// Upload file to S3
export async function uploadToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  bucketName: string = process.env.AWS_S3_BUCKET || "",
) {
  try {
    const key = `${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    })

    await s3Client.send(command)

    return {
      success: true,
      key,
      url: `https://${bucketName}.s3.amazonaws.com/${key}`,
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error uploading to S3:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Generate presigned URL for direct uploads
export async function getPresignedUploadUrl(
  fileName: string,
  contentType: string,
  bucketName: string = process.env.AWS_S3_BUCKET || "",
  expiresIn = 3600,
) {
  try {
    const key = `${Date.now()}-${fileName}`

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })

    return {
      success: true,
      key,
      url,
      fields: {
        key,
      },
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error generating presigned URL:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
