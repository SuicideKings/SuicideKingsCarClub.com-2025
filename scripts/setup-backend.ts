#!/usr/bin/env ts-node

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'
import { validateEnvironment, getEnvironmentStatus } from '../lib/env-validation'
import migratePayPalSchema from './migrate-paypal-schema'

async function setupBackend() {
  console.log('🚀 Starting Suicide Kings Car Club Backend Setup...\n')

  try {
    // Step 1: Validate Environment
    console.log('📋 Step 1: Validating Environment Variables...')
    const envValidation = validateEnvironment()
    
    if (!envValidation.success) {
      console.error('❌ Environment validation failed:')
      envValidation.errors?.forEach(error => console.error(`  - ${error}`))
      process.exit(1)
    }

    if (envValidation.warnings && envValidation.warnings.length > 0) {
      console.warn('⚠️  Environment warnings:')
      envValidation.warnings.forEach(warning => console.warn(`  - ${warning}`))
    }

    console.log('✅ Environment validation passed\n')

    // Step 2: Test Database Connection
    console.log('🗄️  Step 2: Testing Database Connection...')
    const connectionString = process.env.DATABASE_URL || 
                           process.env.POSTGRES_URL || 
                           process.env.SUPABASE_URL ||
                           process.env.NEON_DATABASE_URL ||
                           process.env.PLANETSCALE_DATABASE_URL ||
                           process.env.VERCEL_POSTGRES_URL

    if (!connectionString) {
      console.error('❌ No database connection string found')
      process.exit(1)
    }

    const client = postgres(connectionString)
    const db = drizzle(client)

    try {
      await db.execute(sql`SELECT 1`)
      console.log('✅ Database connection successful\n')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      process.exit(1)
    }

    // Step 3: Run Database Migrations
    console.log('📦 Step 3: Running Database Migrations...')
    try {
      await migratePayPalSchema()
      console.log('✅ Database migrations completed\n')
    } catch (error) {
      console.error('❌ Database migration failed:', error)
      process.exit(1)
    }

    // Step 4: Verify Schema
    console.log('🔍 Step 4: Verifying Database Schema...')
    try {
      // Check if required tables exist
      const tables = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('clubs', 'paypal_webhook_logs', 'paypal_transactions')
      `)

      const tableNames = tables.map((row: any) => row.table_name)
      const requiredTables = ['clubs', 'paypal_webhook_logs', 'paypal_transactions']
      const missingTables = requiredTables.filter(table => !tableNames.includes(table))

      if (missingTables.length > 0) {
        console.error('❌ Missing required tables:', missingTables)
        process.exit(1)
      }

      console.log('✅ Database schema verification passed\n')
    } catch (error) {
      console.error('❌ Schema verification failed:', error)
      process.exit(1)
    }

    // Step 5: Setup System Configuration
    console.log('⚙️  Step 5: Setting up System Configuration...')
    
    // Create default club if none exist
    try {
      const existingClubs = await db.execute(sql`SELECT COUNT(*) as count FROM clubs`)
      const clubCount = (existingClubs[0] as any).count

      if (clubCount === 0) {
        console.log('📝 Creating default clubs...')
        
        const defaultClubs = [
          {
            name: 'Suicide Kings Coachella Valley',
            slug: 'skcv',
            description: 'Coachella Valley chapter of Suicide Kings Car Club',
            location: 'Coachella Valley, CA'
          },
          {
            name: 'Suicide Kings Inland Empire',
            slug: 'skie',
            description: 'Inland Empire chapter of Suicide Kings Car Club',
            location: 'Inland Empire, CA'
          },
          {
            name: 'Suicide Kings Los Angeles',
            slug: 'skla',
            description: 'Los Angeles chapter of Suicide Kings Car Club',
            location: 'Los Angeles, CA'
          },
          {
            name: 'Suicide Kings Northern California',
            slug: 'sknc',
            description: 'Northern California chapter of Suicide Kings Car Club',
            location: 'Northern California'
          },
          {
            name: 'Suicide Kings Washington',
            slug: 'skwa',
            description: 'Washington chapter of Suicide Kings Car Club',
            location: 'Washington State'
          }
        ]

        for (const club of defaultClubs) {
          await db.execute(sql`
            INSERT INTO clubs (name, slug, description, location, is_active, created_at, updated_at)
            VALUES (${club.name}, ${club.slug}, ${club.description}, ${club.location}, true, NOW(), NOW())
          `)
        }

        console.log(`✅ Created ${defaultClubs.length} default clubs`)
      } else {
        console.log(`✅ Found ${clubCount} existing clubs`)
      }
    } catch (error) {
      console.error('❌ Failed to setup clubs:', error)
    }

    // Step 6: Cleanup and Final Checks
    console.log('🧹 Step 6: Final Cleanup and Checks...')
    
    // Close database connection
    await client.end()
    
    console.log('✅ Backend setup completed successfully!\n')

    // Print setup summary
    console.log('📊 Setup Summary:')
    console.log('================')
    
    const envStatus = getEnvironmentStatus()
    console.log(`Environment Status: ${envStatus.status === 'success' ? '✅' : '⚠️'} ${envStatus.message}`)
    
    console.log('\n🔗 Important URLs:')
    console.log(`- Admin Dashboard: ${process.env.NEXTAUTH_URL}/admin`)
    console.log(`- Environment Status: ${process.env.NEXTAUTH_URL}/api/system/env-status`)
    console.log(`- PayPal Monitoring: ${process.env.NEXTAUTH_URL}/api/admin/paypal-monitoring`)
    
    console.log('\n📚 Next Steps:')
    console.log('1. Configure PayPal credentials for each chapter')
    console.log('2. Set up webhook endpoints in PayPal Developer Dashboard')
    console.log('3. Test payment flows for each chapter')
    console.log('4. Configure email settings for notifications')
    
    if (envValidation.warnings && envValidation.warnings.length > 0) {
      console.log('\n⚠️  Warnings to Address:')
      envValidation.warnings.forEach(warning => console.log(`- ${warning}`))
    }

  } catch (error) {
    console.error('❌ Backend setup failed:', error)
    process.exit(1)
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupBackend()
    .then(() => {
      console.log('\n🎉 Setup completed successfully!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Setup failed:', error)
      process.exit(1)
    })
}

export default setupBackend