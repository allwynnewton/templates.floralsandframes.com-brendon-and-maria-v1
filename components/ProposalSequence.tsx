'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { proposal, photos } from '@/lib/site';

export default function ProposalSequence() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-then]'), { autoAlpha: 0 });
        gsap.set(q('[data-yes]'), { autoAlpha: 1 });
        gsap.set(track.current, { xPercent: 0 });
      });

      // DESKTOP: pinned horizontal cinema.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(q('[data-yes]'), { autoAlpha: 0, scale: 1.1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: '+=220%',
            pin: true,
            scrub: 1,
          },
        });

        // heading resolves
        tl.to('[data-then]', { autoAlpha: 0, y: -20, duration: 1, ease: 'power2.in' }, 0.3)
          .to('[data-yes]', { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power3.out' }, 1)
          // photos travel across (two cards)
          .to(track.current, { xPercent: -18, ease: 'none', duration: 4 }, 0.6);
      });

      // MOBILE: no pin, gentle stacked reveal.
      mm.add('(max-width: 767px) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(q('[data-then]'), { autoAlpha: 0 });
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%' } })
          .fromTo('[data-yes]', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' });
        gsap.set(track.current, { xPercent: 0 });
      });
    },
    { scope: root },
  );

  const captions = proposal.captions;

  return (
    <section ref={root} className="relative overflow-hidden bg-mist text-ink">
      <div className="relative flex min-h-[100svh] flex-col justify-center py-24 md:h-[100svh] md:py-0">
        {/* heading — a section title at the top on mobile, a centered overlay
            over the side-by-side cards on desktop */}
        <div className="pointer-events-none relative z-20 mb-8 flex items-center justify-center text-center md:absolute md:inset-0 md:mb-0">
          <h2 data-then className="display-lg text-ink/90">
            AND THEN&hellip;
          </h2>
          <h2 data-yes className="display-lg absolute text-mauve">
            SHE SAID YES.
          </h2>
        </div>

        {/* horizontal track (desktop) / stacked (mobile) */}
        <div
          ref={track}
          className="flex flex-col gap-10 px-6 md:w-max md:flex-row md:gap-16 md:px-[8vw]"
        >
          {[0, 1].map((i) => (
            <figure
              key={i}
              className="relative shrink-0 md:w-[52vw]"
            >
              <Photo
                src={photos.proposal[i % photos.proposal.length]}
                alt={`Proposal moment ${i + 1}`}
                tone={(['wine', 'champagne', 'forest'] as const)[i]}
                label={`proposal ${i + 1}`}
                seed={i + 21}
                className="aspect-[3/4] w-full md:aspect-[4/5]"
                sizes="(max-width: 768px) 90vw, 46vw"
              />
              {captions[i] && (
                <figcaption className="mt-4 font-serif-e text-lg text-ink/70">
                  {captions[i]}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
