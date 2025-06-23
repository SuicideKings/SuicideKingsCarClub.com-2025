import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core"

// Gallery images table
export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  blobUrl: varchar("blob_url", { length: 1024 }).notNull(),
  pathname: varchar("pathname", { length: 1024 }).notNull(),
  chapter: varchar("chapter", { length: 50 }),
  category: varchar("category", { length: 50 }),
  contentType: varchar("content_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
