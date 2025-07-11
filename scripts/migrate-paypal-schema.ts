import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

// Database connection
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!connectionString) {
  throw new Error('DATABASE_URL or POSTGRES_URL environment variable is required')
}

const client = postgres(connectionString)
const db = drizzle(client)

async function migratePayPalSchema() {
  console.log('Starting PayPal schema migration...')
  
  try {
    // Add PayPal settings column to clubs table
    await db.execute(sql`
      ALTER TABLE clubs 
      ADD COLUMN IF NOT EXISTS paypal_settings JSONB DEFAULT NULL
    `)
    console.log('✓ Added paypal_settings column to clubs table')

    // Add PayPal product and plan ID columns
    await db.execute(sql`
      ALTER TABLE clubs 
      ADD COLUMN IF NOT EXISTS paypal_product_id VARCHAR(255) DEFAULT NULL
    `)
    console.log('✓ Added paypal_product_id column to clubs table')

    await db.execute(sql`
      ALTER TABLE clubs 
      ADD COLUMN IF NOT EXISTS paypal_monthly_plan_id VARCHAR(255) DEFAULT NULL
    `)
    console.log('✓ Added paypal_monthly_plan_id column to clubs table')

    await db.execute(sql`
      ALTER TABLE clubs 
      ADD COLUMN IF NOT EXISTS paypal_yearly_plan_id VARCHAR(255) DEFAULT NULL
    `)
    console.log('✓ Added paypal_yearly_plan_id column to clubs table')

    // Create index on paypal_settings for faster lookups
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_clubs_paypal_settings 
      ON clubs USING GIN (paypal_settings)
    `)
    console.log('✓ Created index on paypal_settings column')

    // Create PayPal webhook logs table for tracking webhook events
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS paypal_webhook_logs (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        webhook_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB NOT NULL,
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        processed_at TIMESTAMP DEFAULT NULL,
        error_message TEXT DEFAULT NULL
      )
    `)
    console.log('✓ Created paypal_webhook_logs table')

    // Create index on webhook logs for better performance
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_webhook_logs_club_id 
      ON paypal_webhook_logs(club_id)
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_webhook_logs_event_type 
      ON paypal_webhook_logs(event_type)
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_webhook_logs_processed 
      ON paypal_webhook_logs(processed)
    `)
    console.log('✓ Created indexes on paypal_webhook_logs table')

    // Create PayPal transactions table for detailed tracking
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS paypal_transactions (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        member_id INTEGER REFERENCES members(id),
        paypal_order_id VARCHAR(255) DEFAULT NULL,
        paypal_subscription_id VARCHAR(255) DEFAULT NULL,
        paypal_payment_id VARCHAR(255) DEFAULT NULL,
        transaction_type VARCHAR(50) NOT NULL, -- 'payment', 'subscription', 'refund'
        amount DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) NOT NULL, -- 'pending', 'completed', 'failed', 'refunded'
        description TEXT,
        metadata JSONB DEFAULT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✓ Created paypal_transactions table')

    // Create indexes on transactions table
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_transactions_club_id 
      ON paypal_transactions(club_id)
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_transactions_member_id 
      ON paypal_transactions(member_id)
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_transactions_status 
      ON paypal_transactions(status)
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_paypal_transactions_type 
      ON paypal_transactions(transaction_type)
    `)
    console.log('✓ Created indexes on paypal_transactions table')

    // Add PayPal subscription fields to members table
    await db.execute(sql`
      ALTER TABLE members 
      ADD COLUMN IF NOT EXISTS paypal_subscription_id VARCHAR(255) DEFAULT NULL
    `)
    console.log('✓ Added paypal_subscription_id column to members table')

    await db.execute(sql`
      ALTER TABLE members 
      ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT NULL
    `)
    console.log('✓ Added subscription_status column to members table')

    await db.execute(sql`
      ALTER TABLE members 
      ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP DEFAULT NULL
    `)
    console.log('✓ Added subscription_start_date column to members table')

    await db.execute(sql`
      ALTER TABLE members 
      ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP DEFAULT NULL
    `)
    console.log('✓ Added subscription_end_date column to members table')

    await db.execute(sql`
      ALTER TABLE members 
      ADD COLUMN IF NOT EXISTS membership_tier VARCHAR(50) DEFAULT NULL
    `)
    console.log('✓ Added membership_tier column to members table')

    // Create indexes on member subscription fields
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_members_paypal_subscription_id 
      ON members(paypal_subscription_id)
    `)
    
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_members_subscription_status 
      ON members(subscription_status)
    `)
    console.log('✓ Created indexes on member subscription fields')

    console.log('✅ PayPal schema migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Error during PayPal schema migration:', error)
    throw error
  } finally {
    await client.end()
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migratePayPalSchema()
    .then(() => {
      console.log('Migration completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('Migration failed:', error)
      process.exit(1)
    })
}

export default migratePayPalSchema