'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { couple, wedding, photos } from '@/lib/site';

/**
 * SECTION 01 — THE CHURCH DOORS
 * The signature opening. One master timeline on one ScrollTrigger, pinned.
 * Labelled stages: silence · doorsOpen · lightReveal · coupleReveal · names · announcement
 */
export default function ChurchDoorHero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      const q = gsap.utils.selector(root);
      const leftDoor = q('[data-door="left"]');
      const rightDoor = q('[data-door="right"]');
      const light = q('[data-light]');
      const beam = q('[data-beam]');
      const couplePhoto = q('[data-couple]');
      const names = q('[data-names]');
      const nameLetters = q('[data-name-line]');
      const above = q('[data-above]');
      const below = q('[data-below]');
      const announce = q('[data-announce]');
      const cue = q('[data-cue]');
      const arch = q('[data-arch]');
      const heroScrim = q('[data-hero-scrim]');

      // ---------- REDUCED MOTION: show the resolved final frame ----------
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([leftDoor, rightDoor, cue, arch], { autoAlpha: 0 });
        gsap.set([light, couplePhoto, names, above, below, heroScrim], { autoAlpha: 1 });
        gsap.set(couplePhoto, { filter: 'blur(0px)', scale: 1 });
        gsap.set(announce, { autoAlpha: 1, y: 0 });
        gsap.set(names, { y: -40 });
      });

      // ---------- ANIMATED (desktop + mobile) ----------
      mm.add(
        {
          isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
          isMobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { isDesktop } = ctx.conditions as { isDesktop: boolean };

          // Desktop 480vh of travel; mobile a lighter 300vh.
          const distance = isDesktop ? '+=480%' : '+=300%';
          const doorAngle = isDesktop ? 108 : 88;

          // ----- initial states -----
          gsap.set(stage.current, { transformPerspective: 1600 });
          gsap.set(leftDoor, { transformOrigin: 'left center', rotateY: 0 });
          gsap.set(rightDoor, { transformOrigin: 'right center', rotateY: 0 });
          gsap.set(light, { autoAlpha: 0, scale: 0.6 });
          gsap.set(beam, { autoAlpha: 0, scaleY: 0.4 });
          gsap.set(couplePhoto, { autoAlpha: 0, scale: 1.08, filter: 'blur(14px)' });
          gsap.set(heroScrim, { autoAlpha: 0 });
          gsap.set(above, { autoAlpha: 0, y: 12 });
          gsap.set(below, { autoAlpha: 0, y: 12 });
          gsap.set(nameLetters, { autoAlpha: 0, y: 24, letterSpacing: '0.18em' });
          gsap.set(announce, { autoAlpha: 0, y: 26 });

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: stage.current,
              start: 'top top',
              end: distance,
              pin: true,
              scrub: isDesktop ? 1 : 0.8,
              anticipatePin: 1,
            },
          });

          // STAGE 1 — Silence (0 → 1)
          tl.addLabel('silence', 0)
            .to(stage.current, { scale: 1.04, duration: 1, ease: 'power1.out' }, 0)
            .to('[data-vignette]', { opacity: 0.5, duration: 1 }, 0)
            .to(cue, { autoAlpha: 0, duration: 0.6 }, 0.4);

          // STAGE 2 — Doors begin opening (1 → 3.5)
          tl.addLabel('doorsOpen', 1)
            .to(leftDoor, { rotateY: -doorAngle, duration: 2.5, ease: 'power2.inOut' }, 1)
            .to(rightDoor, { rotateY: doorAngle, duration: 2.5, ease: 'power2.inOut' }, 1)
            .to(light, { autoAlpha: 0.7, scale: 0.9, duration: 2 }, 1.4);

          // STAGE 3 — Light enters (3.5 → 5)
          tl.addLabel('lightReveal', 3.5)
            .to(light, { autoAlpha: 1, scale: 1.15, duration: 1.5, ease: 'power2.out' }, 3.5)
            .to(beam, { autoAlpha: 0.55, scaleY: 1, duration: 1.5, ease: 'power2.out' }, 3.5)
            .to([leftDoor, rightDoor], { autoAlpha: 0.15, duration: 1.4 }, 3.6);

          // STAGE 4 — Couple emerges (5 → 7)
          tl.addLabel('coupleReveal', 5)
            .to(
              couplePhoto,
              { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
              5,
            )
            .to(heroScrim, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, 5)
            .to(beam, { autoAlpha: 0.2, duration: 1.4 }, 5.6);

          // STAGE 5 — Names (7 → 8.6)
          tl.addLabel('names', 7)
            .to(above, { autoAlpha: 1, y: 0, duration: 0.9 }, 7)
            .to(
              nameLetters,
              {
                autoAlpha: 1,
                y: 0,
                letterSpacing: '0.03em',
                duration: 1.4,
                ease: 'power3.out',
                stagger: 0.2,
              },
              7.1,
            )
            .to(below, { autoAlpha: 1, y: 0, duration: 0.9 }, 7.9);

          // STAGE 6 — Announcement (8.6 → 10)
          tl.addLabel('announcement', 8.6)
            .to([above, names, below], { y: -46, duration: 1.4, ease: 'power2.inOut' }, 8.6)
            .to(announce, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 8.9)
            .to(couplePhoto, { scale: 1.06, duration: 1.4, ease: 'power1.inOut' }, 8.6);

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      return () => {
        mm.revert();
        ScrollTrigger.refresh();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-blush" aria-label="Welcome">
      <div
        ref={stage}
        className="relative h-[100svh] w-full overflow-hidden bg-blush"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ---- Warm light behind the doors (revealed as they open) ---- */}
        <div
          data-light
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(40% 48% at 50% 46%, rgba(255,253,251,0.98) 0%, rgba(247,228,231,0.6) 32%, rgba(217,139,152,0.14) 56%, transparent 74%)',
            filter: 'blur(6px)',
          }}
        />
        {/* volumetric beam through the doorway */}
        <div
          data-beam
          className="pointer-events-none absolute left-1/2 top-[-10%] h-[120%] w-[46%] -translate-x-1/2 origin-top"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,253,251,0.6) 0%, rgba(247,228,231,0.28) 40%, transparent 85%)',
            filter: 'blur(26px)',
          }}
        />

        {/* ---- The couple, framed inside the bright doorway ---- */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-couple
            className="relative h-[74%] w-[62%] max-w-[560px] overflow-hidden rounded-[2px]"
            style={{ boxShadow: '0 40px 110px -34px rgba(120,95,100,0.4)' }}
          >
            <Photo
              src={photos.hero}
              alt={`${couple.groom} and ${couple.bride} standing together in warm light`}
              tone="champagne"
              label="hero · couple"
              priority
              seed={7}
              style={{ position: 'absolute', inset: 0 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blush/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* ---- Architectural arch frame (thin, stone) ---- */}
        <svg
          data-arch
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <path
            d="M18 100 L18 40 Q18 12 50 8 Q82 12 82 40 L82 100"
            fill="none"
            stroke="rgba(217,139,152,0.30)"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* ---- The two doors ---- */}
        <div className="absolute inset-0 flex" style={{ transformStyle: 'preserve-3d' }}>
          <div data-door="left" className="relative h-full w-1/2">
            <DoorFace side="left" />
          </div>
          <div data-door="right" className="relative h-full w-1/2">
            <DoorFace side="right" />
          </div>
        </div>

        {/* ---- Vignette ---- */}
        <div
          data-vignette
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 220px 80px rgba(150,128,132,0.28)', opacity: 0.6 }}
        />

        {/* ---- Soft scrim behind the hero text, so light type reads over the
               couple photo (revealed with the couple) ---- */}
        <div
          data-hero-scrim
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(74% 62% at 50% 50%, rgba(33,26,30,0.52) 0%, rgba(33,26,30,0.32) 46%, transparent 78%)',
          }}
          aria-hidden
        />

        {/* ---- Names + text overlays ---- */}
        <div
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          style={{ textShadow: '0 2px 22px rgba(25,18,22,0.5)' }}
        >
          <p data-above className="eyebrow text-ivory/85">
            Together with their families
          </p>

          <div data-names className="my-4">
            <h1 className="display-xl text-ivory">
              <span data-name-line className="block">
                {couple.groom.toUpperCase()}
              </span>
              <span
                data-name-line
                className="block font-script text-rose text-[0.42em] leading-none my-1"
              >
                &amp;
              </span>
              <span data-name-line className="block">
                {couple.bride.toUpperCase()}
              </span>
            </h1>
          </div>

          <p data-below className="eyebrow text-ivory/85">
            invite you to celebrate their wedding
          </p>

          {/* Announcement overlaps, revealed last */}
          <div data-announce className="absolute bottom-[10%] flex flex-col items-center gap-3">
            <p className="eyebrow text-rose">We&apos;re getting married</p>
            <p className="font-display text-2xl md:text-4xl text-ivory tracking-wide">
              {wedding.dateLabel}
            </p>
            <p className="eyebrow text-ivory/80">{wedding.city}</p>
          </div>
        </div>

        {/* ---- Scroll cue ---- */}
        <div
          data-cue
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="eyebrow text-ink/70">Scroll to enter</span>
          <span className="block h-10 w-px bg-gradient-to-b from-rose/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}

function DoorFace({ side }: { side: 'left' | 'right' }) {
  // A pale, carved timber door. Panels rendered as thin inset lines.
  const edge = side === 'left' ? 'right' : 'left';
  return (
    <div
      className="relative h-full w-full"
      style={{
        background: 'linear-gradient(100deg, #efe7dd 0%, #e6d8c8 45%, #f4ede3 100%)',
        boxShadow:
          side === 'left'
            ? 'inset -30px 0 60px -20px rgba(150,128,118,0.4)'
            : 'inset 30px 0 60px -20px rgba(150,128,118,0.4)',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* recessed panels */}
      <div className="absolute inset-6 flex flex-col gap-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 rounded-[3px]"
            style={{
              border: '1px solid rgba(156,107,120,0.18)',
              boxShadow: 'inset 0 0 30px rgba(150,128,124,0.22)',
              background: 'linear-gradient(180deg, rgba(217,139,152,0.07), transparent)',
            }}
          />
        ))}
      </div>
      {/* handle near the centre seam */}
      <div
        className="absolute top-1/2 h-16 w-[3px] -translate-y-1/2 rounded bg-mauve/40"
        style={{ [edge]: '10px' } as React.CSSProperties}
      />
    </div>
  );
}
