// Database URL with fallbacks
export const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

export const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.STACK_SECRET_SERVER_KEY

export const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export const ALL_ENV = {
  DATABASE_URL,
  AUTH_SECRET: NEXTAUTH_SECRET,
  BLOB_TOKEN
}
