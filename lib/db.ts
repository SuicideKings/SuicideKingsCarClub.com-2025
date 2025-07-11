// Re-export the database connection from the main db module
export { db } from './db/index'

// Test database connection function
export async function testConnection() {
  try {
    const { db } = await import('./db/index')
    if (!db) {
      return { success: false, error: "Database not configured" }
    }
    
    // Try a simple query to test the connection
    await db.execute('SELECT 1 as test')
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Placeholder for Supabase admin - implement if using Supabase
export const supabaseAdmin = null