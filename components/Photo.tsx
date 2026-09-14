'use client';

import Image from 'next/image';
import { CSSProperties } from 'react';

/**
 * Photo
 * -----
 * A drop-in editorial image slot.
 *
 * • Pass `src` (a file under /public) to render a real, optimised next/image.
 * • Omit `src` and it renders a cinematic, self-contained placeholder so the
 *   whole site looks finished before any real photography exists.
 *
 * To use real photos: put files in /public/images and pass e.g.
 *   <Photo src="/images/hero-couple.jpg" alt="Brendon and Maria" />
 */

type Tone = 'forest' | 'wine' | 'champagne' | 'charcoal' | 'ivory' | 'cream';

// Light, airy floral placeholder tints (soft blush, rose, sage, cream).
// Tone names are kept for compatibility with the sections that pass them.
const TONES: Record<Tone, [string, string, string]> = {
  forest: ['#EEF2E8', '#D6E0C9', '#B7C6A6'], // soft sage greenery
  wine: ['#FAE7EA', '#EBB9C1', '#D69AA4'], // dusty rose / blush
  champagne: ['#F7EFDD', '#E7D3AA', '#D0B583'], // soft warm gold
  charcoal: ['#F1EDE9', '#DCD3CA', '#BFB3A6'], // warm greige
  ivory: ['#FFFFFF', '#F8F3EF', '#EBE2D8'],
  cream: ['#FCF6ED', '#F1E7D7', '#E1D2BB'],
};

export interface PhotoProps {
  src?: string;
  alt: string;
  tone?: Tone;
  /** small kicker rendered on the placeholder to hint at intended content */
  label?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  sizes?: string;
  /** seed changes the placeholder's abstract composition */
  seed?: number;
}

function Placeholder({
  tone = 'forest',
  label,
  seed = 1,
}: {
  tone?: Tone;
  label?: string;
  seed?: number;
}) {
  const [a, b, c] = TONES[tone];
  const cx = 30 + ((seed * 37) % 40);
  const cy = 26 + ((seed * 53) % 30);
  // Every tone is light now — labels always read in dark ink.
  const ink = 'rgba(74,64,60,0.5)';

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `radial-gradient(120% 120% at ${cx}% ${cy}%, ${a} 0%, ${b} 45%, ${c} 100%)`,
      }}
    >
      {/* soft light bloom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(60% 50% at ${cx}% ${cy - 6}%, rgba(255,252,248,0.55) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }}
      />
      {/* fine grain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.12,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {/* vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 130px 40px rgba(120,100,105,0.16)',
        }}
      />
      {label && (
        <div
          style={{
            position: 'absolute',
            left: '1.4rem',
            bottom: '1.2rem',
            color: ink,
            fontSize: '0.6rem',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}

export default function Photo({
  src,
  alt,
  tone = 'forest',
  label,
  className,
  style,
  priority,
  sizes = '100vw',
  seed = 1,
}: PhotoProps) {
  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden', ...style }}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <>
          <Placeholder tone={tone} label={label} seed={seed} />
          <span className="sr-only">{alt}</span>
        </>
      )}
    </div>
  );
}
