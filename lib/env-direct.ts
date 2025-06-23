// Remove POSTGRES_URL and other Neon-specific variables
export const DATABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL

// Add Supabase service key
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

// Remove AUTH_SECRET mapping that references Neon
export const AUTH_SECRET =
  process.env.SKINGS_STACK_SECRET_SERVER_KEY || process.env.SUPABASE_JWT_SECRET || process.env.NEXTAUTH_SECRET

export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

// Update the export
export const ALL_ENV = {
  DATABASE_URL,
  SUPABASE_SERVICE_KEY,
  AUTH_SECRET,
  BLOB_TOKEN,
}
