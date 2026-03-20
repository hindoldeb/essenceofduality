import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import {
  getAllSiteContent, getSiteContentByLang, upsertSiteContent,
  getAllTracks, upsertTrack, deleteTrack,
  getAllMusicians, upsertMusician, deleteMusician,
  getAllPressReviews, upsertPressReview, deletePressReview,
  getAllTourDates, upsertTourDate, deleteTourDate,
  getAllGalleryImages, insertGalleryImage, updateGalleryImage, deleteGalleryImage,
  getAllStreamingLinks, upsertStreamingLink, deleteStreamingLink,
  getAllRagaDescriptions, upsertRagaDescription, deleteRagaDescription,
  getAllSections, upsertSection,
} from "./db";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Public content reads ────────────────────────────────────────────────
  content: router({
    getSiteContent: publicProcedure
      .input(z.object({ lang: z.enum(["en", "de"]) }))
      .query(({ input }) => getSiteContentByLang(input.lang)),

    getAllSiteContent: publicProcedure.query(() => getAllSiteContent()),

    getTracks: publicProcedure.query(() => getAllTracks()),
    getMusicians: publicProcedure.query(() => getAllMusicians()),
    getPressReviews: publicProcedure.query(() => getAllPressReviews()),
    getTourDates: publicProcedure.query(() => getAllTourDates()),
    getGalleryImages: publicProcedure.query(() => getAllGalleryImages()),
    getStreamingLinks: publicProcedure.query(() => getAllStreamingLinks()),
    getRagaDescriptions: publicProcedure.query(() => getAllRagaDescriptions()),
    getSections: publicProcedure.query(() => getAllSections()),
  }),

  // ─── Admin mutations ─────────────────────────────────────────────────────
  admin: router({
    // Site content (key/value bilingual)
    upsertSiteContent: adminProcedure
      .input(z.object({
        key: z.string(),
        lang: z.enum(["en", "de"]),
        value: z.string(),
      }))
      .mutation(({ input }) => upsertSiteContent(input.key, input.lang, input.value)),

    // Tracks
    upsertTrack: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        trackNumber: z.number(),
        titleEn: z.string(),
        titleDe: z.string(),
        ragaEn: z.string(),
        ragaDe: z.string(),
        subtitleEn: z.string().optional(),
        subtitleDe: z.string().optional(),
        duration: z.string(),
        sortOrder: z.number().default(0),
      }))
      .mutation(({ input }) => upsertTrack(input)),

    deleteTrack: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteTrack(input.id)),

    // Musicians
    upsertMusician: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        nameEn: z.string(),
        nameDe: z.string(),
        roleEn: z.string(),
        roleDe: z.string(),
        bioEn: z.string(),
        bioDe: z.string(),
        imageUrl: z.string().nullish(),
        sortOrder: z.number().default(0),
      }))
      .mutation(({ input }) => upsertMusician({ ...input, imageUrl: input.imageUrl ?? undefined })),

    deleteMusician: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteMusician(input.id)),

    // Press Reviews
    upsertPressReview: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        publicationEn: z.string(),
        publicationDe: z.string(),
        reviewerEn: z.string().optional(),
        reviewerDe: z.string().optional(),
        quoteEn: z.string(),
        quoteDe: z.string(),
        dateEn: z.string().optional(),
        dateDe: z.string().optional(),
        rating: z.number().min(0).max(5).default(0),
        sourceUrl: z.string().optional(),
        sortOrder: z.number().default(0),
      }))
      .mutation(({ input }) => upsertPressReview(input)),

    deletePressReview: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePressReview(input.id)),

    // Tour Dates
    upsertTourDate: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        dateStr: z.string(),
        venueEn: z.string(),
        venueDe: z.string(),
        cityEn: z.string(),
        cityDe: z.string(),
        countryEn: z.string(),
        countryDe: z.string(),
        region: z.enum(["germany", "europe", "india", "other"]).default("germany"),
        eventUrl: z.string().nullish(),
        sortOrder: z.number().default(0),
      }))
      .mutation(({ input }) => upsertTourDate({ ...input, eventUrl: input.eventUrl ?? undefined })),

    deleteTourDate: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteTourDate(input.id)),

    // Gallery
    addGalleryImage: adminProcedure
      .input(z.object({
        imageUrl: z.string(),
        captionEn: z.string().optional(),
        captionDe: z.string().optional(),
        altEn: z.string().optional(),
        altDe: z.string().optional(),
        category: z.enum(["concert", "portrait", "album", "tour", "other"]).default("concert"),
        sortOrder: z.number().default(0),
      }))
      .mutation(({ input }) => insertGalleryImage(input)),

    updateGalleryImage: adminProcedure
      .input(z.object({
        id: z.number(),
        captionEn: z.string().optional(),
        captionDe: z.string().optional(),
        altEn: z.string().optional(),
        altDe: z.string().optional(),
        category: z.enum(["concert", "portrait", "album", "tour", "other"]).optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateGalleryImage(id, data);
      }),

    deleteGalleryImage: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteGalleryImage(input.id)),

    // Streaming Links
    upsertStreamingLink: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        platform: z.string(),
        url: z.string(),
        iconKey: z.string().optional(),
        sortOrder: z.number().default(0),
        isActive: z.boolean().default(true),
      }))
      .mutation(({ input }) => upsertStreamingLink(input)),

    deleteStreamingLink: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteStreamingLink(input.id)),

    // Raga Descriptions
    upsertRagaDescription: adminProcedure
      .input(z.object({
        id: z.number().optional(),
        ragaName: z.string(),
        trackTitleEn: z.string(),
        trackTitleDe: z.string(),
        descriptionEn: z.string(),
        descriptionDe: z.string(),
        sortOrder: z.number().default(0),
      }))
      .mutation(({ input }) => upsertRagaDescription(input)),

    deleteRagaDescription: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteRagaDescription(input.id)),

    // Sections
    updateSection: adminProcedure
      .input(z.object({
        key: z.string(),
        labelEn: z.string(),
        labelDe: z.string(),
        isVisible: z.boolean(),
        sortOrder: z.number(),
      }))
      .mutation(({ input }) => upsertSection(input)),

    // Image upload — returns CDN URL
    uploadImage: adminProcedure
      .input(z.object({
        filename: z.string(),
        contentType: z.string(),
        dataBase64: z.string(), // base64 encoded file
      }))
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.dataBase64, "base64");
        const ext = input.filename.split(".").pop() || "jpg";
        const key = `essence-duality/${nanoid()}.${ext}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
