'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { photos, couple } from '@/lib/site';
export default function FinalBlessing() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.closing-photo', {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
        gsap.from('.closing-copy > *', {
          y: 25,
          opacity: 0,
          stagger: 0.2,
          duration: 1.3,
          scrollTrigger: { trigger: root.current, start: 'top 60%' },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="closing-section" data-music-vol="0.25">
      <div className="closing-photo">
        <Photo
          src={photos.farewell}
          alt="The couple walking together into the evening"
          className="fill-photo"
        />
      </div>
      <div className="closing-shade" />
      <div className="closing-copy">
        <h2>
          With grateful hearts,<em>and all our love.</em>
        </h2>
        <p>
          Thank you for being part of our story.
          <br />
          We cannot wait to celebrate with you.
        </p>
        <p className="closing-signature">
          {couple.groom} & {couple.bride}
        </p>
      </div>
    </section>
  );
}
