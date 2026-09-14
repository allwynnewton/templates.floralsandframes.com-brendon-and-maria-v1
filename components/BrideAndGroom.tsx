'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { couple, photos } from '@/lib/site';
import Photo from './Photo';
import Reveal from './Reveal';
export default function BrideAndGroom() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.portrait-frame', {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.7,
          stagger: 0.15,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 55%' },
        });
        gsap.from('.portrait-amp', {
          opacity: 0,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 42%' },
        });
        gsap.from('.portrait-name', {
          y: 25,
          opacity: 0,
          duration: 1.2,
          stagger: 0.15,
          scrollTrigger: { trigger: '.portrait-grid', start: 'top 35%' },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="couple-section">
      <Reveal className="section-heading">
        <p className="eyebrow">Two hearts · One covenant</p>
        <h2>
          Where you go,
          <br />
          <em>I will go.</em>
        </h2>
        <p className="eyebrow">Ruth 1:16</p>
      </Reveal>
      <div className="portrait-grid">
        {[
          { name: couple.bride, role: 'Bride-to-be', src: photos.bride },
          { name: couple.groom, role: 'Groom-to-be', src: photos.groom },
        ].map((p) => (
          <figure key={p.role}>
            <div className="portrait-frame">
              <Photo
                src={p.src}
                alt={`${p.name}, ${p.role}`}
                className="portrait-photo"
                sizes="(max-width:768px) 80vw, 35vw"
              />
            </div>
            <figcaption className="portrait-name">
              <h3>{p.name}</h3>
              <p className="eyebrow">{p.role}</p>
            </figcaption>
          </figure>
        ))}
        <span className="portrait-amp" aria-hidden>
          &
        </span>
      </div>
      <Reveal className="couple-covenant">
        <p>Two lives. Two families. One beautiful promise.</p>
        <span className="hairline" />
      </Reveal>
    </section>
  );
}
