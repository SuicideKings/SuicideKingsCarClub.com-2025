import { pgTable, serial, text, timestamp, boolean, integer, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Forum Categories
export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  icon: varchar("icon", { length: 50 }),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Forum Topics
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => forumUsers.id),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  replyCount: integer("reply_count").default(0),
  lastReplyAt: timestamp("last_reply_at"),
  lastReplyBy: integer("last_reply_by").references(() => forumUsers.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Forum Posts (Replies)
export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").references(() => forumTopics.id),
  authorId: integer("author_id").references(() => forumUsers.id),
  content: text("content").notNull(),
  isDeleted: boolean("is_deleted").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Forum Users
export const forumUsers = pgTable("forum_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  avatar: varchar("avatar", { length: 500 }),
  bio: text("bio"),
  postCount: integer("post_count").default(0),
  reputation: integer("reputation").default(0),
  role: varchar("role", { length: 50 }).default("member"),
  isActive: boolean("is_active").default(true),
  lastSeenAt: timestamp("last_seen_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
})

// Relations
export const forumCategoriesRelations = relations(forumCategories, ({ many }) => ({
  topics: many(forumTopics),
}))

export const forumTopicsRelations = relations(forumTopics, ({ one, many }) => ({
  category: one(forumCategories, {
    fields: [forumTopics.categoryId],
    references: [forumCategories.id],
  }),
  author: one(forumUsers, {
    fields: [forumTopics.authorId],
    references: [forumUsers.id],
  }),
  posts: many(forumPosts),
}))

export const forumPostsRelations = relations(forumPosts, ({ one }) => ({
  topic: one(forumTopics, {
    fields: [forumPosts.topicId],
    references: [forumTopics.id],
  }),
  author: one(forumUsers, {
    fields: [forumPosts.authorId],
    references: [forumUsers.id],
  }),
}))

export const forumUsersRelations = relations(forumUsers, ({ many }) => ({
  topics: many(forumTopics),
  posts: many(forumPosts),
}))
