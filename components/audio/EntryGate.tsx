'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { couple } from '@/lib/site';
import { useMusic } from './MusicProvider';

/**
 * EntryGate — the opening invitation, shown over the (already visible) church
 * doors once the loader has cleared. Turns the music decision into part of the
 * wedding invitation rather than a cookie/modal popup.
 */
export default function EntryGate() {
  const root = useRef<HTMLDivElement>(null);
  const { enter } = useMusic();
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.timeline({ defaults: { ease: 'power3.out' } }).from('[data-gate-item]', {
        autoAlpha: 0,
        y: 18,
        duration: 1.2,
        stagger: 0.22,
        delay: 0.2,
      });
    },
    { scope: root },
  );

  const choose = (withMusic: boolean) => {
    // Start audio synchronously within this gesture (mobile-safe), THEN animate out.
    enter(withMusic);
    if (prefersReducedMotion()) {
      setGone(true);
      return;
    }
    gsap.to(root.current, {
      autoAlpha: 0,
      duration: 1.1,
      ease: 'power2.inOut',
      onComplete: () => setGone(true),
    });
  };

  if (gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center overscroll-contain px-6 text-center"
      style={{
        background:
          'linear-gradient(to bottom, rgba(251,244,242,0.9), rgba(251,244,242,0.72) 45%, rgba(251,244,242,0.93))',
        backdropFilter: 'blur(3px)',
        touchAction: 'none',
      }}
    >
      <p data-gate-item className="eyebrow text-mauve">
        Enter the experience
      </p>

      <h2
        data-gate-item
        className="font-display my-6 leading-none text-ink"
        style={{ fontSize: 'clamp(2.6rem, 8vw, 6rem)' }}
      >
        {couple.groom.toUpperCase()}
        <span className="font-script mx-3 text-mauve" style={{ fontSize: '0.5em' }}>
          &amp;
        </span>
        {couple.bride.toUpperCase()}
      </h2>

      <p data-gate-item className="font-serif-e text-lg text-ink/75 md:text-xl">
        invite you to experience their story
      </p>

      <div data-gate-item className="mt-12 flex flex-col items-center gap-5">
        <button type="button" onClick={() => choose(true)} className="btn-ghost text-ink">
          Enter with music ♪
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          className="text-xs uppercase tracking-[0.28em] text-ink/50 underline-offset-8 transition-colors hover:text-ink/80 hover:underline"
        >
          Enter quietly
        </button>
      </div>
    </div>
  );
}
