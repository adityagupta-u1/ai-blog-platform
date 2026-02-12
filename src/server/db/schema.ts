import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { v4 as uuidV4 } from "uuid";

export const users = pgTable("users", {
  id: varchar("id",{length:255}).primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(), 
  image: varchar("image", { length: 255 }).notNull(),
  role: text("role").default("user"), 
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().$default(() => uuidV4()),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  title: text("title").notNull(),
  slug: text("slug").notNull(), 
  content: text("content").notNull(),
  banner_img: text("banner_image").notNull().default(""), // URL to the banner image
  summary: text("summary"),
  status: text("status").default("draft"), // draft, published, archived
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),// public, private, unlisted
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Categories
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().$default(() => uuidV4()),
  name: varchar("name", { length: 100 }).unique().notNull(),
  slug: text("slug").notNull().unique(), 
});

// Tags
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().$default(() => uuidV4()),
  name: varchar("name", { length: 50 }).unique().notNull(),
  slug: text("slug").notNull().unique(), // slug for URL
});

// Post <-> Tags (many-to-many)
export const postTags = pgTable("post_tags", {
  postId: uuid("post_id").notNull().references(() => posts.id, {onDelete: "cascade"}),
  tagId: uuid("tag_id").notNull().references(() => tags.id,{onDelete: "cascade"}),
});

// View tracking
export const views = pgTable("views", {
  id: uuid("id").primaryKey().$default(() => uuidV4()),
  postId: uuid("post_id").references(() => posts.id,{onDelete:'cascade'}).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id,{onDelete:'cascade'}),
  anonId: text("anon_id"), // optional: logged-in or anonymous
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// AI Prompt History (optional)
export const aiPrompts = pgTable("ai_prompts", {
  id: uuid("id").primaryKey().$default(() => uuidV4()),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  prompt: text("prompt").notNull(),
  response: text("response"),
  createdAt: timestamp("created_at").defaultNow(),
});



