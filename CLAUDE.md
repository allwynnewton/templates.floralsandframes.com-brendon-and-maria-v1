# Brendon & Maria — Florals & Frames wedding template

## Scope and boundaries
This project is the fictional wedding invitation demo at templates.floralsandframes.com. The marketing website at floralsandframes.com is separate. Work locally; do not push, publish or deploy without explicit user instruction. The September 2026 redesign direction is approved: cinematic villa cover followed by soft ivory, watercolor white florals, olive/sage and muted gold. Do not restore a blocking loader, entry gate, pinned arch or scroll hijacking.

## Stack and active structure
- Preserve Next.js 16 App Router, React 19, TypeScript, Tailwind v3, GSAP, @gsap/react and the npm lockfile.
- `app/page.tsx` → `MusicProvider` → `components/Experience.tsx`.
- `Experience.tsx` composes navigation, immediate cover, calendar strip, story, milestones, scripture, celebration with expandable church film, gallery, guest accordions, RSVP, footer and music toggle.
- `components/experience.module.css` owns the active design and responsive layout. `app/globals.css` contains shared resets, tokens, focus styles and reduced-motion handling.
- `components/RSVPSection.tsx` uses a native modal dialog with required-field validation, attendance choices, guest count and dietary notes. It has NO backend and must clearly say responses are not sent or saved. Native Escape, focus restoration, inert background and explicit Tab wrapping support keyboard use.
- `components/AddToCalendar.tsx` preserves Google Calendar and downloads `.ics`; `lib/site.ts` builds both from the same configured wedding event. ICS folds at 75 UTF-8 octets.
- `lib/site.ts` remains the content source: Brendon & Maria, MONDAY 28 December 2026, Goa; ceremony Our Lady of Grace Church at 4:00 PM; reception Quinta de Valadares at 7:30 PM onwards; RSVP deadline 1 December 2026.
- Music only starts after pressing the persistent control. The original provider/soundtrack remain; pending volume fades clean up on unmount.
- Church video uses ordinary native playback controls, no autoplay or scroll scrubbing; closing its disclosure pauses playback. The supplied film has no audio.
- GSAP has transform-only entrances and a small hero parallax. MatchMedia disables motion with `prefers-reduced-motion`; contexts revert on unmount. No content starts invisible.
- Scripture now mounts `ScriptureApproach.tsx` with its own CSS module: one unpinned GSAP scrub over 85% of viewport travel, architectural clip-path widening, 6.5% desktop image push / 3% mobile push, minimal vertical parallax. The cross and complete Corinthians passage do not move. Reduced motion uses the fully open static arch and no timeline. Supplied `3.jpg` was compressed to `church-aisle.webp` (202,864 bytes); venue is unverified and visibly captioned illustrative. Other sections remain unchanged.
- Fonts remain Cormorant Garamond, Inter and Pinyon Script through `next/font/google`. Builds need Google Fonts access. Metadata targets the template subdomain.

## Assets and review decisions
- `public/images/hero-villa.webp`: generated cinematic cover, 1672×941, about 251 KiB; desktop negative space on left, couple on right; mobile crops at 72% and places text below faces.
- `public/images/floral-corner.webp`: generated transparent watercolor flowers, 900×946, about 272 KiB. Prompts and provenance: `ASSET-NOTES.md`.
- Our Story now uses `public/images/story-watercolor.webp`: an abstract watercolor couple in everyday clothing, replacing the wedding-attire portrait after user feedback.
- `components/WeddingTimer.tsx` displays days, hours, minutes and seconds from `wedding.dateISO`, updates once per second, cleans up its timer, and clamps at zero. Its timer region does not announce every tick to screen readers.
- Existing supplied photos retained. Dedicated intro, four milestones and five gallery photos avoid repetition. Church/reception photographs are illustrative, not verified photographs of the configured venues.
- Existing accommodation (The Heritage Resort/preferred rates) and shuttle details (3:15 PM) remain visibly flagged demo placeholders. Contact now uses the configured couple names and explicitly says guest contact details are not included in the demo; no invented email or phone number is displayed.
- Soundtrack is the supplied “You're Still The One” acoustic cover; publication rights were not verified.
- All final asset filenames must stay lowercase for Linux hosting.

## Retained legacy code
Old scene files remain for reference and rollback; they are not mounted. `LegacyExperience.tsx` and `legacy-globals.css` preserve the original composition/styles; `CLAUDE-original.md` preserves historical notes. Restoring the old experience would also require restoring its original shared RSVP/calendar/music-control components from the supplied archive.

## Verification and local commands
Use `npm ci`, `npm run dev`, `npm run build`. On this Windows host Turbopack failed to spawn its CSS worker with OS error 5 even outside the sandbox. `npm run build -- --webpack` is the verified supported production build fallback; `npm run dev -- --webpack` is the local preview fallback. No dependency or lockfile changes were required. See `REVIEW.md` for actual browser/build results and limitations.

## Hosting notes for later authorized deployment
Existing hosting is Hostinger. Historical notes diagnosed CDN over-caching of HTML (`s-maxage=31536000`), causing stale HTML to reference deleted JS/CSS chunks. After a future authorized deployment, purge the Hostinger CDN cache and verify a cold page load. Do not change hosting providers or deploy as part of this redesign. Historical git remotes and earlier plans remain in `CLAUDE-original.md`.

<!-- BEGIN:nextjs-agent-rules -->
## Installed Next.js documentation
Consult relevant guides in `node_modules/next/dist/docs/` before framework changes; this installed version may differ from older conventions. This marker is maintained by `next dev`.
<!-- END:nextjs-agent-rules -->
