'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '@/lib/gsap';
import { couple, wedding } from '@/lib/site';

export default function WeddingLoader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      const finish = () => {
        gsap.to(root.current, {
          autoAlpha: 0,
          duration: reduced ? 0.3 : 1.1,
          ease: 'power2.inOut',
          delay: reduced ? 0 : 0.25,
          onComplete: () => {
            setHidden(true);
            onDone();
          },
        });
      };

      // Fill the hairline as a genuine progress cue (assets + a graceful min time).
      const tl = gsap.timeline({ onComplete: finish });
      tl.from('[data-loader-mark]', {
        autoAlpha: 0,
        y: 14,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
      }).to(
        bar.current,
        {
          scaleX: 1,
          duration: reduced ? 0.4 : 1.6,
          ease: 'power2.inOut',
        },
        0.2,
      );

      // Don't fake long loads: if the page is already loaded, keep it brisk.
      if (document.readyState === 'complete') {
        tl.timeScale(1.15);
      } else {
        const onLoad = () => tl.timeScale(1.2);
        window.addEventListener('load', onLoad, { once: true });
      }
    },
    { scope: root },
  );

  if (hidden) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-blush"
    >
      <div data-loader-mark className="font-display text-5xl md:text-6xl text-ink tracking-wide">
        {couple.initials}
      </div>
      <div data-loader-mark className="eyebrow mt-6 text-mauve/80">
        {wedding.dateShort}
      </div>
      <div className="mt-10 h-px w-40 overflow-hidden bg-ink/10">
        <div ref={bar} className="h-full w-full origin-left scale-x-0 bg-champagne" />
      </div>
    </div>
  );
}
