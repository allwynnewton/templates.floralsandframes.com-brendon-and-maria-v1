'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import Reveal from './Reveal';
import { photos } from '@/lib/site';
export default function MemoryGallery() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.gallery-grid figure').forEach((el, i) => {
          gsap.from(el, {
            y: 50,
            opacity: 0,
            clipPath: i % 2 ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)',
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="gallery-section">
      <Reveal className="section-heading">
        <p className="eyebrow">Collected with love</p>
        <h2>
          Little moments,<em>lasting memories.</em>
        </h2>
      </Reveal>
      <div className="gallery-grid">
        {photos.memory.map((src, i) => (
          <figure key={src}>
            <Photo
              src={src}
              alt={
                [
                  'Together at the altar',
                  'Hands joined in a promise',
                  'A favourite memory together',
                  'A quiet wedding-day detail',
                  'Wedding rings resting on the Bible',
                ][i]
              }
              className="fill-photo"
              sizes="(max-width:768px) 80vw, 35vw"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
