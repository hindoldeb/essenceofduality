import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function makeCtx(role: "admin" | "user" | null = null): TrpcContext {
  const user = role
    ? {
        id: 1,
        openId: "test-user",
        email: "test@example.com",
        name: "Test User",
        loginMethod: "manus",
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      }
    : null;

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("content router (public)", () => {
  it("getTracks returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getTracks();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getMusicians returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getMusicians();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getPressReviews returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getPressReviews();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getTourDates returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getTourDates();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getStreamingLinks returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getStreamingLinks();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getRagaDescriptions returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getRagaDescriptions();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getGalleryImages returns an array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getGalleryImages();
    expect(Array.isArray(result)).toBe(true);
  });

  it("getSiteContent returns an array for EN", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.content.getSiteContent({ lang: "en" });
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("admin router (protected)", () => {
  it("upsertTrack throws UNAUTHORIZED for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.admin.upsertTrack({
        trackNumber: 1, titleEn: "Test", titleDe: "Test",
        ragaEn: "Raga Test", ragaDe: "Raga Test", duration: "5:00", sortOrder: 1,
      })
    ).rejects.toThrow();
  });

  it("upsertTrack throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(
      caller.admin.upsertTrack({
        trackNumber: 1, titleEn: "Test", titleDe: "Test",
        ragaEn: "Raga Test", ragaDe: "Raga Test", duration: "5:00", sortOrder: 1,
      })
    ).rejects.toThrow();
  });
});

describe("auth router", () => {
  it("me returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user object for authenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx("admin"));
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.role).toBe("admin");
  });
});
