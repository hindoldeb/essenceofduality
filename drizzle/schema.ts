import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Site Settings (hero, album description, artist bio) ─────────────────────
export const siteContent = mysqlTable("site_content", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(), // e.g. "hero_title", "album_description"
  lang: mysqlEnum("lang", ["en", "de"]).notNull(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Tracks ───────────────────────────────────────────────────────────────────
export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  trackNumber: int("trackNumber").notNull(),
  titleEn: varchar("titleEn", { length: 256 }).notNull(),
  titleDe: varchar("titleDe", { length: 256 }).notNull(),
  ragaEn: varchar("ragaEn", { length: 256 }).notNull(),
  ragaDe: varchar("ragaDe", { length: 256 }).notNull(),
  subtitleEn: varchar("subtitleEn", { length: 512 }),
  subtitleDe: varchar("subtitleDe", { length: 512 }),
  duration: varchar("duration", { length: 16 }).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Musicians ────────────────────────────────────────────────────────────────
export const musicians = mysqlTable("musicians", {
  id: int("id").autoincrement().primaryKey(),
  nameEn: varchar("nameEn", { length: 256 }).notNull(),
  nameDe: varchar("nameDe", { length: 256 }).notNull(),
  roleEn: varchar("roleEn", { length: 256 }).notNull(),
  roleDe: varchar("roleDe", { length: 256 }).notNull(),
  bioEn: text("bioEn").notNull(),
  bioDe: text("bioDe").notNull(),
  imageUrl: text("imageUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Press Reviews ────────────────────────────────────────────────────────────
export const pressReviews = mysqlTable("press_reviews", {
  id: int("id").autoincrement().primaryKey(),
  publicationEn: varchar("publicationEn", { length: 256 }).notNull(),
  publicationDe: varchar("publicationDe", { length: 256 }).notNull(),
  reviewerEn: varchar("reviewerEn", { length: 256 }),
  reviewerDe: varchar("reviewerDe", { length: 256 }),
  quoteEn: text("quoteEn").notNull(),
  quoteDe: text("quoteDe").notNull(),
  dateEn: varchar("dateEn", { length: 64 }),
  dateDe: varchar("dateDe", { length: 64 }),
  rating: int("rating").default(0), // out of 5
  sourceUrl: text("sourceUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Tour Dates ───────────────────────────────────────────────────────────────
export const tourDates = mysqlTable("tour_dates", {
  id: int("id").autoincrement().primaryKey(),
  dateStr: varchar("dateStr", { length: 64 }).notNull(), // display string e.g. "Nov 21, 2021"
  venueEn: varchar("venueEn", { length: 512 }).notNull(),
  venueDe: varchar("venueDe", { length: 512 }).notNull(),
  cityEn: varchar("cityEn", { length: 256 }).notNull(),
  cityDe: varchar("cityDe", { length: 256 }).notNull(),
  countryEn: varchar("countryEn", { length: 128 }).notNull(),
  countryDe: varchar("countryDe", { length: 128 }).notNull(),
  region: mysqlEnum("region", ["germany", "europe", "india", "other"]).default("germany").notNull(),
  eventUrl: text("eventUrl"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Gallery Images ───────────────────────────────────────────────────────────
export const galleryImages = mysqlTable("gallery_images", {
  id: int("id").autoincrement().primaryKey(),
  imageUrl: text("imageUrl").notNull(),
  captionEn: varchar("captionEn", { length: 512 }),
  captionDe: varchar("captionDe", { length: 512 }),
  altEn: varchar("altEn", { length: 512 }),
  altDe: varchar("altDe", { length: 512 }),
  category: mysqlEnum("category", ["concert", "portrait", "album", "tour", "other"]).default("concert").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Streaming Links ──────────────────────────────────────────────────────────
export const streamingLinks = mysqlTable("streaming_links", {
  id: int("id").autoincrement().primaryKey(),
  platform: varchar("platform", { length: 128 }).notNull(), // "Spotify", "Apple Music", etc.
  url: text("url").notNull(),
  iconKey: varchar("iconKey", { length: 64 }), // for frontend icon mapping
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Raga Descriptions ────────────────────────────────────────────────────────
export const ragaDescriptions = mysqlTable("raga_descriptions", {
  id: int("id").autoincrement().primaryKey(),
  ragaName: varchar("ragaName", { length: 256 }).notNull(),
  trackTitleEn: varchar("trackTitleEn", { length: 256 }).notNull(),
  trackTitleDe: varchar("trackTitleDe", { length: 256 }).notNull(),
  descriptionEn: text("descriptionEn").notNull(),
  descriptionDe: text("descriptionDe").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Sections (visibility / order) ───────────────────────────────────────────
export const sections = mysqlTable("sections", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(), // e.g. "tracklist", "gallery"
  labelEn: varchar("labelEn", { length: 256 }).notNull(),
  labelDe: varchar("labelDe", { length: 256 }).notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
