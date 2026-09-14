'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { story, photos } from '@/lib/site';
import Photo from './Photo';
import Reveal from './Reveal';
export default function OurStory() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);
      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const shots = q('.story-desktop-photo');
        gsap.set(shots.slice(1), { clipPath: 'inset(100% 0 0 0)' });
        q('.story-milestone').forEach((chapter, i) => {
          if (i === 0) return;
          gsap.fromTo(
            shots[i],
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              ease: 'none',
              scrollTrigger: { trigger: chapter, start: 'top 80%', end: 'top 38%', scrub: 0.6 },
            },
          );
        });
      });
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('.story-milestone').forEach((chapter) => {
          gsap.from(chapter.querySelectorAll('.story-copy > *'), {
            y: 28,
            opacity: 0,
            stagger: 0.12,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: chapter, start: 'top 75%' },
          });
        });
        gsap.from(q('.story-rail-fill'), {
          scaleY: 0,
          transformOrigin: 'top',
          ease: 'none',
          scrollTrigger: {
            trigger: q('.story-body'),
            start: 'top 55%',
            end: 'bottom 65%',
            scrub: 0.5,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  const notes = [
    'A simple hello. A conversation neither of us wanted to end.',
    'The little things became our favourite things — because we shared them.',
    'One question, a thousand butterflies, and the easiest yes.',
    'With grateful hearts, we begin a lifetime of choosing each other.',
  ];
  return (
    <section ref={root} className="story-section" id="our-story">
      <Reveal className="section-heading">
        <p className="eyebrow">Chapter one · Our beginning</p>
        <h2>
          God wrote <em>our story</em>
        </h2>
        <p className="story-intro">{story.intro.join(' ')}</p>
      </Reveal>
      <div className="story-body">
        <div className="story-stage">
          <div className="story-photo-stack">
            {story.milestones.map((m, i) => (
              <div key={m.year} className="story-desktop-photo">
                <Photo
                  src={photos.story[i]}
                  alt={`${m.year}: ${m.title}`}
                  className="fill-photo"
                  sizes="45vw"
                />
                <span className="story-photo-index">0{i + 1} / 04</span>
              </div>
            ))}
          </div>
          <p className="story-footnote">The little moments that led us here.</p>
        </div>
        <div className="story-chapters">
          <div className="story-rail">
            <span className="story-rail-fill" />
          </div>
          {story.milestones.map((m, i) => (
            <article className="story-milestone" key={m.year}>
              <span className="story-dot" />
              <div className="story-copy">
                <p className="story-year">{m.year}</p>
                <h3>{m.title}</h3>
                <p>{notes[i]}</p>
              </div>
              <Photo
                src={photos.story[i]}
                alt={m.title}
                className="story-mobile-photo"
                sizes="90vw"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
