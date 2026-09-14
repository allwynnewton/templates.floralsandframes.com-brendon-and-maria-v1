'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { scriptures } from '@/lib/site';

export default function CovenantSection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-cov]'), { autoAlpha: 1, y: 0 });
        gsap.set(q('[data-goldline]'), { scaleX: 1 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 55%' } })
          .fromTo(
            q('[data-cov="heading"]'),
            { autoAlpha: 0, y: 40 },
            { autoAlpha: 1, y: 0, duration: 1.4, ease: 'power3.out' },
          )
          .fromTo(
            q('[data-cov="copy"]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.6',
          )
          .fromTo(
            q('[data-goldline]'),
            { scaleX: 0 },
            { scaleX: 1, duration: 1.4, ease: 'power2.inOut' },
            '-=0.3',
          )
          .fromTo(
            q('[data-cov="verse"]'),
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out' },
            '+=0.1',
          );
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="flex min-h-screen flex-col items-center justify-center px-6 py-40 text-center"
      style={{
        background: 'linear-gradient(180deg, #fbf4f2 0%, #eef2e9 50%, #f7e4e7 100%)',
      }}
    >
      <h2 data-cov="heading" className="display-lg text-ink">
        WHEN TWO
        <br />
        BECOME ONE
      </h2>

      <div data-cov="copy" className="mt-10 space-y-1 font-serif-e text-lg text-ink/70 md:text-xl">
        <p>Two lives.</p>
        <p>Two families.</p>
        <p>One covenant.</p>
      </div>

      <span
        data-goldline
        className="mt-14 h-px w-56 origin-center scale-x-0 bg-gradient-to-r from-transparent via-rose to-transparent"
      />

      <div data-cov="verse" className="mt-14 max-w-2xl">
        <p className="font-display text-2xl leading-snug text-ink/90 md:text-4xl">
          &ldquo;Therefore what God has joined together,
          <br />
          let no one separate.&rdquo;
        </p>
        <p className="eyebrow mt-8 text-mauve">{scriptures.covenant.ref}</p>
      </div>
    </section>
  );
}
