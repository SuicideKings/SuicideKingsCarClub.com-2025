// Environment variable validation utility
export function validateRequiredEnvVars() {
  const required = ["DATABASE_URL", "NEXTAUTH_SECRET"]

  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing environment variables: ${missing.join(", ")}`)
    }
    return false
  }

  return true
}

export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key]
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is required`)
  }
  return value || fallback || ""
}
