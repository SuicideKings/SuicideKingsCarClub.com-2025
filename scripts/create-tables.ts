--Create
orders
table
CREATE
TABLE
IF
NOT
EXISTS
orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  club_id INTEGER REFERENCES clubs(id),
  member_id INTEGER REFERENCES members(id),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(20),
  shipping_address JSONB,
  billing_address JSONB,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  shipping_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
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
);

--Create
products
table
CREATE
TABLE
IF
NOT
EXISTS
products (
  id SERIAL PRIMARY KEY,
  club_id INTEGER REFERENCES clubs(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  sku VARCHAR(100) UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  member_price DECIMAL(10,2),
  cost_price DECIMAL(10,2),
  category VARCHAR(100),
  tags JSONB,
  images JSONB,
  variants JSONB,
  inventory INTEGER,
  low_stock_threshold INTEGER DEFAULT 5,
  weight DECIMAL(8,2),
  dimensions JSONB,
  shipping_required BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  seo_title VARCHAR(255),
  seo_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--Create
member_cars
table
CREATE
TABLE
IF
NOT
EXISTS
member_cars (
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
  purchase_price DECIMAL(10,2),
  current_value DECIMAL(10,2),
  mileage INTEGER,
  condition VARCHAR(50),
  story TEXT,
  is_public BOOLEAN DEFAULT true,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--Create
event_registrations
table
CREATE
TABLE
IF
NOT
EXISTS
event_registrations (
  id SERIAL PRIMARY KEY,
  event_id INTEGER REFERENCES events(id),
  member_id INTEGER REFERENCES members(id),
  guest_name VARCHAR(255),
  guest_email VARCHAR(255),
  attendee_count INTEGER DEFAULT 1,
  ticket_type VARCHAR(100),
  total_amount DECIMAL(10,2),
  payment_status VARCHAR(50) DEFAULT 'pending',
  payment_id VARCHAR(255),
  registration_status VARCHAR(50) DEFAULT 'registered',
  is_waitlisted BOOLEAN DEFAULT false,
  checked_in_at TIMESTAMP,
  special_requests TEXT,
  emergency_contact JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

--Create
messages
table
CREATE
TABLE
IF
NOT
EXISTS
messages (
  id SERIAL PRIMARY KEY,
  from_member_id INTEGER REFERENCES members(id),
  to_member_id INTEGER REFERENCES members(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  parent_message_id INTEGER REFERENCES messages(id),
  attachments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
