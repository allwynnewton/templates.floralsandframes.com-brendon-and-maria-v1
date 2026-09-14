'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { wedding, photos } from '@/lib/site';

export default function ReceptionSection() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // gentle drifting bokeh — transform/opacity only
        gsap.utils.toArray<HTMLElement>(q('[data-bokeh]')).forEach((b, i) => {
          gsap.to(b, {
            y: `+=${20 + (i % 3) * 14}`,
            x: `+=${i % 2 ? 16 : -16}`,
            opacity: gsap.utils.random(0.25, 0.6),
            duration: gsap.utils.random(4, 7),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.3,
          });
        });

        gsap.fromTo(
          q('[data-rc]'),
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            stagger: 0.15,
            scrollTrigger: { trigger: root.current, start: 'top 55%' },
          },
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-rc]'), { autoAlpha: 1, y: 0 });
      });
    },
    { scope: root },
  );

  const bokeh = Array.from({ length: 14 });

  return (
    <section ref={root} className="relative min-h-screen overflow-hidden bg-mist text-ivory">
      <Photo
        src={photos.reception}
        alt="Warm celebration lights at the reception"
        tone="wine"
        seed={61}
        style={{ position: 'absolute', inset: 0 }}
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-ink/70" />

      {/* distant warm bokeh */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {bokeh.map((_, i) => (
          <span
            key={i}
            data-bokeh
            className="absolute rounded-full bg-champagne"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              width: `${6 + (i % 4) * 6}px`,
              height: `${6 + (i % 4) * 6}px`,
              opacity: 0.35,
              filter: 'blur(3px)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-32 text-center">
        <h2 data-rc className="display-lg text-ivory">
          AND THEN
          <br />
          WE CELEBRATE.
        </h2>

        <div data-rc className="mt-14 flex flex-col items-center gap-2">
          <p className="font-display text-3xl text-rose md:text-4xl">{wedding.reception.venue}</p>
          <p className="font-serif-e text-lg text-ivory/80">{wedding.reception.resort}</p>
          <p className="eyebrow mt-4 text-ivory/70">{wedding.reception.time}</p>
          <p className="eyebrow text-ivory/70">{wedding.reception.note}</p>
          <a
            href={wedding.reception.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-8 text-ivory"
          >
            View Location
          </a>
        </div>
      </div>
    </section>
  );
}
