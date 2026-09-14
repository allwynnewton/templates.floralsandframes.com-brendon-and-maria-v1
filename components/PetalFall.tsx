'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { useMusic } from './audio/MusicProvider';

/**
 * PetalFall — the "flowers fall down" moment.
 * The instant the visitor enters (from the EntryGate), a soft cascade of rose
 * petals drifts down over the opening scene, then clears itself from the DOM.
 * Fixed, pointer-events-none overlay so it never blocks scrolling or clicks.
 */

const PETAL_TINTS: [string, string][] = [
  ['#FBE3E8', '#D98B98'], // blush → rose
  ['#F7D6DE', '#C77E8C'], // pink
  ['#FFFFFF', '#EBCAD0'], // cream
  ['#F1C6D0', '#9C6B78'], // mauve
];

type Petal = {
  left: number; // vw
  size: number; // px
  tint: [string, string];
  rot: number;
  delay: number;
  duration: number;
  drift: number; // px of horizontal sway
  spin: number; // degrees of tumble
};

function makePetals(count: number): Petal[] {
  const petals: Petal[] = [];
  for (let i = 0; i < count; i++) {
    petals.push({
      left: Math.random() * 100,
      size: 12 + Math.random() * 16,
      tint: PETAL_TINTS[Math.floor(Math.random() * PETAL_TINTS.length)],
      rot: Math.random() * 360,
      delay: Math.random() * 1.6,
      duration: 4.5 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 220,
      spin: (Math.random() - 0.5) * 540,
    });
  }
  return petals;
}

export default function PetalFall() {
  const { hasEntered } = useMusic();
  const root = useRef<HTMLDivElement>(null);
  const [petals, setPetals] = useState<Petal[]>([]);

  // Generate petals only once the visitor has entered (client-side, so using
  // Math.random here is safe — nothing is server-rendered).
  useEffect(() => {
    if (hasEntered && !prefersReducedMotion()) {
      setPetals(makePetals(46));
    }
  }, [hasEntered]);

  useGSAP(
    () => {
      if (!petals.length) return;
      const nodes = gsap.utils.toArray<HTMLElement>('[data-petal]');
      const fall = window.innerHeight + 220;

      nodes.forEach((node, i) => {
        const p = petals[i];
        gsap.set(node, { y: -180, x: 0, rotation: p.rot, autoAlpha: 0 });
        gsap
          .timeline({ delay: p.delay })
          .to(node, { autoAlpha: 0.95, duration: 0.7, ease: 'sine.out' }, 0)
          .to(
            node,
            {
              y: fall,
              x: p.drift,
              rotation: p.rot + p.spin,
              duration: p.duration,
              ease: 'sine.inOut',
            },
            0,
          )
          .to(node, { autoAlpha: 0, duration: 1, ease: 'sine.in' }, p.duration - 1);
      });

      // Longest petal finishes, then clear the overlay from the DOM.
      const total = Math.max(...petals.map((p) => p.delay + p.duration)) + 0.5;
      const t = window.setTimeout(() => setPetals([]), total * 1000);
      return () => window.clearTimeout(t);
    },
    { scope: root, dependencies: [petals] },
  );

  if (!petals.length) return null;

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
      aria-hidden
    >
      {petals.map((p, i) => (
        <span
          key={i}
          data-petal
          className="absolute top-0 block"
          style={{
            left: `${p.left}vw`,
            width: `${p.size}px`,
            height: `${p.size * 0.72}px`,
            background: `radial-gradient(circle at 32% 28%, ${p.tint[0]} 0%, ${p.tint[1]} 100%)`,
            borderRadius: '100% 0 100% 0',
            boxShadow: '0 2px 6px rgba(150,100,110,0.18)',
          }}
        />
      ))}
    </div>
  );
}
