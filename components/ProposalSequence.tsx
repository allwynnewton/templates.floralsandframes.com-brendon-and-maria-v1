'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { photos, proposal } from '@/lib/site';
export default function ProposalSequence() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top 65%' } })
          .from(q('.proposal-title > *'), { y: 30, opacity: 0, stagger: 0.15, duration: 1 })
          .from(
            q('.proposal-card'),
            {
              y: 75,
              rotate: (i) => (i === 0 ? -7 : 7),
              opacity: 0,
              stagger: 0.2,
              duration: 1.5,
              ease: 'power3.out',
            },
            0.3,
          )
          .from(q('.proposal-stroke'), { scaleX: 0, duration: 1.2 }, 0.7);
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="proposal-section">
      <div className="proposal-title">
        <p className="eyebrow">Chapter two · The promise</p>
        <p className="proposal-then">And then…</p>
        <h2>
          she said <em>yes.</em>
        </h2>
        <span className="proposal-stroke" />
      </div>
      <div className="proposal-photos">
        {photos.proposal.map((src, i) => (
          <figure key={src} className={`proposal-card proposal-card-${i}`}>
            <Photo
              src={src}
              alt={
                i === 0 ? 'A ring, and a question waiting to be asked' : 'The promise of forever'
              }
              className="proposal-photo"
              sizes="(max-width:768px) 84vw, 38vw"
            />
            <figcaption>
              <span className="eyebrow">
                0{i + 1} · {i === 0 ? 'The question' : 'The answer'}
              </span>
              <p>{proposal.captions[i]}</p>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="proposal-note">One little word. A whole lifetime.</p>
    </section>
  );
}
