# Redesign delivery — 12 September 2026

## Latest Scripture scroll moment

Implemented `ScriptureApproach.tsx` between milestones and Celebration. The optimized supplied church image opens through an architectural arch, with a 6.5% forward push on desktop and 3% on mobile. One scroll-scrubbed timeline runs from the section top at 90% to 5% of the viewport (85% viewport travel), with no pinning. Reverse scrolling reverses the frame and image. Cross and text positions remain stable; the entire unchanged Corinthians passage reaches full opacity together early in the scene.

Verification: Webpack production build and TypeScript passed; mechanical detector returned no findings. Native browser review at 1440×1000 and 390×844 verified forward and reverse transforms, complete image loading, unchanged text, zero pin spacers, no horizontal overflow and no console warnings/errors. Desktop scale progressed through 1.0353 to 1.065 and reversed to 1.0353 at the same scroll position; mobile progressed to 1.03 and reversed to 1.0154. Cross transform remained none; passage opacity remained 1 during reading. Desktop section height was 625px; mobile approximately 621px.

Reduced-motion verification limit: the native browser exposes no media-preference override. A bounded component check executes the actual matchMedia callback with dependency stubs: reduced motion creates no timeline, desktop/mobile select their correct settings, and cleanup invokes matchMedia.revert. Static CSS/HTML remain fully visible without animation. This is code-path verification, not browser reduced-motion emulation or a physical-device test.

Evidence: `verification/scripture-desktop.png`, `scripture-mobile.png`, `scripture-motion-checks.json`. The image is visibly labeled illustrative; its venue was not authenticated. No hero, event, navigation, RSVP, music or other feature behavior was changed by this update.

## Latest browser feedback changes

- Replaced the Our Story wedding-attire photograph with a generated watercolor illustration of a couple in casual clothing walking through a Goan garden. Asset: `public/images/story-watercolor.webp`; prompt in `ASSET-NOTES.md`.
- Replaced the days-only sentence with a live days/hours/minutes/seconds countdown. Values derive from the configured wedding instant, update once per second without making the entire page rerender, and stop at zero with “Our forever has begun.” Screen readers are not interrupted on each tick.
- Follow-up production build passed with `--webpack`. Chrome checks passed at 1440, 768 and 390px, including image loading, overflow, live ticking, controlled-clock date arithmetic and expiry. Mechanical design check returned no findings.
- Latest section screenshots: `verification/story-1440.png`, `story-768.png`, `story-390.png`, and corresponding `countdown-*.png`. `verification/refinements.json` records these checks. Earlier full-page screenshots below document the original redesign before these two refinements.

## Completed

The original ZIP was the starting point. Next.js App Router, React, TypeScript, Tailwind, GSAP and the music provider remain. Both `package.json` and `package-lock.json` are byte-for-byte unchanged from the archive.

The active page now has an immediately visible cinematic villa photograph, ivory/olive/sage styling, watercolor white florals, responsive navigation, date/calendar strip, editorial story, four staggered milestones, scripture, compact celebration cards and church video, five-image gallery, guest accordions, accessible demo RSVP, countdown, footer and music control. Old scene files remain unused for reference.

Monday 28 December 2026 is corrected. Ceremony remains Our Lady of Grace Church, 4:00 PM. Reception remains Quinta de Valadares, 7:30 PM onwards. RSVP deadline remains 1 December 2026. Configuration remains in `lib/site.ts`.

## Verification results

- **Production build passed:** `npm run build -- --webpack`, including TypeScript and all seven generated pages. Default Turbopack build fails on this Windows host while spawning its CSS worker (OS error 5). The supported Webpack fallback is documented; source architecture and dependencies were not changed to work around it.
- **Production browser tested:** installed Chrome in headless mode against `next start`, at 1440×1000, 768×1000 and 390×844.
- Document scroll width exactly matched each viewport. No broken images and no JavaScript page errors. Desktop, tablet and mobile screenshots were visually inspected. Hero text is clear of faces, with a deliberate lower mobile text placement.
- Mobile menu opens/closes, closes with Escape, restores button focus and navigates to Celebration.
- Google Calendar URL contains 28 December 2026, 10:30–17:30 UTC (4:00–11:00 PM IST), both venues and the existing times. Downloaded ICS verified for event date/time and venue; CRLF output and 75-octet Unicode-safe folding implemented.
- RSVP rejects empty required fields and more than 10 guests; ceremony/reception choices and dietary notes work. Repeated Tab navigation stays within the dialog, Escape closes it, and focus returns to RSVP. Result explicitly says no RSVP was submitted, sent or saved.
- Audio begins paused. Clicking Music starts playback and advances the actual media time; Pause stops it. No automatic music starts on page entry.
- Church film plays inline with native controls; closing its accordion pauses it.
- Reduced-motion emulation clears hero transforms and disables smooth scrolling. GSAP matchMedia/context cleanup is implemented.
- Venue and creator link targets inspected against configuration; WhatsApp message uses Brendon and Maria. No enquiry was sent.

Screenshots and machine-readable results are in `verification/` in the delivered archive, including `desktop-1440.png`, `desktop-768.png`, `desktop-390.png`, `hero-390.png`, `rsvp-mobile.png`, `results.json`, and the downloaded `wedding.ics`.

## Remaining content decisions

- Accommodation: The Heritage Resort, preferred guest rates and name-based booking instructions are original demo placeholders.
- Transportation: resort-to-church shuttle, 3:15 PM departure and return service are original demo placeholders.
- Contact clarification completed: the mismatched email and dummy phone number were removed. The panel uses the configured couple names and states that guest contact details are not included in this demo.
- The generated hero uses a fictional couple; their appearance differs from the supplied story/gallery photographs. The church interior and reception cake are illustrative supplied photographs, not verified photographs of the named venues.
- Supplied soundtrack retained. Its publication rights were not verified.

## Limits and delivery boundaries

Responsive Chrome viewport testing is not testing on a physical Android phone. Apple Calendar/Outlook were not opened; the actual downloaded event was inspected. Audio playback was verified through media state/time, not a listening review. External map/creator destinations were preserved and checked as link targets, not independently authenticated as venue or business information. The RSVP has no backend by design.

Nothing was pushed, published or deployed. For a later authorized Hostinger deployment, follow the existing CDN-purge notes in `CLAUDE.md`.
