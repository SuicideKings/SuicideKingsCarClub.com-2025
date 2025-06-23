import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

// Database connection string from environment variable
const connectionString = process.env.NEON_DATABASE_URL

// Check if the connection string is defined
if (!connectionString) {
  throw new Error("DATABASE_URL is not defined")
}

// Create a postgres client with the connection string
const client = postgres(connectionString)

// Create a drizzle client with the postgres client and schema
export const db = drizzle(client, { schema })
