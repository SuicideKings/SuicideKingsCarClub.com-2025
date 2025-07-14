import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'

async function createInitialSchema() {
  const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL
  
  if (!connectionString) {
    console.error('DATABASE_URL or NEON_DATABASE_URL environment variable is required')
    process.exit(1)
  }

  const queryClient = postgres(connectionString, {
    connect_timeout: 10,
    idle_timeout: 30,
    max_lifetime: 300,
    max: 5,
  })
  
  const db = drizzle(queryClient)

  try {
    console.log('🗄️ Creating initial database schema...')

    // Create all tables in the correct order (respecting foreign key dependencies)
    
    // 1. Create admin_users table first (no dependencies)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created admin_users table')

    // 2. Create clubs table (no dependencies)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS clubs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        location VARCHAR(255),
        founded VARCHAR(4),
        member_count INTEGER DEFAULT 0,
        logo_url VARCHAR(500),
        cover_image_url VARCHAR(500),
        contact_email VARCHAR(255),
        website VARCHAR(255),
        social_links JSONB,
        paypal_settings JSONB,
        paypal_product_id VARCHAR(255),
        paypal_monthly_plan_id VARCHAR(255),
        paypal_yearly_plan_id VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created clubs table')

    // 3. Create users table (no dependencies)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255),
        image VARCHAR(500),
        email_verified TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created users table')

    // 4. Create members table (depends on clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS members (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(50) DEFAULT 'member',
        join_date TIMESTAMP DEFAULT NOW(),
        membership_status VARCHAR(50) DEFAULT 'active',
        profile_image_url VARCHAR(500),
        bio TEXT,
        car_info JSONB,
        is_email_verified BOOLEAN DEFAULT FALSE,
        paypal_subscription_id VARCHAR(255),
        subscription_status VARCHAR(50),
        subscription_start_date TIMESTAMP,
        subscription_end_date TIMESTAMP,
        membership_tier VARCHAR(50),
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created members table')

    // 5. Create events table (depends on clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        location VARCHAR(255),
        address TEXT,
        ticket_price DECIMAL(10, 2),
        max_attendees INTEGER,
        current_attendees INTEGER DEFAULT 0,
        image_url VARCHAR(500),
        event_type VARCHAR(50) DEFAULT 'meetup',
        is_public BOOLEAN DEFAULT TRUE,
        registration_required BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created events table')

    // 6. Create gallery table (depends on clubs and members)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(500) NOT NULL,
        thumbnail_url VARCHAR(500),
        category VARCHAR(100),
        tags JSONB,
        uploaded_by INTEGER REFERENCES members(id),
        is_public BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created gallery table')

    // 7. Create custom_pages table (depends on clubs and admin_users)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS custom_pages (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        content JSONB NOT NULL,
        meta_title VARCHAR(255),
        meta_description TEXT,
        is_published BOOLEAN DEFAULT FALSE,
        published_at TIMESTAMP,
        created_by INTEGER REFERENCES admin_users(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created custom_pages table')

    // 8. Create payments table (depends on users and clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        club_id INTEGER REFERENCES clubs(id),
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50),
        paypal_order_id VARCHAR(255),
        paypal_subscription_id VARCHAR(255),
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created payments table')

    // 9. Create api_keys table (depends on admin_users and clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        key VARCHAR(255) NOT NULL UNIQUE,
        user_id INTEGER REFERENCES admin_users(id),
        club_id INTEGER REFERENCES clubs(id),
        permissions JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        last_used TIMESTAMP,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created api_keys table')

    // 10. Create notifications table (depends on users)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        action_url VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created notifications table')

    // 11. Create websites table (depends on clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS websites (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(255),
        subdomain VARCHAR(255),
        status VARCHAR(50) DEFAULT 'draft',
        theme VARCHAR(100) DEFAULT 'default',
        custom_css TEXT,
        settings JSONB,
        deployment_url VARCHAR(500),
        last_deployed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created websites table')

    // 12. Create website_versions table (depends on websites and admin_users)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS website_versions (
        id SERIAL PRIMARY KEY,
        website_id INTEGER REFERENCES websites(id),
        version VARCHAR(50) NOT NULL,
        content JSONB NOT NULL,
        changelog TEXT,
        is_active BOOLEAN DEFAULT FALSE,
        created_by INTEGER REFERENCES admin_users(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created website_versions table')

    // 13. Create jobs table (no dependencies)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        type VARCHAR(100) NOT NULL,
        payload JSONB,
        status VARCHAR(50) DEFAULT 'pending',
        attempts INTEGER DEFAULT 0,
        max_attempts INTEGER DEFAULT 3,
        error TEXT,
        scheduled_for TIMESTAMP,
        started_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created jobs table')

    // 14. Create backups table (depends on websites)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS backups (
        id SERIAL PRIMARY KEY,
        website_id INTEGER REFERENCES websites(id),
        filename VARCHAR(255) NOT NULL,
        size INTEGER,
        type VARCHAR(50) DEFAULT 'full',
        status VARCHAR(50) DEFAULT 'pending',
        storage_url VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP
      )
    `)
    console.log('✅ Created backups table')

    // 15. Create products table (depends on clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        short_description VARCHAR(500),
        sku VARCHAR(100) UNIQUE,
        price DECIMAL(10, 2) NOT NULL,
        member_price DECIMAL(10, 2),
        cost_price DECIMAL(10, 2),
        category VARCHAR(100),
        tags JSONB,
        images JSONB,
        variants JSONB,
        inventory INTEGER,
        low_stock_threshold INTEGER DEFAULT 5,
        weight DECIMAL(8, 2),
        dimensions JSONB,
        shipping_required BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        seo_title VARCHAR(255),
        seo_description TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created products table')

    // 16. Create orders table (depends on clubs and members)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(100) UNIQUE NOT NULL,
        club_id INTEGER REFERENCES clubs(id),
        member_id INTEGER REFERENCES members(id),
        customer_email VARCHAR(255),
        customer_name VARCHAR(255),
        customer_phone VARCHAR(20),
        shipping_address JSONB,
        billing_address JSONB,
        subtotal DECIMAL(10, 2) NOT NULL,
        tax_amount DECIMAL(10, 2) DEFAULT 0,
        shipping_amount DECIMAL(10, 2) DEFAULT 0,
        discount_amount DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_id VARCHAR(255),
        order_status VARCHAR(50) DEFAULT 'pending',
        fulfillment_status VARCHAR(50) DEFAULT 'unfulfilled',
        tracking_number VARCHAR(255),
        shipped_at TIMESTAMP,
        delivered_at TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created orders table')

    // 17. Create member_cars table (depends on members)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS member_cars (
        id SERIAL PRIMARY KEY,
        member_id INTEGER REFERENCES members(id),
        year INTEGER NOT NULL,
        make VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        trim VARCHAR(100),
        color VARCHAR(100),
        vin VARCHAR(17),
        engine_type VARCHAR(100),
        transmission VARCHAR(100),
        modifications TEXT,
        purchase_date TIMESTAMP,
        purchase_price DECIMAL(10, 2),
        current_value DECIMAL(10, 2),
        mileage INTEGER,
        condition VARCHAR(50),
        story TEXT,
        is_public BOOLEAN DEFAULT TRUE,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created member_cars table')

    // 18. Create event_registrations table (depends on events and members)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id),
        member_id INTEGER REFERENCES members(id),
        guest_name VARCHAR(255),
        guest_email VARCHAR(255),
        attendee_count INTEGER DEFAULT 1,
        ticket_type VARCHAR(100),
        total_amount DECIMAL(10, 2),
        payment_status VARCHAR(50) DEFAULT 'pending',
        payment_id VARCHAR(255),
        registration_status VARCHAR(50) DEFAULT 'registered',
        is_waitlisted BOOLEAN DEFAULT FALSE,
        checked_in_at TIMESTAMP,
        special_requests TEXT,
        emergency_contact JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created event_registrations table')

    // 19. Create messages table (depends on members)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        from_member_id INTEGER REFERENCES members(id),
        to_member_id INTEGER REFERENCES members(id),
        subject VARCHAR(255),
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        parent_message_id INTEGER REFERENCES messages(id),
        attachments JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created messages table')

    // 20. Create PayPal webhook logs table (depends on clubs)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS paypal_webhook_logs (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        webhook_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB NOT NULL,
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        processed_at TIMESTAMP,
        error_message TEXT
      )
    `)
    console.log('✅ Created paypal_webhook_logs table')

    // 21. Create PayPal transactions table (depends on clubs and members)
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS paypal_transactions (
        id SERIAL PRIMARY KEY,
        club_id INTEGER REFERENCES clubs(id),
        member_id INTEGER REFERENCES members(id),
        paypal_order_id VARCHAR(255),
        paypal_subscription_id VARCHAR(255),
        paypal_payment_id VARCHAR(255),
        transaction_type VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'USD',
        status VARCHAR(50) NOT NULL,
        description TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `)
    console.log('✅ Created paypal_transactions table')

    console.log('🎉 All database tables created successfully!')

  } catch (error) {
    console.error('❌ Error creating database schema:', error)
    process.exit(1)
  } finally {
    await queryClient.end()
  }
}

// Run the script
createInitialSchema()