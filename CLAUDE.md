# CLAUDE.md — Brendon & Maria wedding template (templates.floralsandframes.com)

> Handoff for a fresh session. This repo is the **Brendon & Maria cinematic
> wedding invitation** — a fictional **demo** that doubles as the showcase
> **template/product** for the business _Florals and Frames_ (wedding-website
> design, Goa). Keep this file updated as things change.

## SCOPE — read this first

- **In scope:** everything in THIS repo — the Brendon & Maria wedding template,
  deployed at **templates.floralsandframes.com**.
- **Out of scope (do NOT touch from here):** the company **marketing/landing
  site** is a *separate project* in a different folder
  (`…/main-landing-page/florals-and-frames-redesign/floralsandframes-landing`)
  with its own repo. Work on that in its own session.

## What the site is

A single-page, scroll-driven "interactive wedding film": light, floral story of the
couple (Brendon & Maria, **28 Dec 2026, Goa**). A rose-covered floral archway (you
scroll *through* it, toward the sea) → couple revealed in the light → their story →
proposal → date → church video → bride & groom → memories → reception → countdown →
details → RSVP → final blessing → creator credit. On entry (EntryGate click) a
cascade of rose **petals falls** over the opening scene.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v3 ·
GSAP + ScrollTrigger + @gsap/react. Node 20.

## Architecture / where to change things

- **ALL content is centralized in [`lib/site.ts`](lib/site.ts):** couple names,
  date, venues, scriptures, story milestones, `photos`, `music`, and `creator`
  (Florals & Frames brand + WhatsApp). Editing this file re-skins the whole site.
- `app/page.tsx` → `<MusicProvider>` → `<Experience>` (`components/Experience.tsx`
  holds the loader, entry gate, and the ordered list of sections).
- One master GSAP timeline per cinematic scene on ONE ScrollTrigger, via
  `useGSAP({ scope })`; `gsap.matchMedia()` gives desktop / mobile / reduced-motion
  variants; contexts auto-clean on unmount. Don't split a scene into many triggers.
- **Photos** live in `public/images/`, numbered by section:
  `1.jpg`=hero, `2.jpg`=Our Story, `3.jpg`+`3-backup.jpg`=parallax, `4.jpg`=proposal,
  `5-bride.jpg` / `5-groom.jpg`, `6.jpg`=memory, `7.jpg`=reception, `8.jpg`=farewell,
  `companylogo.png`=F&F logo. Multi-photo sections cycle their array in `photos`.
  Photos were resized to a 2000px long edge (~20MB→~1.9MB). **All lowercase names.**
- **Music:** one global `<audio>` in `components/audio/MusicProvider.tsx`. Entry
  gate offers "Enter with music / Enter quietly"; NO autoplay; GSAP volume fades;
  small waveform toggle bottom-right; optional per-section volume ducking.
- **Church video:** `public/videos/church-cinematic.mp4`, scroll-scrubbed (scroll
  drives `currentTime`), muted, re-encoded short-GOP for smooth seeking.
- `components/ChurchSection.tsx` exists but is **UNUSED** (its content merged into
  the scroll-scrubbed video section).
- **Opening scene = `components/FloralArchHero.tsx`** (section 01): a floral arch
  drawn entirely in code — ~226 layered "florets" (roses + greenery) generated
  from a fixed seed (`mulberry32`) so SSR === CSR (no hydration flicker). One
  pinned ScrollTrigger, stages `silence · approach · passThrough · coupleReveal ·
  names · announcement`; the arch scales up + lifts away ("walk through it") to
  reveal the couple. `components/PetalFall.tsx` (mounted in `Experience.tsx`,
  reads `hasEntered` from `MusicProvider`) rains rose petals once on entry, then
  removes itself. The old `components/ChurchDoorHero.tsx` is **kept but UNUSED**
  (previous doors opening — swap the import in `Experience.tsx` to restore it).

## Brand / theme (current = light)

Light "white & pink florals" palette. Tokens in `tailwind.config.ts` + CSS vars in
`app/globals.css`: blush `#FBF4F2`, rose `#D98B98`, mauve `#9C6B78`, sage `#93A583`,
muted gold `#C2A063`, ink `#4A403C`. Fonts: Cormorant Garamond (display), Inter
(sans), Pinyon Script (script). A **dark cinematic theme** exists earlier in git
history (a second selectable style).

## Key behaviours implemented (so you don't undo them)

- **Text over photos/video = light (ivory) on a soft dark scrim**; solid-background
  sections = dark ink text. The hero names/date sit on a scrim revealed with the
  couple photo (so they read over the brown church photo); "Scroll to enter" stays
  dark (it's over pale doors before the photo appears).
- **Scroll fully locked behind the loader/entry gate** — locks `<html>`+`<body>`
  AND blocks wheel/touch/scroll-keys — so the site can't be scrolled before the
  visitor chooses. See `Experience.tsx`.
- **Self-healing layout:** `ScrollTrigger.refresh()` fires on `window.load`,
  `document.fonts.ready`, and timed safety nets, so scrolling before assets finish
  doesn't leave pinned sections mis-positioned.
- **`overflow-x: clip`** on the root prevents mobile horizontal-scroll from
  animation offsets (the original Android "broken render" bug).
- **Share/SEO:** `app/opengraph-image.tsx`, `app/twitter-image.tsx`,
  `app/icon.tsx`, `app/apple-icon.tsx` generate the share card + favicon via
  `next/og`. `metadataBase` in `app/layout.tsx` = `https://floralsandframes.com`.
- **Creator branding:** floating "♡ Create a story like this" pill (bottom-left)
  + closing credit with the logo, brand "Florals and Frames", and a WhatsApp
  enquiry CTA (`wa.me/917020727961`, message pre-fills the couple's names).

## Hosting & deploy — IMPORTANT

- Live on **Hostinger** (NOT Vercel). Custom domain(s): `floralsandframes.com`
  (currently the template) and planned `templates.floralsandframes.com`.
- **Hostinger's CDN over-caches HTML** (`s-maxage=31536000`). After EVERY deploy
  you MUST **purge the Hostinger CDN cache**, or it serves stale HTML referencing
  deleted JS/CSS chunks → "This page couldn't load" on first load (reload fixes it).
  This was a real, diagnosed bug — don't forget the purge.
- Recommendation on the table: move hosting to **Vercel** (handles Next.js deploy
  skew + subdomains cleanly, no cache-purging chores). An older working Vercel
  deploy exists at `theframesandflorals.vercel.app`.

## Git

- `origin` → `github.com/allwynnewton/templates.floralsandframes.com-brendon-and-sarah` (primary)
- `old-origin` → `github.com/allwynnewton/TheFramesAndFlorals` (previous repo, kept)
- `main` tracks `origin/main`.

## Working preferences (the user)

- **Make changes locally, verify with a build, report — then WAIT.** Only
  `git push` when the user explicitly says "push". Never push proactively.
- Offer **options/opinions** before big changes.
- The in-app browser preview pane is often hidden (can't screenshot / rAF frozen,
  so the loader may not advance) — verify via DOM/console/HTTP and **be honest
  about what couldn't be visually confirmed**. The user reviews visuals on their
  own browser/phone.
- Deploy runs on port 3000 (`npm run dev`).

## Open TODOs

- **More photos to remove repeats:** Our Story needs 3 more (has 1 of 4);
  The Proposal needs 2 more (has 1 of 3). Drop files in `public/images/` and wire
  them into `photos` in `lib/site.ts`.
- (Bigger, later) Restructure into a showcase: gallery at `/` + a demo per slug
  route `/[slug]` (e.g. `/brendon-and-sarah`) served at
  `templates.floralsandframes.com`. Real paying clients get their own
  subdomain/domain — not a `/templates` path.

## Gotchas learned

- Lowercase all `public/` filenames (Hostinger/Linux is case-sensitive; an
  uppercase `.PNG` 404s in production).
- Purge the Hostinger CDN after each deploy.
- `git` on Windows warns about LF→CRLF — harmless.
