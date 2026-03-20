# Essence of Duality CMS — TODO

## Phase 1: Database Schema & Migrations
- [x] Design and write full database schema (content, tracks, musicians, reviews, tour dates, gallery, streaming links, sections)
- [x] Push migrations with pnpm db:push

## Phase 2: Backend API
- [x] tRPC routes for site content (album info, hero, bio) — bilingual
- [x] tRPC routes for tracks CRUD
- [x] tRPC routes for musicians CRUD
- [x] tRPC routes for press reviews CRUD
- [x] tRPC routes for tour dates CRUD
- [x] tRPC routes for gallery images CRUD
- [x] tRPC routes for streaming links CRUD
- [x] tRPC routes for raga descriptions CRUD
- [x] tRPC routes for section ordering/visibility
- [x] Image upload endpoint (S3)

## Phase 3: Public Website
- [x] Global CSS theme (black bg, gold accents, serif fonts)
- [x] Language toggle (EN/DE) with context
- [x] Hero section
- [x] Album info section
- [x] Tracklist section
- [x] Quartet musician bios section
- [x] Photo gallery section
- [x] Press reviews section
- [x] Raga descriptions section
- [x] Artist biography section
- [x] Tour history section
- [x] Streaming links footer
- [x] Responsive design

## Phase 4: Admin Dashboard
- [x] Auth-protected admin layout with sidebar
- [x] Dashboard overview page
- [x] Album info editor (bilingual text fields)
- [x] Tracks manager (add/edit/delete/reorder)
- [x] Musicians manager (add/edit/delete)
- [x] Press reviews manager (add/edit/delete with star ratings)
- [x] Tour dates manager (add/edit/delete)
- [x] Gallery image manager (upload/delete/caption)
- [x] Streaming links manager
- [x] Raga descriptions manager
- [x] Section visibility/order manager
- [x] Image upload with preview

## Phase 5: Seed & Tests
- [x] Seed all existing content (EN + DE) into database
- [x] Upload all images to CDN and store URLs
- [x] Write vitest tests for key API routes (13 tests passing)

## Phase 6: Delivery
- [x] Save checkpoint
- [x] Deliver to user

## Bug Fixes
- [x] Fix admin routing 404 bug (wouter nest path doubling — switched to flat absolute routes)
- [x] Remove hero background image upload from admin Site Content and public hero section
- [x] Fix language toggle — DE button does not switch site to German
- [x] Re-add hero background image upload to Admin Site Content and restore hero background in public site
- [x] Make hero overlay more transparent, reduce h1 size, push title lower
- [x] Push hero headline and all text further down toward the bottom of the hero section
- [x] Anchor all hero text to the very bottom of the hero viewport (currently drifting upward)
- [x] Compact hero text block — reduce spacing so entire block fits in bottom third without clipping
- [x] Hero: keep "Essence of Duality" on one line on desktop, push text further down
- [x] Hero: remove "Hindol Deb Quartet · Cologne, Germany · 2021" tagline, increase title font size by 10pt, push all text and SCROLL further down
- [x] Add top padding to hero section so the photo has breathing room at the top
- [x] Add top padding to hero so musicians' heads are not cropped — shift background-position to top
- [x] Hero: increase title font size by 5pt more, push text block further down
