'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { couple, wedding, photos } from '@/lib/site';

/**
 * SECTION 01 — THE FLORAL ARCHWAY
 * The signature opening (replaces the old church doors). You begin at the mouth
 * of a rose-covered wedding arch looking out to sea; as you scroll you walk
 * THROUGH the arch — it scales up and lifts away past you — and the couple is
 * revealed in the light beyond.
 *
 * The arch is built from ~150 individual blooms scattered by a fixed seed
 * (mulberry32) so the server and client render identically (no hydration flip).
 * Each bloom is a real flower SHAPE — a layered-petal rose / peony / hydrangea /
 * bud / eucalyptus sprig — drawn once as an SVG <symbol> and reused via <use>.
 *
 * ── PHOTO-REAL UPGRADE ─────────────────────────────────────────────────────
 * To use real photographed flower cut-outs instead of the drawn shapes: drop
 * transparent PNGs into `public/images/flowers/` and list them in FLOWER_IMAGES
 * below. When that array is non-empty the same scatter engine renders the photos
 * (no other change needed). Aim for ~6–10 cut-outs: a few roses in different
 * tones, a hydrangea, a couple of eucalyptus/leaf sprigs.
 */
const FLOWER_IMAGES: string[] = [
  // e.g. '/images/flowers/rose-blush.png', '/images/flowers/eucalyptus.png',
];

// --- deterministic PRNG (mulberry32) so SSR === CSR, no hydration flicker ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// Flower shapes — each defined once as an SVG <symbol> (viewBox 0 0 100 100).
// tones = [light petal, mid petal, deep centre].
// ---------------------------------------------------------------------------
type FlowerType = 'rose' | 'peony' | 'hydrangea' | 'bud' | 'leaf';
type Flower = { id: string; type: FlowerType; tones: [string, string, string] };

const FLOWERS: Flower[] = [
  { id: 'rose-blush', type: 'rose', tones: ['#FFF1F4', '#F0B4C0', '#D98B98'] },
  { id: 'rose-pink', type: 'rose', tones: ['#FDE0E7', '#E7A2B1', '#C77E8C'] },
  { id: 'rose-mauve', type: 'rose', tones: ['#F6DBE0', '#C68A98', '#9C6B78'] },
  { id: 'peony-blush', type: 'peony', tones: ['#FFF0F3', '#F1BFCB', '#D98B98'] },
  { id: 'peony-cream', type: 'peony', tones: ['#FFFFFF', '#F3DEE2', '#E2C4CB'] },
  { id: 'hydrangea-lilac', type: 'hydrangea', tones: ['#F3E4EE', '#D6B2CE', '#B084A6'] },
  { id: 'bud-rose', type: 'bud', tones: ['#FBC9D2', '#D98B98', '#9C6B78'] },
  { id: 'leaf-sage', type: 'leaf', tones: ['#CBD9BA', '#A6BC90', '#899C79'] },
];

// Weighted draw pool — mostly roses/peonies, a little greenery + accents.
const POOL: string[] = [
  ...Array(4).fill('rose-blush'),
  ...Array(4).fill('rose-pink'),
  ...Array(3).fill('rose-mauve'),
  ...Array(3).fill('peony-blush'),
  ...Array(2).fill('peony-cream'),
  ...Array(2).fill('hydrangea-lilac'),
  ...Array(2).fill('bud-rose'),
  ...Array(2).fill('leaf-sage'),
];

// A single soft, rounded petal, base at (0,0), tip pointing up to (0,-36).
// Wide + short so clustered blooms read as full roses/dahlias, not spiky asters.
const PETAL = 'M0 0 C -12 -11 -12 -27 0 -36 C 12 -27 12 -11 0 0 Z';

function petalRings(tones: [string, string, string], full: boolean) {
  const [light, mid, deep] = tones;
  // [count, scale, rotationOffset, fill]
  const rings: [number, number, number, string][] = full
    ? [
        [11, 1.02, 0, light],
        [10, 0.82, 18, light],
        [8, 0.64, 9, mid],
        [6, 0.46, 22, mid],
        [5, 0.32, 10, deep],
      ]
    : [
        [9, 1.0, 0, light],
        [8, 0.74, 20, light],
        [7, 0.54, 10, mid],
        [5, 0.34, 22, deep],
      ];
  const els: React.ReactNode[] = [];
  rings.forEach(([n, s, rot, fill], ri) => {
    for (let i = 0; i < n; i++) {
      const a = rot + (i * 360) / n;
      els.push(
        <path
          key={`${ri}-${i}`}
          d={PETAL}
          fill={fill}
          transform={`translate(50 52) rotate(${a}) scale(${s})`}
        />,
      );
    }
  });
  els.push(<circle key="core" cx={50} cy={52} r={full ? 4 : 5} fill={deep} />);
  return els;
}

function hydrangea(tones: [string, string, string]) {
  const [light, mid, deep] = tones;
  const florets: [number, number][] = [
    [50, 50],
    [34, 42],
    [66, 42],
    [40, 66],
    [62, 66],
    [50, 32],
  ];
  return florets.flatMap(([cx, cy], fi) => {
    const petals = [45, 135, 225, 315].map((a, pi) => {
      const rad = (a * Math.PI) / 180;
      return (
        <circle
          key={`${fi}-${pi}`}
          cx={cx + Math.cos(rad) * 9}
          cy={cy + Math.sin(rad) * 9}
          r={8}
          fill={pi % 2 ? light : mid}
        />
      );
    });
    return [...petals, <circle key={`${fi}-c`} cx={cx} cy={cy} r={3} fill={deep} />];
  });
}

function leafSprig(tones: [string, string, string]) {
  const [light, mid, deep] = tones;
  const els: React.ReactNode[] = [
    <path
      key="stem"
      d="M50 94 C 50 70 50 38 50 10"
      stroke={deep}
      strokeWidth={2.2}
      fill="none"
      strokeLinecap="round"
    />,
  ];
  [82, 68, 54, 40, 26].forEach((y, i) => {
    [-1, 1].forEach((sd, si) => {
      const cx = 50 + sd * 13;
      els.push(
        <ellipse
          key={`${i}-${si}`}
          cx={cx}
          cy={y}
          rx={11}
          ry={6.5}
          fill={si ? mid : light}
          transform={`rotate(${sd * 36} ${cx} ${y})`}
        />,
      );
    });
  });
  return els;
}

function budBloom(tones: [string, string, string]) {
  const [light, mid, deep] = tones;
  const sepal = '#A6BC90';
  return [
    <path key="s1" d={PETAL} fill={sepal} transform="translate(50 62) rotate(0) scale(0.82)" />,
    <path key="s2" d={PETAL} fill={sepal} transform="translate(50 62) rotate(-32) scale(0.72)" />,
    <path key="s3" d={PETAL} fill={sepal} transform="translate(50 62) rotate(32) scale(0.72)" />,
    <path key="p1" d={PETAL} fill={mid} transform="translate(50 54) rotate(0) scale(0.64)" />,
    <path key="p2" d={PETAL} fill={light} transform="translate(50 54) rotate(-16) scale(0.5)" />,
    <path key="p3" d={PETAL} fill={deep} transform="translate(50 54) rotate(16) scale(0.5)" />,
  ];
}

function FlowerSymbol({ f }: { f: Flower }) {
  const body =
    f.type === 'rose'
      ? petalRings(f.tones, false)
      : f.type === 'peony'
        ? petalRings(f.tones, true)
        : f.type === 'hydrangea'
          ? hydrangea(f.tones)
          : f.type === 'leaf'
            ? leafSprig(f.tones)
            : budBloom(f.tones);
  return (
    <symbol id={f.id} viewBox="0 0 100 100">
      {body}
    </symbol>
  );
}

// ---------------------------------------------------------------------------
// Scatter the blooms along the arch frame (two pillars + top beam).
// ---------------------------------------------------------------------------
type Bloom = {
  x: number; // %
  y: number; // %
  size: number; // vmin
  rot: number;
  sprite: string;
  imgIndex: number;
  z: number;
};

const BLOOMS: Bloom[] = (() => {
  const rand = mulberry32(0x20261228);
  const out: Bloom[] = [];

  const pick = () => POOL[Math.floor(rand() * POOL.length)];

  const band = (
    xMin: number,
    xMax: number,
    yMin: number,
    yMax: number,
    step: number,
    sizeMin: number,
    sizeMax: number,
  ) => {
    for (let y = yMin; y <= yMax; y += step) {
      for (let x = xMin; x <= xMax; x += step) {
        const sprite = pick();
        const isLeaf = sprite === 'leaf-sage';
        out.push({
          x: x + (rand() - 0.5) * step * 1.5,
          y: y + (rand() - 0.5) * step * 1.5,
          size: (sizeMin + rand() * (sizeMax - sizeMin)) * (isLeaf ? 1.15 : 1),
          rot: Math.floor(rand() * 360),
          sprite,
          imgIndex: Math.floor(rand() * 997),
          z: isLeaf ? 1 : 2 + Math.floor(rand() * 3),
        });
      }
    }
  };

  band(1, 99, -3, 26, 5.6, 5.5, 11.5); // top beam
  band(1, 25, 18, 104, 5.6, 5, 11); // left pillar
  band(75, 99, 18, 104, 5.6, 5, 11); // right pillar

  // A scatter of small filler blooms to close gaps into a solid wall.
  for (let i = 0; i < 34; i++) {
    const onBeam = rand() < 0.4;
    const x = onBeam ? 2 + rand() * 96 : rand() < 0.5 ? 2 + rand() * 22 : 76 + rand() * 22;
    const y = onBeam ? -2 + rand() * 26 : 18 + rand() * 85;
    out.push({
      x,
      y,
      size: 3.6 + rand() * 3.4,
      rot: Math.floor(rand() * 360),
      sprite: pick(),
      imgIndex: Math.floor(rand() * 997),
      z: 4,
    });
  }

  return out;
})();

export default function FloralArchHero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const useImages = FLOWER_IMAGES.length > 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      const archGroup = q('[data-arch-group]');
      const beyond = q('[data-beyond]');
      const glow = q('[data-glow]');
      const couplePhoto = q('[data-couple]');
      const heroScrim = q('[data-hero-scrim]');
      const aisle = q('[data-aisle]');
      const names = q('[data-names]');
      const nameLetters = q('[data-name-line]');
      const above = q('[data-above]');
      const below = q('[data-below]');
      const announce = q('[data-announce]');
      const cue = q('[data-cue]');

      // ---------- REDUCED MOTION: resolved final frame ----------
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set([archGroup, cue, aisle], { autoAlpha: 0 });
        gsap.set([beyond, glow, couplePhoto, names, above, below, heroScrim], { autoAlpha: 1 });
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
          const distance = isDesktop ? '+=460%' : '+=300%';
          const archScale = isDesktop ? 2.9 : 2.2;

          // ----- initial states -----
          gsap.set(archGroup, { transformOrigin: '50% 44%', scale: 1, autoAlpha: 1 });
          gsap.set(beyond, { scale: 1.12, autoAlpha: 0.85 });
          gsap.set(glow, { autoAlpha: 0.25, scale: 0.8 });
          gsap.set(couplePhoto, { autoAlpha: 0, scale: 1.1, filter: 'blur(16px)' });
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

          // STAGE 1 — Silence (0 → 1): a held breath at the mouth of the arch.
          tl.addLabel('silence', 0)
            .to(beyond, { scale: 1.06, duration: 1, ease: 'power1.out' }, 0)
            .to('[data-vignette]', { opacity: 0.42, duration: 1 }, 0)
            .to(cue, { autoAlpha: 0, duration: 0.6 }, 0.4);

          // STAGE 2 — Approach (1 → 3): the light beyond swells, we lean in.
          tl.addLabel('approach', 1)
            .to(glow, { autoAlpha: 0.9, scale: 1.05, duration: 2, ease: 'power2.out' }, 1)
            .to(beyond, { scale: 1, autoAlpha: 1, duration: 2, ease: 'power2.out' }, 1)
            .to(archGroup, { scale: 1.35, duration: 2, ease: 'power1.in' }, 1);

          // STAGE 3 — Pass through (3 → 5): the arch scales up and lifts past us.
          tl.addLabel('passThrough', 3)
            .to(
              archGroup,
              { scale: archScale, yPercent: -14, autoAlpha: 0.04, duration: 2, ease: 'power2.in' },
              3,
            )
            .to(glow, { autoAlpha: 1, scale: 1.2, duration: 2, ease: 'power2.out' }, 3);

          // STAGE 4 — The couple emerges in the light (4.6 → 6.6).
          tl.addLabel('coupleReveal', 4.6)
            .to(
              couplePhoto,
              { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 2, ease: 'power2.out' },
              4.6,
            )
            .to(heroScrim, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, 4.8)
            .to(glow, { autoAlpha: 0.4, duration: 1.6 }, 5.2);

          // STAGE 5 — Names (6.6 → 8.2).
          tl.addLabel('names', 6.6)
            .to(above, { autoAlpha: 1, y: 0, duration: 0.9 }, 6.6)
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
              6.7,
            )
            .to(below, { autoAlpha: 1, y: 0, duration: 0.9 }, 7.5);

          // STAGE 6 — Announcement (8.2 → 10).
          tl.addLabel('announcement', 8.2)
            .to([above, names, below], { y: -46, duration: 1.4, ease: 'power2.inOut' }, 8.2)
            .to(announce, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power3.out' }, 8.5)
            .to(couplePhoto, { scale: 1.06, duration: 1.4, ease: 'power1.inOut' }, 8.2);

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
      {/* Flower shapes, defined once and reused via <use>. */}
      {!useImages && (
        <svg width="0" height="0" aria-hidden style={{ position: 'absolute' }}>
          <defs>
            {FLOWERS.map((f) => (
              <FlowerSymbol key={f.id} f={f} />
            ))}
          </defs>
        </svg>
      )}

      <div ref={stage} className="relative h-[100svh] w-full overflow-hidden bg-blush">
        {/* ---- The world beyond the arch: soft sky → sea → lawn ---- */}
        <div
          data-beyond
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg,' +
              '#FBF4F2 0%,' + // pale sky
              '#F4E9E6 34%,' + // warm haze at the horizon
              '#DCE7E6 52%,' + // muted seafoam
              '#C6D8D6 63%,' + // sea
              '#BFD0C7 70%,' + // shallows
              '#CFD9C2 78%,' + // lawn edge
              '#E8E7D8 100%)', // foreground light
          }}
        />
        {/* warm light bloom pouring through the opening */}
        <div
          data-glow
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(42% 46% at 50% 48%, rgba(255,253,251,0.96) 0%, rgba(247,228,231,0.55) 34%, rgba(217,139,152,0.12) 58%, transparent 76%)',
            filter: 'blur(4px)',
          }}
        />

        {/* ---- The couple, revealed in the light beyond ---- */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            data-couple
            className="relative h-[66%] w-[58%] max-w-[520px] overflow-hidden rounded-[2px]"
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

        {/* ---- The petal aisle leading in (foreground) ---- */}
        <div
          data-aisle
          className="pointer-events-none absolute bottom-0 left-1/2 h-[34%] w-[120%] -translate-x-1/2"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.35) 30%, rgba(247,228,231,0.55) 100%)',
            clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* ---- The floral arch itself ---- */}
        <div
          data-arch-group
          className="pointer-events-none absolute inset-0"
          style={{ willChange: 'transform, opacity' }}
          aria-hidden
        >
          {/* Soft blurred foliage backing so the arch reads as a solid, lush
              wall of flowers — fills the gaps between the individual blooms. */}
          {!useImages &&
            (
              [
                { left: '1%', right: '1%', top: '-2%', height: '27%' }, // beam
                { left: '1%', width: '24%', top: '6%', bottom: '0%' }, // left pillar
                { right: '1%', width: '24%', top: '6%', bottom: '0%' }, // right pillar
              ] as React.CSSProperties[]
            ).map((pos, i) => (
              <div
                key={`bk-${i}`}
                className="absolute"
                style={{
                  ...pos,
                  zIndex: 0,
                  filter: 'blur(11px)',
                  opacity: 0.9,
                  background:
                    'radial-gradient(circle at 28% 24%, rgba(217,139,152,0.65), transparent 34%),' +
                    'radial-gradient(circle at 70% 40%, rgba(156,107,120,0.5), transparent 32%),' +
                    'radial-gradient(circle at 40% 66%, rgba(147,165,131,0.5), transparent 34%),' +
                    'radial-gradient(circle at 82% 78%, rgba(233,166,177,0.55), transparent 32%),' +
                    'radial-gradient(circle at 14% 84%, rgba(176,132,166,0.45), transparent 34%),' +
                    'linear-gradient(160deg, rgba(240,180,192,0.55), rgba(147,165,131,0.4))',
                }}
              />
            ))}

          {BLOOMS.map((b, i) =>
            useImages ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={FLOWER_IMAGES[b.imgIndex % FLOWER_IMAGES.length]}
                alt=""
                className="absolute block"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.size}vmin`,
                  height: 'auto',
                  transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
                  zIndex: b.z,
                  filter: 'drop-shadow(0 3px 5px rgba(120,80,92,0.16))',
                }}
              />
            ) : (
              <svg
                key={i}
                viewBox="0 0 100 100"
                className="absolute block"
                style={{
                  left: `${b.x}%`,
                  top: `${b.y}%`,
                  width: `${b.size}vmin`,
                  height: `${b.size}vmin`,
                  overflow: 'visible',
                  transform: `translate(-50%, -50%) rotate(${b.rot}deg)`,
                  zIndex: b.z,
                  filter: 'drop-shadow(0 2px 4px rgba(120,80,92,0.14))',
                }}
              >
                <use href={`#${b.sprite}`} />
              </svg>
            ),
          )}
        </div>

        {/* ---- Vignette ---- */}
        <div
          data-vignette
          className="pointer-events-none absolute inset-0"
          style={{ boxShadow: 'inset 0 0 220px 80px rgba(150,128,132,0.24)', opacity: 0.55 }}
        />

        {/* ---- Soft scrim behind the hero text ---- */}
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
          className="pointer-events-none absolute inset-0 z-[6] flex flex-col items-center justify-center px-6 text-center"
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
          className="absolute bottom-10 left-1/2 z-[7] flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="eyebrow text-ink/70">Scroll to enter</span>
          <span className="block h-10 w-px bg-gradient-to-b from-rose/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
