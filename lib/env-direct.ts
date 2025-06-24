// Remove POSTGRES_URL and other Neon-specific variables
export const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

// Remove AUTH_SECRET mapping that references Neon
export const AUTH_SECRET =
  process.env.SKINGS_STACK_SECRET_SERVER_KEY || process.env.NEXTAUTH_SECRET

export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

// Update the export
export const ALL_ENV = {
  DATABASE_URL,

  AUTH_SECRET,
  BLOB_TOKEN,
}
