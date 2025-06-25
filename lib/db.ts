import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./db/schema"

// Neon Database Connection
const neonUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || ""
const sql = neon(neonUrl)
export const db = drizzle(sql, { schema })

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`
    return {
      success: true,
      timestamp: result[0].now,
      message: "Database connection successful",
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Database connection error:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}



export default db
