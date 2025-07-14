import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import bcrypt from 'bcryptjs'
import { adminUsers } from '../lib/db/schema'

async function addAdminUsers() {
  // Get database connection from environment
  const connectionString = process.env.NEON_DATABASE_URL
  
  if (!connectionString) {
    console.error('NEON_DATABASE_URL environment variable is not set')
    process.exit(1)
  }

  // Create database connection
  const queryClient = postgres(connectionString, {
    connect_timeout: 10,
    idle_timeout: 30,
    max_lifetime: 300,
    max: 5,
  })
  
  const db = drizzle(queryClient)

  try {
    console.log('Adding admin users...')

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin12345', 12)

    // Admin user 1: alex@suicidekingscarclub.com
    const admin1 = await db.insert(adminUsers).values({
      email: 'alex@suicidekingscarclub.com',
      password: hashedPassword,
      name: 'Alex',
      role: 'admin',
    }).onConflictDoNothing().returning()

    // Admin user 2: fediddy@gmail.com
    const admin2 = await db.insert(adminUsers).values({
      email: 'fediddy@gmail.com',
      password: hashedPassword,
      name: 'Fediddy',
      role: 'admin',
    }).onConflictDoNothing().returning()

    if (admin1.length > 0) {
      console.log('✓ Added admin user: alex@suicidekingscarclub.com')
    } else {
      console.log('- Admin user alex@suicidekingscarclub.com already exists')
    }

    if (admin2.length > 0) {
      console.log('✓ Added admin user: fediddy@gmail.com')
    } else {
      console.log('- Admin user fediddy@gmail.com already exists')
    }

    console.log('✓ Admin users setup complete!')

  } catch (error) {
    console.error('Error adding admin users:', error)
    process.exit(1)
  } finally {
    await queryClient.end()
  }
}

// Run the script
addAdminUsers()