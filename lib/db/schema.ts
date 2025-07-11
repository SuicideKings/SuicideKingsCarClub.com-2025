import { pgTable, serial, varchar, text, timestamp, boolean, integer, decimal, jsonb } from "drizzle-orm/pg-core"

// Admin Users Table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Clubs Table
export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  founded: varchar("founded", { length: 4 }),
  memberCount: integer("member_count").default(0),
  logoUrl: varchar("logo_url", { length: 500 }),
  coverImageUrl: varchar("cover_image_url", { length: 500 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  website: varchar("website", { length: 255 }),
  socialLinks: jsonb("social_links"),
  paypalSettings: jsonb("paypal_settings"),
  paypalProductId: varchar("paypal_product_id", { length: 255 }),
  paypalMonthlyPlanId: varchar("paypal_monthly_plan_id", { length: 255 }),
  paypalYearlyPlanId: varchar("paypal_yearly_plan_id", { length: 255 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Members Table
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  role: varchar("role", { length: 50 }).default("member"),
  joinDate: timestamp("join_date").defaultNow(),
  membershipStatus: varchar("membership_status", { length: 50 }).default("active"),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  bio: text("bio"),
  carInfo: jsonb("car_info"),
  isEmailVerified: boolean("is_email_verified").default(false),
  paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }),
  subscriptionStatus: varchar("subscription_status", { length: 50 }),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  membershipTier: varchar("membership_tier", { length: 50 }),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  imageUrl: varchar("image_url", { length: 500 }),
  eventType: varchar("event_type", { length: 50 }).default("meetup"),
  isPublic: boolean("is_public").default(true),
  registrationRequired: boolean("registration_required").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Gallery Table
export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags"),
  uploadedBy: integer("uploaded_by").references(() => members.id),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Custom Pages Table
export const customPages = pgTable("custom_pages", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  content: jsonb("content").notNull(),
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Users Table (for general user authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  image: varchar("image", { length: 500 }),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Payments Table
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  clubId: integer("club_id").references(() => clubs.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 50 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paypalOrderId: varchar("paypal_order_id", { length: 255 }),
  paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// API Keys Table
export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  userId: integer("user_id").references(() => adminUsers.id),
  clubId: integer("club_id").references(() => clubs.id),
  permissions: jsonb("permissions"),
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("info"),
  isRead: boolean("is_read").default(false),
  actionUrl: varchar("action_url", { length: 500 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Websites Table
export const websites = pgTable("websites", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  name: varchar("name", { length: 255 }).notNull(),
  domain: varchar("domain", { length: 255 }),
  subdomain: varchar("subdomain", { length: 255 }),
  status: varchar("status", { length: 50 }).default("draft"),
  theme: varchar("theme", { length: 100 }).default("default"),
  customCss: text("custom_css"),
  settings: jsonb("settings"),
  deploymentUrl: varchar("deployment_url", { length: 500 }),
  lastDeployedAt: timestamp("last_deployed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Website Versions Table
export const websiteVersions = pgTable("website_versions", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id),
  version: varchar("version", { length: 50 }).notNull(),
  content: jsonb("content").notNull(),
  changelog: text("changelog"),
  isActive: boolean("is_active").default(false),
  createdBy: integer("created_by").references(() => adminUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
})

// Jobs Table (for background processing)
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  payload: jsonb("payload"),
  status: varchar("status", { length: 50 }).default("pending"),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  error: text("error"),
  scheduledFor: timestamp("scheduled_for"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Backups Table
export const backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  websiteId: integer("website_id").references(() => websites.id),
  filename: varchar("filename", { length: 255 }).notNull(),
  size: integer("size"),
  type: varchar("type", { length: 50 }).default("full"),
  status: varchar("status", { length: 50 }).default("pending"),
  storageUrl: varchar("storage_url", { length: 500 }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
})

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 100 }).unique().notNull(),
  clubId: integer("club_id").references(() => clubs.id),
  memberId: integer("member_id").references(() => members.id),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerName: varchar("customer_name", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 20 }),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).default("0"),
  shippingAmount: decimal("shipping_amount", { precision: 10, scale: 2 }).default("0"),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  paymentId: varchar("payment_id", { length: 255 }),
  orderStatus: varchar("order_status", { length: 50 }).default("pending"),
  fulfillmentStatus: varchar("fulfillment_status", { length: 50 }).default("unfulfilled"),
  trackingNumber: varchar("tracking_number", { length: 255 }),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  sku: varchar("sku", { length: 100 }).unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  memberPrice: decimal("member_price", { precision: 10, scale: 2 }),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags"),
  images: jsonb("images"),
  variants: jsonb("variants"),
  inventory: integer("inventory"),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: jsonb("dimensions"),
  shippingRequired: boolean("shipping_required").default(true),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Member Cars Table
export const memberCars = pgTable("member_cars", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id),
  year: integer("year").notNull(),
  make: varchar("make", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  trim: varchar("trim", { length: 100 }),
  color: varchar("color", { length: 100 }),
  vin: varchar("vin", { length: 17 }),
  engineType: varchar("engine_type", { length: 100 }),
  transmission: varchar("transmission", { length: 100 }),
  modifications: text("modifications"),
  purchaseDate: timestamp("purchase_date"),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 2 }),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  mileage: integer("mileage"),
  condition: varchar("condition", { length: 50 }),
  story: text("story"),
  isPublic: boolean("is_public").default(true),
  isPrimary: boolean("is_primary").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Event Registrations Table
export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id),
  memberId: integer("member_id").references(() => members.id),
  guestName: varchar("guest_name", { length: 255 }),
  guestEmail: varchar("guest_email", { length: 255 }),
  attendeeCount: integer("attendee_count").default(1),
  ticketType: varchar("ticket_type", { length: 100 }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  paymentId: varchar("payment_id", { length: 255 }),
  registrationStatus: varchar("registration_status", { length: 50 }).default("registered"),
  isWaitlisted: boolean("is_waitlisted").default(false),
  checkedInAt: timestamp("checked_in_at"),
  specialRequests: text("special_requests"),
  emergencyContact: jsonb("emergency_contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Messages Table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  fromMemberId: integer("from_member_id").references(() => members.id),
  toMemberId: integer("to_member_id").references(() => members.id),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  parentMessageId: integer("parent_message_id").references(() => messages.id),
  attachments: jsonb("attachments"),
  createdAt: timestamp("created_at").defaultNow(),
})

// PayPal Webhook Logs Table
export const paypalWebhookLogs = pgTable("paypal_webhook_logs", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  webhookId: varchar("webhook_id", { length: 255 }).notNull(),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  eventData: jsonb("event_data").notNull(),
  processed: boolean("processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  errorMessage: text("error_message"),
})

// PayPal Transactions Table
export const paypalTransactions = pgTable("paypal_transactions", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  memberId: integer("member_id").references(() => members.id),
  paypalOrderId: varchar("paypal_order_id", { length: 255 }),
  paypalSubscriptionId: varchar("paypal_subscription_id", { length: 255 }),
  paypalPaymentId: varchar("paypal_payment_id", { length: 255 }),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  status: varchar("status", { length: 50 }).notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Update the schema export to include all tables
export const schema = {
  adminUsers,
  clubs,
  members,
  events,
  gallery,
  customPages,
  users,
  payments,
  apiKeys,
  notifications,
  websites,
  websiteVersions,
  jobs,
  backups,
  orders,
  products,
  memberCars,
  eventRegistrations,
  messages,
  paypalWebhookLogs,
  paypalTransactions,
}

export default schema
