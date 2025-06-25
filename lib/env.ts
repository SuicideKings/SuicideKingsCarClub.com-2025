function getEnv(key: string, fallbacks: string[] = []): string | undefined {
  if (process.env[key]) {
    return process.env[key]
  }

  for (const fallback of fallbacks) {
    if (process.env[fallback]) {
      return process.env[fallback]
    }
  }

  return undefined
}

export function getDatabaseUrl(): string {
  const dbUrl = getEnv("NEON_DATABASE_URL", ["DATABASE_URL"])

  if (!dbUrl) {
    throw new Error("Missing database URL environment variable")
  }

  return dbUrl
}
