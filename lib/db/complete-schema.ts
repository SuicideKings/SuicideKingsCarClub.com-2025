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
  settings: jsonb("settings"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Members Table (Enhanced)
export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zip_code", { length: 10 }),
  dateOfBirth: timestamp("date_of_birth"),
  role: varchar("role", { length: 50 }).default("member"),
  membershipType: varchar("membership_type", { length: 50 }).default("regular"),
  membershipStatus: varchar("membership_status", { length: 50 }).default("active"),
  memberNumber: varchar("member_number", { length: 50 }).unique(),
  joinDate: timestamp("join_date").defaultNow(),
  renewalDate: timestamp("renewal_date"),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  bio: text("bio"),
  emergencyContact: jsonb("emergency_contact"),
  preferences: jsonb("preferences"),
  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
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

// Car Photos Table
export const carPhotos = pgTable("car_photos", {
  id: serial("id").primaryKey(),
  carId: integer("car_id").references(() => memberCars.id),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  caption: text("caption"),
  isPrimary: boolean("is_primary").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

// Events Table (Enhanced)
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  createdBy: integer("created_by").references(() => members.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  eventDate: timestamp("event_date").notNull(),
  endDate: timestamp("end_date"),
  registrationDeadline: timestamp("registration_deadline"),
  location: varchar("location", { length: 255 }),
  address: text("address"),
  coordinates: jsonb("coordinates"),
  ticketPrice: decimal("ticket_price", { precision: 10, scale: 2 }),
  memberPrice: decimal("member_price", { precision: 10, scale: 2 }),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  waitlistCount: integer("waitlist_count").default(0),
  imageUrl: varchar("image_url", { length: 500 }),
  eventType: varchar("event_type", { length: 50 }).default("meetup"),
  category: varchar("category", { length: 100 }),
  tags: jsonb("tags"),
  requirements: text("requirements"),
  whatToBring: text("what_to_bring"),
  schedule: jsonb("schedule"),
  sponsors: jsonb("sponsors"),
  isPublic: boolean("is_public").default(true),
  isFeatured: boolean("is_featured").default(false),
  registrationRequired: boolean("registration_required").default(false),
  allowWaitlist: boolean("allow_waitlist").default(true),
  isVirtual: boolean("is_virtual").default(false),
  virtualLink: varchar("virtual_link", { length: 500 }),
  status: varchar("status", { length: 50 }).default("upcoming"),
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

// Store Products Table
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

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productSku: varchar("product_sku", { length: 100 }),
  variant: jsonb("variant"),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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

// Notifications Table (Enhanced)
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id),
  clubId: integer("club_id").references(() => clubs.id),
  type: varchar("type", { length: 100 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  data: jsonb("data"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  actionUrl: varchar("action_url", { length: 500 }),
  priority: varchar("priority", { length: 20 }).default("normal"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Announcements Table
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  createdBy: integer("created_by").references(() => members.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).default("general"),
  priority: varchar("priority", { length: 20 }).default("normal"),
  targetAudience: jsonb("target_audience"),
  isPublic: boolean("is_public").default(true),
  isPinned: boolean("is_pinned").default(false),
  publishAt: timestamp("publish_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  viewCount: integer("view_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Newsletter Subscriptions Table
export const newsletterSubscriptions = pgTable("newsletter_subscriptions", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  clubId: integer("club_id").references(() => clubs.id),
  memberId: integer("member_id").references(() => members.id),
  isActive: boolean("is_active").default(true),
  preferences: jsonb("preferences"),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
})

// Sponsors Table
export const sponsors = pgTable("sponsors", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  logoUrl: varchar("logo_url", { length: 500 }),
  website: varchar("website", { length: 255 }),
  contactEmail: varchar("contact_email", { length: 255 }),
  contactPhone: varchar("contact_phone", { length: 20 }),
  sponsorshipLevel: varchar("sponsorship_level", { length: 50 }),
  sponsorshipAmount: decimal("sponsorship_amount", { precision: 10, scale: 2 }),
  benefits: jsonb("benefits"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Club Finances Table
export const clubFinances = pgTable("club_finances", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  type: varchar("type", { length: 50 }).notNull(), // income, expense
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  referenceNumber: varchar("reference_number", { length: 255 }),
  relatedId: integer("related_id"), // Can reference orders, events, etc.
  relatedType: varchar("related_type", { length: 50 }),
  approvedBy: integer("approved_by").references(() => members.id),
  receiptUrl: varchar("receipt_url", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Voting/Polls Table
export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  createdBy: integer("created_by").references(() => members.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  options: jsonb("options").notNull(),
  allowMultiple: boolean("allow_multiple").default(false),
  isAnonymous: boolean("is_anonymous").default(false),
  requiresApproval: boolean("requires_approval").default(false),
  eligibleRoles: jsonb("eligible_roles"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  totalVotes: integer("total_votes").default(0),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Poll Votes Table
export const pollVotes = pgTable("poll_votes", {
  id: serial("id").primaryKey(),
  pollId: integer("poll_id").references(() => polls.id),
  memberId: integer("member_id").references(() => members.id),
  selectedOptions: jsonb("selected_options").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
})

// Meeting Minutes Table
export const meetingMinutes = pgTable("meeting_minutes", {
  id: serial("id").primaryKey(),
  clubId: integer("club_id").references(() => clubs.id),
  title: varchar("title", { length: 255 }).notNull(),
  meetingDate: timestamp("meeting_date").notNull(),
  location: varchar("location", { length: 255 }),
  attendees: jsonb("attendees"),
  agenda: jsonb("agenda"),
  minutes: text("minutes").notNull(),
  actionItems: jsonb("action_items"),
  nextMeetingDate: timestamp("next_meeting_date"),
  attachments: jsonb("attachments"),
  isPublic: boolean("is_public").default(false),
  approvedBy: integer("approved_by").references(() => members.id),
  approvedAt: timestamp("approved_at"),
  createdBy: integer("created_by").references(() => members.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Export all tables
export const completeSchema = {
  adminUsers,
  clubs,
  members,
  memberCars,
  carPhotos,
  events,
  eventRegistrations,
  products,
  orders,
  orderItems,
  messages,
  notifications,
  announcements,
  newsletterSubscriptions,
  sponsors,
  clubFinances,
  polls,
  pollVotes,
  meetingMinutes,
}

export default completeSchema
