'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import Reveal from './Reveal';
import { story, photos } from '@/lib/site';

const tones = ['forest', 'wine', 'champagne', 'charcoal'] as const;

export default function OurStory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(q('[data-line-fill]'), { scaleY: 1 });
        gsap.set(q('[data-node]'), { autoAlpha: 1, scale: 1 });
        gsap.set(q('[data-milestone]'), { autoAlpha: 1, y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The line grows downward with scroll (scrubbed).
        gsap.fromTo(
          q('[data-line-fill]'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: q('[data-timeline]'),
              start: 'top 70%',
              end: 'bottom 70%',
              scrub: 1,
            },
          },
        );

        // Each milestone illuminates as it arrives.
        q('[data-milestone]').forEach((el) => {
          const node = el.querySelector('[data-node]');
          gsap.set(el, { autoAlpha: 0, y: 40 });
          gsap.set(node, { autoAlpha: 0.25, scale: 0.6 });
          gsap
            .timeline({
              scrollTrigger: { trigger: el, start: 'top 72%' },
            })
            .to(el, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' })
            .to(node, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0.1);
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="relative bg-blush px-6 py-32 text-ink md:py-48"
    >
      <Reveal className="mx-auto mb-24 max-w-4xl text-center">
        <p className="eyebrow mb-8 text-mauve">Chapter One</p>
        <h2 className="display-lg text-ink">
          GOD WROTE
          <br />
          OUR STORY
        </h2>
        <div className="mx-auto mt-12 max-w-2xl space-y-1">
          {story.intro.map((l, i) => (
            <p key={i} className="font-serif-e text-lg text-ink/70 md:text-xl">
              {l}
            </p>
          ))}
        </div>
      </Reveal>

      <div
        data-timeline
        className="relative mx-auto max-w-5xl"
      >
        {/* center rail */}
        <div className="absolute left-6 top-0 h-full w-px -translate-x-1/2 bg-ink/10 md:left-1/2" />
        <div
          data-line-fill
          className="absolute left-6 top-0 h-full w-px -translate-x-1/2 origin-top scale-y-0 bg-gradient-to-b from-rose via-rose/70 to-rose/20 md:left-1/2"
        />

        <div className="space-y-16 md:space-y-32">
          {story.milestones.map((m, i) => {
            const left = i % 2 === 0;
            return (
              <div
                key={m.year}
                data-milestone
                className="relative pl-16 md:grid md:grid-cols-2 md:items-center md:gap-16 md:pl-0"
              >
                {/* node dot */}
                <span
                  data-node
                  className="absolute left-6 top-8 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose shadow-[0_0_18px_4px_rgba(217,139,152,0.45)] md:left-1/2 md:top-1/2"
                />

                {/* text + photo, alternating on desktop */}
                <div
                  className={`${left ? 'md:order-1 md:text-right md:pr-16' : 'md:order-2 md:pl-16'} col-span-1`}
                >
                  <p className="font-display text-5xl text-mauve md:text-7xl">
                    {m.year}
                  </p>
                  <p className="mt-2 font-serif-e text-xl text-ink/80 md:text-2xl">
                    {m.title}
                  </p>
                </div>

                <div
                  className={`${left ? 'md:order-2 md:pl-16' : 'md:order-1 md:pr-16'} mt-6 md:mt-0`}
                >
                  <Photo
                    src={photos.story[i % photos.story.length]}
                    alt={`${m.year} — ${m.title}`}
                    tone={tones[i % tones.length]}
                    label={m.year}
                    seed={i + 3}
                    className="aspect-[4/5] w-full"
                    sizes="(max-width: 768px) 90vw, 40vw"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
