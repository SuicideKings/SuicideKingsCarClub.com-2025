import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { createClient } from "@supabase/supabase-js"
import * as schema from "./db/schema"

// Neon Database Connection
const sql = neon(process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || "")
export const db = drizzle(sql, { schema })

// Supabase Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

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

// Test Supabase connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("clubs").select("count").limit(1)
    if (error) throw error
    return {
      success: true,
      message: "Supabase connection successful",
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Supabase connection error:", error)
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export default db
