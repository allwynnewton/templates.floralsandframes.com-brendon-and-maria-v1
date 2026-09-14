'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { couple, wedding } from '@/lib/site';

/**
 * CINEMATIC CHURCH VIDEO SEQUENCE
 * -------------------------------
 * A full-screen, scroll-scrubbed church film. Scroll position drives the
 * video's currentTime (forward AND reverse) via a GSAP proxy — never React
 * state per frame. One master timeline owns the video scrub AND the seven
 * typographic stages, pinned on a single ScrollTrigger.
 *
 * Stages: sacrament · gratitude · silence · couple · date · church · exit
 *
 * Reuses existing site data (couple/wedding) and typography (font-display,
 * eyebrow, champagne/ivory tokens). Merges the former ChurchSection's church
 * identity + "View Location" so there is no duplicate church information.
 */

// A soft warm poster so the section is never a blank frame pre-load.
const POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='18'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23f4ede3'/%3E%3Cstop offset='0.6' stop-color='%23e6d8c8'/%3E%3Cstop offset='1' stop-color='%23d8c6b8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='18' fill='url(%23g)'/%3E%3C/svg%3E";

export default function ChurchCinematicSection() {
  const root = useRef<HTMLElement>(null);
  const sticky = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const v = video.current;
      const q = gsap.utils.selector(root);
      let mm: ReturnType<typeof gsap.matchMedia> | null = null;

      // Hide the stage overlays immediately, before the (video-metadata-gated)
      // timeline builds — on mobile, video preload can lag, and without this the
      // overlays would briefly render stacked on top of each other.
      gsap.set(
        q(
          '[data-sacrament],[data-gratitude],[data-groom],[data-amp],[data-bride],[data-date],[data-church],[data-wash]',
        ),
        { autoAlpha: 0 },
      );

      // proxy the scrub target so we NEVER touch React state per frame
      const proxy = { time: 0 };
      const applyTime = () => {
        const el = video.current;
        if (!el || el.readyState < 1) return;
        // skip sub-frame updates to avoid hammering the decoder
        if (Math.abs(el.currentTime - proxy.time) > 1 / 30) {
          el.currentTime = proxy.time;
        }
      };

      const build = () => {
        const el = video.current;
        if (!el) return;
        const dur = el.duration || 1;
        el.pause();

        mm = gsap.matchMedia();

        // ---------- REDUCED MOTION: a still, elegant composition ----------
        mm.add('(prefers-reduced-motion: reduce)', () => {
          if (sticky.current) {
            sticky.current.style.position = 'relative';
            sticky.current.style.height = '112vh';
          }
          // rest on a representative frame
          proxy.time = dur * 0.5;
          applyTime();
          el.addEventListener('seeked', applyTime, { once: true });
          gsap.set(q('[data-video]'), { autoAlpha: 1 });
          gsap.set(q('[data-stage-layer]'), { display: 'none' });
          gsap.set(q('[data-static]'), { display: 'flex', autoAlpha: 1 });
          gsap.set(q('[data-goldline]'), { scaleX: 1 });
        });

        // ---------- ANIMATED (desktop + mobile) ----------
        mm.add(
          {
            isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
            isMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
          },
          (ctx) => {
            const { isDesktop } = ctx.conditions as { isDesktop: boolean };
            const distance = isDesktop ? '+=520%' : '+=320%';
            const shift = isDesktop ? 40 : 22; // subtle horizontal drift for names

            gsap.set(q('[data-static]'), { display: 'none' });

            // initial states
            gsap.set(q('[data-sacrament]'), { autoAlpha: 0, y: 30, letterSpacing: '0.12em' });
            gsap.set(q('[data-gratitude]'), { autoAlpha: 0, y: 24 });
            gsap.set(q('[data-groom]'), { autoAlpha: 0, x: -shift });
            gsap.set(q('[data-amp]'), { autoAlpha: 0 });
            gsap.set(q('[data-bride]'), { autoAlpha: 0, x: shift });
            gsap.set(q('[data-date]'), { autoAlpha: 0, y: 24 });
            gsap.set(q('[data-church]'), { autoAlpha: 0, y: 24 });
            gsap.set(q('[data-goldline]'), { scaleX: 0, transformOrigin: 'center' });
            gsap.set(q('[data-wash]'), { autoAlpha: 0 });

            const tl = gsap.timeline({
              defaults: { ease: 'power2.out' },
              scrollTrigger: {
                trigger: root.current,
                start: 'top top',
                end: distance,
                pin: sticky.current,
                scrub: isDesktop ? 1.1 : 0.8,
                anticipatePin: 1,
              },
            });

            // ---- VIDEO SCRUB (spans the whole timeline, decelerating at the end) ----
            // main pass: 0 -> ~92% of the clip, linear (0 -> 88 on the 0..100 line)
            tl.to(proxy, { time: dur * 0.92, duration: 88, ease: 'none', onUpdate: applyTime }, 0);
            // tail: last 8% eases to a near-stop -> "film becomes photograph"
            tl.to(proxy, { time: dur, duration: 12, ease: 'power3.out', onUpdate: applyTime }, 88);

            // extremely subtle push-in, only over the first stage
            if (isDesktop) {
              tl.fromTo(
                q('[data-video]'),
                { scale: 1.03 },
                { scale: 1, duration: 16, ease: 'power1.out' },
                0,
              );
            }

            // ---- STAGE 1 — SACRAMENT (0–15) ----
            tl.addLabel('sacrament', 0)
              .to(
                q('[data-sacrament]'),
                { autoAlpha: 1, y: 0, letterSpacing: '0.04em', duration: 11 },
                1,
              )
              .to(
                q('[data-sacrament]'),
                { autoAlpha: 0, y: -18, duration: 3, ease: 'power2.in' },
                12.5,
              );

            // ---- STAGE 2 — GRATITUDE (15–30), with a breath of silence first ----
            tl.addLabel('gratitude', 18)
              .to(q('[data-gratitude]'), { autoAlpha: 1, y: 0, duration: 8 }, 18)
              .to(
                q('[data-gratitude]'),
                { autoAlpha: 0, y: -14, duration: 3, ease: 'power2.in' },
                28,
              );

            // ---- STAGE 3 — SILENCE (30–47): nothing. The footage carries it. ----
            tl.addLabel('silence', 30);

            // ---- STAGE 4 — COUPLE NAMES (47–67) ----
            tl.addLabel('couple', 47)
              .to(q('[data-groom]'), { autoAlpha: 1, x: 0, duration: 9, ease: 'power3.out' }, 47)
              .to(q('[data-amp]'), { autoAlpha: 1, duration: 7 }, 50)
              .to(q('[data-bride]'), { autoAlpha: 1, x: 0, duration: 9, ease: 'power3.out' }, 51);

            // ---- STAGE 5 — DATE (67–82) ----
            tl.addLabel('date', 67)
              .to(q('[data-names]'), { y: isDesktop ? -50 : -34, autoAlpha: 0.85, duration: 6 }, 67)
              .to(q('[data-date]'), { autoAlpha: 1, y: 0, duration: 8 }, 69);

            // ---- STAGE 6 — CHURCH IDENTITY (82–94) ----
            tl.addLabel('church', 82)
              .to(
                [q('[data-names]'), q('[data-date]')],
                { autoAlpha: 0, y: -24, duration: 3, ease: 'power2.in' },
                82,
              )
              .to(q('[data-church]'), { autoAlpha: 1, y: 0, duration: 7 }, 84)
              .to(q('[data-goldline]'), { scaleX: 1, duration: 5, ease: 'power2.inOut' }, 88);

            // ---- STAGE 7 — FILM → PHOTOGRAPH → PAPER (94–100) ----
            tl.addLabel('exit', 94)
              .to(q('[data-wash]'), { autoAlpha: 1, duration: 6, ease: 'power2.inOut' }, 94)
              // hand off the church text just as ivory fills, so the next chapter emerges clean
              .to(q('[data-church]'), { autoAlpha: 0, duration: 3, ease: 'power1.in' }, 97);
          },
        );

        ScrollTrigger.refresh();
      };

      // prime the decoder on mobile Safari (muted, invisible) so seeking works
      const prime = () => {
        const el = video.current;
        if (!el) return;
        const p = el.play();
        if (p && typeof p.then === 'function') {
          p.then(() => el.pause()).catch(() => {});
        }
        // fade the footage in once there are frames to show
        gsap.to(q('[data-video]'), { autoAlpha: 1, duration: 0.9, ease: 'power2.out' });
      };

      const onMeta = () => {
        prime();
        build();
      };

      if (v && v.readyState >= 1) {
        onMeta();
      } else {
        v?.addEventListener('loadedmetadata', onMeta, { once: true });
        // Nudge mobile browsers (which often defer video) to fetch metadata.
        try {
          v?.load();
        } catch {
          /* ignore */
        }
      }

      return () => {
        v?.removeEventListener('loadedmetadata', onMeta);
        mm?.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="church-cinematic relative bg-mist" data-music-vol="0.48">
      <div
        ref={sticky}
        className="church-cinematic-sticky relative h-[100svh] w-full overflow-hidden bg-mist"
      >
        {/* ---- The church film ---- */}
        <video
          ref={video}
          data-video
          className="cinematic-video absolute inset-0 h-full w-full opacity-0"
          poster={POSTER}
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/church-cinematic.mp4" type="video/mp4" />
          {/* Add a lighter portrait encode here to serve mobile better:
          <source media="(max-width: 768px)" src="/videos/church-cinematic-mobile.mp4" type="video/mp4" /> */}
        </video>

        {/* ---- Overlay: keep it luminous, not gloomy ---- */}
        <div
          className="cinematic-overlay pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.38), rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.48))',
          }}
        />
        {/* ---- Subtle vignette ---- */}
        <div
          className="cinematic-vignette pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 220px 60px rgba(0,0,0,0.5)' }}
        />
        {/* ---- Very low film grain ---- */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: 0.03,
            mixBlendMode: 'overlay',
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
          aria-hidden
        />

        {/* ---- Ivory wash that carries into the next chapter ---- */}
        <div
          data-wash
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(130% 110% at 50% 100%, #fbf4f2 0%, #fbf4f2 58%, rgba(251,244,242,0.85) 100%)',
          }}
          aria-hidden
        />

        {/* ==================== ANIMATED STAGES ==================== */}
        <div
          data-stage-layer
          className="cinematic-content pointer-events-none absolute inset-0 text-ivory"
        >
          {/* S1 — Sacrament (centre) */}
          <div
            data-sacrament
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center"
          >
            <p className="eyebrow text-ivory/80">The Sacrament of</p>
            <h2
              className="font-display mt-3 uppercase leading-none text-ivory"
              style={{ fontSize: 'clamp(2.6rem, 7vw, 6rem)' }}
            >
              Holy Matrimony
            </h2>
          </div>

          {/* S2 — Gratitude (lower centre) */}
          <div data-gratitude className="absolute inset-x-0 bottom-[16%] px-6 text-center">
            <p className="eyebrow text-ivory/85">With gratitude to God</p>
            <p className="eyebrow mt-2 text-ivory/85">and joy in our hearts</p>
          </div>

          {/* S4/S5 — Names + Date (centre) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div data-names className="flex flex-col items-center">
              <h2
                data-groom
                className="font-display uppercase leading-[0.9] text-ivory"
                style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
              >
                {couple.groom}
              </h2>
              <span
                data-amp
                className="font-script my-1 text-rose"
                style={{ fontSize: 'clamp(2rem,5vw,4rem)' }}
              >
                &amp;
              </span>
              <h2
                data-bride
                className="font-display uppercase leading-[0.9] text-ivory"
                style={{ fontSize: 'clamp(4rem, 10vw, 9rem)' }}
              >
                {couple.bride}
              </h2>
            </div>

            <div data-date className="mt-10 flex flex-col items-center gap-3">
              <p
                className="font-display tracking-wide text-rose"
                style={{ fontSize: 'clamp(1.6rem,4vw,3rem)' }}
              >
                {wedding.dateLabel}
              </p>
              <p className="eyebrow text-ivory/80">
                {wedding.day} · {wedding.time}
              </p>
            </div>
          </div>

          {/* S6 — Church identity (lower centre) */}
          <div
            data-church
            className="pointer-events-auto absolute inset-x-0 bottom-[14%] flex flex-col items-center px-6 text-center"
          >
            <p className="eyebrow text-ivory/80">The Ceremony</p>
            <h2
              className="font-display mt-3 leading-tight text-ivory"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
            >
              {wedding.ceremony.venue}
            </h2>
            <span
              data-goldline
              className="mt-5 block h-px w-24 bg-gradient-to-r from-transparent via-rose to-transparent"
            />
            <p className="mt-5 eyebrow text-ivory/75">{wedding.ceremony.place}</p>
            <a
              href={wedding.ceremony.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-8 text-ivory"
            >
              View Location
            </a>
          </div>
        </div>

        {/* ==================== REDUCED-MOTION STATIC ==================== */}
        <div
          data-static
          style={{ display: 'none' }}
          className="absolute inset-0 flex-col items-center justify-center gap-6 px-6 text-center text-ivory"
        >
          <p className="eyebrow text-ivory/80">The Sacrament of Holy Matrimony</p>
          <h2
            className="font-display uppercase leading-[0.9]"
            style={{ fontSize: 'clamp(3rem, 9vw, 6rem)' }}
          >
            {couple.groom} &amp; {couple.bride}
          </h2>
          <p className="font-display text-rose" style={{ fontSize: 'clamp(1.4rem,4vw,2.4rem)' }}>
            {wedding.dateLabel}
          </p>
          <p className="eyebrow text-ivory/80">
            {wedding.day} · {wedding.time}
          </p>
          <div className="mt-2 flex flex-col items-center gap-3">
            <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem,5vw,3rem)' }}>
              {wedding.ceremony.venue}
            </h3>
            <span
              data-goldline
              className="block h-px w-24 bg-gradient-to-r from-transparent via-rose to-transparent"
            />
            <p className="eyebrow text-ivory/75">{wedding.ceremony.place}</p>
            <a
              href={wedding.ceremony.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost mt-4 text-ivory"
            >
              View Location
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
