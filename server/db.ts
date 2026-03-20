import { eq, asc, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  siteContent,
  tracks,
  musicians,
  pressReviews,
  tourDates,
  galleryImages,
  streamingLinks,
  ragaDescriptions,
  sections,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Site Content ─────────────────────────────────────────────────────────────
export async function getAllSiteContent() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteContent).orderBy(asc(siteContent.key));
}

export async function getSiteContentByLang(lang: "en" | "de") {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteContent).where(eq(siteContent.lang, lang));
}

export async function upsertSiteContent(key: string, lang: "en" | "de", value: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(siteContent).values({ key, lang, value }).onDuplicateKeyUpdate({ set: { value } });
}

// ─── Tracks ───────────────────────────────────────────────────────────────────
export async function getAllTracks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tracks).orderBy(asc(tracks.sortOrder));
}

export async function upsertTrack(data: typeof tracks.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(tracks).set(data).where(eq(tracks.id, data.id));
  } else {
    await db.insert(tracks).values(data);
  }
}

export async function deleteTrack(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(tracks).where(eq(tracks.id, id));
}

// ─── Musicians ────────────────────────────────────────────────────────────────
export async function getAllMusicians() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(musicians).orderBy(asc(musicians.sortOrder));
}

export async function upsertMusician(data: typeof musicians.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(musicians).set(data).where(eq(musicians.id, data.id));
  } else {
    await db.insert(musicians).values(data);
  }
}

export async function deleteMusician(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(musicians).where(eq(musicians.id, id));
}

// ─── Press Reviews ────────────────────────────────────────────────────────────
export async function getAllPressReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pressReviews).orderBy(asc(pressReviews.sortOrder));
}

export async function upsertPressReview(data: typeof pressReviews.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(pressReviews).set(data).where(eq(pressReviews.id, data.id));
  } else {
    await db.insert(pressReviews).values(data);
  }
}

export async function deletePressReview(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(pressReviews).where(eq(pressReviews.id, id));
}

// ─── Tour Dates ───────────────────────────────────────────────────────────────
export async function getAllTourDates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tourDates).orderBy(desc(tourDates.sortOrder));
}

export async function upsertTourDate(data: typeof tourDates.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(tourDates).set(data).where(eq(tourDates.id, data.id));
  } else {
    await db.insert(tourDates).values(data);
  }
}

export async function deleteTourDate(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(tourDates).where(eq(tourDates.id, id));
}

// ─── Gallery Images ───────────────────────────────────────────────────────────
export async function getAllGalleryImages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryImages).orderBy(asc(galleryImages.sortOrder));
}

export async function insertGalleryImage(data: typeof galleryImages.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(galleryImages).values(data);
}

export async function updateGalleryImage(id: number, data: Partial<typeof galleryImages.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
}

// ─── Streaming Links ──────────────────────────────────────────────────────────
export async function getAllStreamingLinks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(streamingLinks).orderBy(asc(streamingLinks.sortOrder));
}

export async function upsertStreamingLink(data: typeof streamingLinks.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(streamingLinks).set(data).where(eq(streamingLinks.id, data.id));
  } else {
    await db.insert(streamingLinks).values(data);
  }
}

export async function deleteStreamingLink(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(streamingLinks).where(eq(streamingLinks.id, id));
}

// ─── Raga Descriptions ────────────────────────────────────────────────────────
export async function getAllRagaDescriptions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ragaDescriptions).orderBy(asc(ragaDescriptions.sortOrder));
}

export async function upsertRagaDescription(data: typeof ragaDescriptions.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  if (data.id) {
    await db.update(ragaDescriptions).set(data).where(eq(ragaDescriptions.id, data.id));
  } else {
    await db.insert(ragaDescriptions).values(data);
  }
}

export async function deleteRagaDescription(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(ragaDescriptions).where(eq(ragaDescriptions.id, id));
}

// ─── Sections ─────────────────────────────────────────────────────────────────
export async function getAllSections() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sections).orderBy(asc(sections.sortOrder));
}

export async function upsertSection(data: typeof sections.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(sections).values(data).onDuplicateKeyUpdate({ set: { isVisible: data.isVisible, sortOrder: data.sortOrder } });
}
