# Brendon & Maria — Florals & Frames

A fictional wedding invitation for Monday, 28 December 2026 in Goa. The redesigned page pairs a cinematic villa cover with an ivory, olive and watercolor floral invitation.

## Run locally

Requires a supported Node.js installation (Node 20.9+), npm, and network access for the existing Google font build step.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. For a production build:

```bash
npm run build
npm start
```

On the Windows verification host, Turbopack cannot launch its CSS worker (OS error 5). Use the supported fallback if affected:

```bash
npm run build -- --webpack
npm run dev -- --webpack
```

## Edit the template

- Names, wedding details, RSVP deadline, photos, scriptures, guest information, calendar helpers and creator links: `lib/site.ts`.
- Page composition: `components/Experience.tsx`.
- Page design: `components/experience.module.css`; shared resets and palette: `app/globals.css`.
- `app/page.tsx` retains the original music provider around the experience.
- Native RSVP dialog: `components/RSVPSection.tsx`. This is a **demo only**: no responses are sent or saved, and no backend is connected.
- Native church video controls and the music play/pause button only play after a visitor action.
- Asset prompts and provenance: `ASSET-NOTES.md`. Validation, screenshots and content decisions: `REVIEW.md`.

The original scene components remain unused for reference; historical instructions are in `CLAUDE-original.md`. Current project guidance is in `CLAUDE.md`.

## Before adapting for a real couple

Replace the visibly flagged accommodation and shuttle placeholders, and add confirmed guest contact information when adapting the demo. The Contact panel intentionally contains no email or phone number. Supplied celebration photos are illustrative; the generated cover couple differs from the supplied photographs. Keep confirmed venues and times centralized. RSVP storage requires a separate, explicitly requested integration.

Source repository: https://github.com/allwynnewton/templates.floralsandframes.com-brendon-and-maria-v1. Deployment is a separate step requiring explicit instruction. Existing Hostinger notes require a CDN purge after any future authorized deployment to avoid stale HTML pointing at old asset files.
