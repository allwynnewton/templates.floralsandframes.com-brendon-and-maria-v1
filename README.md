# Brendon & Maria — The Promise Edition

A complete Next.js wedding invitation with GSAP scroll storytelling, a Three.js ring intro, and local photography, video and audio.

## Run locally

Use Node.js 20.9+ (Node 22 or 24 recommended).

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

```bash
npm run typecheck
npm run build
npm start
```

The production build uses Next.js. Upload this project as a Node.js application on your hosting provider; do not upload just `app/` or `.next/` as a static website. The ZIP excludes `node_modules` and generated build output.

## What changed

- Automatic Three.js GLB rotation and camera fly-through, with a skip link and a timeout/WebGL fallback.
- Pinned church video, scrubbed by scroll, resolving into the arched couple-photo invitation. The opening replaces the old floral gateway and the duplicate church-film section.
- Music playback attempted on load; a small Enable music button appears when the browser blocks audible playback. A visitor's explicit pause is respected for the session.
- Golden pixel dust around the scripture, with a pointer trail and a brief entrance sweep. Animation pauses offscreen and is removed for reduced motion.
- A sticky photographic story timeline on desktop, with masked image transitions; vertical illustrated chapters on mobile.
- Two expanding photographic chapter reveals and a carefully framed proposal pair.
- One complete date reveal, with functional Google/Apple/Outlook calendar actions. The weekday is corrected to Monday, 28 December 2026.
- The Ruth verse and bride/groom portraits combined into one section.
- Compact photo gallery, ceremony and reception cards, practical guest notes and countdown.
- Refined RSVP stationery, one closing message, and a compact Florals & Frames footer. Repeated announcement, standalone covenant, huge footer and floating sales CTA are removed from the active page.
- Champagne gold, ivory and dusty rose; Great Vibes calligraphy and Cormorant Garamond serif typography.

## Edit content and assets

`lib/site.ts` contains the couple names, venues, date, photo paths, music and brand contact. The existing venue and practical guest information have been retained from the uploaded source. Verify the venue names, directions, accommodation and shuttle details before sharing with guests.

The visible date composition is in `components/WeddingDate.tsx`; the photo invitation is in `components/OpeningSequence.tsx`. Their visual wording intentionally spells out December. Update these when changing the wedding date.

- Ring: `public/models/wedding-ring.glb`
- Film: `public/videos/church-cinematic.mp4`
- Film poster: `public/images/church-poster.jpg`
- Music: `public/audio/wedding-theme.mp3`
- Main photo: `public/images/1.jpg`
- Styling: `app/globals.css`

`OpeningSequence.tsx` owns pinning and video timing. `RingPortal.tsx` owns the 3D opening. Scroll distance is approximately 3 viewport heights on mobile and 3.6 on desktop. Seeking is serialized to avoid overwhelming the video decoder. For future replacement films, use an MP4 with frequent keyframes for responsive scrubbing.

## RSVP

The original form only displayed a success message and did not send or store replies. This version does not claim a reply was sent without a successful response.

By default the form downloads `wedding-rsvp.txt`, and asks the guest to share it with the couple. To send replies directly, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_RSVP_ENDPOINT` to your form endpoint. It must allow your site origin, accept a JSON POST and return a 2xx response after accepting a reply. Submitted fields: `Name`, `Reply`, `Guests`, `Events`, `Note`. No database or server credentials are included. Public environment variables must never contain secret keys. Rebuild after changing this variable.

## Asset credits

The supplied GLB embeds the following metadata:

- Title: **3D Ring**
- Author: **EmmaTurk** — https://sketchfab.com/EmmaTurk
- Source: https://sketchfab.com/3d-models/3d-ring-9065f8f0023043718360f8ccef7339c9
- License: **CC BY-NC-SA 4.0** — https://creativecommons.org/licenses/by-nc-sa/4.0/

The file is included unchanged. The website applies different materials, lighting, orientation and motion at runtime. Credit is also available in the footer. The embedded license is noncommercial: for your commercial template business, obtain permission or replace it with a model licensed for that use. The loader path makes replacement straightforward, but a differently oriented model may require adjusting its alignment and camera path.

Music credit is retained from the source: “You're Still The One” — Boyce Avenue ft. Connie Talbot (acoustic cover). Photos, footage and soundtrack are the supplied project assets; their rights are not changed by this update.

## Accessibility and behavior

Keyboard-accessible controls, visible focus, labelled form fields, meaningful photo descriptions, native page scrolling and `prefers-reduced-motion` variants are included. Reduced motion skips the ring and video scrub and shows the final invitation. On devices without WebGL, the film remains accessible. Audible autoplay depends on the visitor's browser policy; the site cannot force it.
