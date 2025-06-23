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
  const dbUrl = getEnv("SUPABASE_URL", ["NEXT_PUBLIC_SUPABASE_URL"])

  if (!dbUrl) {
    throw new Error("Missing Supabase URL environment variable")
  }

  return dbUrl
}

export function getSupabaseServiceKey(): string {
  const key = getEnv("SUPABASE_SERVICE_ROLE_KEY", ["SUPABASE_ANON_KEY"])

  if (!key) {
    throw new Error("Missing Supabase service key environment variable")
  }

  return key
}
