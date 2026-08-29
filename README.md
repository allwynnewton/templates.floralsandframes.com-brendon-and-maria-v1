# Brendon & Maria — A Cinematic Wedding Invitation

An interactive, scroll-driven Christian wedding film built as a single page.
The story runs: **darkness → the doors open → light → the couple → their story →
the promise → the sacrament → the celebration → forever.**

Built with **Next.js 16 (App Router)** · **React 19** · **TypeScript** ·
**Tailwind CSS** · **GSAP + ScrollTrigger + @gsap/react**.

## Run it

```bash
npm run dev
```

Then open http://localhost:3000. Production build:

```bash
npm run build && npm start
```

## Make it yours

- **All text, names, dates, verses, story milestones, venues** live in one file:
  [`lib/site.ts`](lib/site.ts). Edit there to re-brand the whole experience.
- **Palette & fonts** are in [`tailwind.config.ts`](tailwind.config.ts) and
  [`app/globals.css`](app/globals.css) (Cormorant Garamond · Inter · Pinyon Script).
- **Photography** — the site ships with cinematic self-contained placeholders so
  it looks finished immediately. Drop real photos into `public/images` and pass
  `src` to the `<Photo>` components. See [`public/images/README.md`](public/images/README.md).
- **RSVP** currently resolves to a graceful on-page confirmation. Wire the
  `handleSubmit` in [`components/RSVPSection.tsx`](components/RSVPSection.tsx) to
  an API route or a form service to collect responses.

## The 17 chapters

| #  | Section              | Component                  |
| -- | -------------------- | -------------------------- |
| 01 | The Church Doors     | `ChurchDoorHero`           |
| 02 | A Verse About Love   | `ScriptureIntro`           |
| 03 | God Wrote Our Story  | `OurStory`                 |
| 04 | Photo Parallax Story | `ParallaxMemories`         |
| 05 | The Proposal         | `ProposalSequence`         |
| 06 | Wedding Announcement | `WeddingAnnouncement`      |
| 07 | The Date             | `WeddingDate`              |
| 08 | Cinematic Church Film | `ChurchCinematicSection`  |
| 09 | Stained Glass Verse  | `StainedGlassVerse`        |
| 10 | Bride & Groom        | `BrideAndGroom`            |
| 11 | Our Memories         | `MemoryGallery`            |
| 12 | When Two Become One  | `CovenantSection`          |
| 13 | Reception            | `ReceptionSection`         |
| 14 | Countdown            | `WeddingCountdown`         |
| 15 | Wedding Details      | `WeddingDetails`           |
| 16 | RSVP                 | `RSVPSection`              |
| 17 | Final Blessing       | `FinalBlessing` + `Footer` |

## Soundtrack

One global `<audio>` lives in `components/audio/MusicProvider.tsx` (mounted above
everything in `app/page.tsx`), so it never restarts between sections or from
ScrollTriggers. There is **no autoplay with sound**: the opening `EntryGate`
offers *Enter with music ♪* / *Enter quietly*, and playback starts from that
click (mobile-safe), fading `0 → 0.4` over ~2.6s. A tiny persistent control
(`MusicToggle`, bottom-right) shows an animated waveform when playing and fades
out-then-pauses on tap (never a hard cut). `VolumeAutomation` gently ducks the
base volume by section via `data-music-vol` attributes (church swells to 0.48,
info sections drop to 0.30, final blessing to 0.25). The scroll-scrubbed church
video stays **muted** — the MP3 is the only sound.

- Track file: `public/audio/wedding-theme.mp3`. Change it, or the footer credit,
  in `lib/site.ts` (`music`). Ensure you hold the rights before publishing.

## Craft notes

- **One master timeline per cinematic scene**, attached to a single
  `ScrollTrigger` (the hero uses labelled stages: `silence · doorsOpen ·
  lightReveal · coupleReveal · names · announcement`).
- **`gsap.matchMedia()`** drives three variants everywhere: desktop, mobile
  (shorter pins, no mouse interactions), and a full **`prefers-reduced-motion`**
  fallback that renders each scene's resolved final state.
- Native vertical scrolling is preserved — no scroll-jacking. Animation is
  weighted and buttery (`power`/`expo` easings, scrub `0.6–1.2`).
- GSAP contexts are scoped via `useGSAP({ scope })` and auto-cleaned on unmount.
- **The cinematic church film** (`ChurchCinematicSection`) scrubs `video.currentTime`
  from scroll via a GSAP proxy (no React state per frame), gated on `loadedmetadata`,
  and folds in the former standalone church section's identity + "View Location" so
  there is no duplicate church info. Re-encode the clip for smooth seeking — see
  [`public/videos/README.md`](public/videos/README.md).
