import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Database connection string from environment variable
const connectionString = process.env.NEON_DATABASE_URL

// Check if the connection string is defined
if (!connectionString) {
  console.warn("NEON_DATABASE_URL is not defined - database features will be limited")
}

// Create a postgres client with the connection string and timeout settings
const client = connectionString ? postgres(connectionString, {
  connect_timeout: 10,
  idle_timeout: 30,
  max_lifetime: 300,
  max: 5
}) : null

// Create a drizzle client with the postgres client and schema
export const db = client ? drizzle(client, { schema }) : null as any
