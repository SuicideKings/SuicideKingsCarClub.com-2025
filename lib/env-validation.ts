import { z } from "zod"

// Environment variable schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().optional(),
  POSTGRES_URL: z.string().url().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  NEON_DATABASE_URL: z.string().url().optional(),
  PLANETSCALE_DATABASE_URL: z.string().url().optional(),
  VERCEL_POSTGRES_URL: z.string().url().optional(),

  // Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // PayPal (Global - Optional)
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),

  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // Storage
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // AI Services
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),

  // Environment
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnvironment(): {
  success: boolean
  data?: EnvConfig
  errors?: string[]
  warnings?: string[]
} {
  try {
    const env = envSchema.parse(process.env)
    const warnings: string[] = []

    // Check for database configuration
    const hasDatabase = !!(
      env.DATABASE_URL || 
      env.POSTGRES_URL || 
      env.SUPABASE_URL || 
      env.NEON_DATABASE_URL || 
      env.PLANETSCALE_DATABASE_URL || 
      env.VERCEL_POSTGRES_URL
    )

    if (!hasDatabase) {
      warnings.push("No database URL configured. Application may not function properly.")
    }

    // Check for global PayPal configuration
    if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) {
      warnings.push("Global PayPal credentials not configured. Chapters must configure their own PayPal settings.")
    }

    // Check for email configuration
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASSWORD) {
      warnings.push("Email SMTP settings not configured. Email notifications will not work.")
    }

    // Check for storage configuration
    const hasStorage = !!(
      (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET) ||
      env.BLOB_READ_WRITE_TOKEN
    )

    if (!hasStorage) {
      warnings.push("No file storage configured. File uploads may not work.")
    }

    return {
      success: true,
      data: env,
      warnings: warnings.length > 0 ? warnings : undefined
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return {
        success: false,
        errors
      }
    }

    return {
      success: false,
      errors: ["Unknown validation error"]
    }
  }
}

export function getEnvironmentStatus() {
  const validation = validateEnvironment()
  
  if (!validation.success) {
    return {
      status: "error" as const,
      message: "Environment validation failed",
      errors: validation.errors
    }
  }

  if (validation.warnings && validation.warnings.length > 0) {
    return {
      status: "warning" as const,
      message: "Environment has warnings",
      warnings: validation.warnings
    }
  }

  return {
    status: "success" as const,
    message: "Environment is properly configured"
  }
}

export function validatePayPalCredentials(clientId: string, clientSecret: string) {
  const errors: string[] = []

  if (!clientId || clientId.length < 10) {
    errors.push("PayPal Client ID is required and must be at least 10 characters")
  }

  if (!clientSecret || clientSecret.length < 10) {
    errors.push("PayPal Client Secret is required and must be at least 10 characters")
  }

  // Basic format validation for PayPal credentials
  if (clientId && !/^[A-Za-z0-9_-]+$/.test(clientId)) {
    errors.push("PayPal Client ID contains invalid characters")
  }

  if (clientSecret && !/^[A-Za-z0-9_-]+$/.test(clientSecret)) {
    errors.push("PayPal Client Secret contains invalid characters")
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

export function getRequiredEnvironmentVariables() {
  return {
    required: [
      "NEXTAUTH_URL",
      "NEXTAUTH_SECRET"
    ],
    recommended: [
      "DATABASE_URL",
      "PAYPAL_CLIENT_ID", 
      "PAYPAL_CLIENT_SECRET",
      "SMTP_HOST",
      "SMTP_USER", 
      "SMTP_PASSWORD",
      "EMAIL_FROM"
    ],
    optional: [
      "AWS_ACCESS_KEY_ID",
      "AWS_SECRET_ACCESS_KEY", 
      "AWS_S3_BUCKET",
      "BLOB_READ_WRITE_TOKEN",
      "OPENAI_API_KEY",
      "ANTHROPIC_API_KEY",
      "DEEPSEEK_API_KEY"
    ]
  }
}