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
  // Supabase functions removed - use Neon database instead
