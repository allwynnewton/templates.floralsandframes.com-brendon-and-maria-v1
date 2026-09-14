'use client';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import Photo from './Photo';
import { photos } from '@/lib/site';
export default function ParallaxMemories() {
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.chapter-scene').forEach((scene) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: scene, start: 'top 85%', end: 'top 5%', scrub: 0.7 },
          });
          tl.fromTo(
            scene.querySelector('.chapter-image'),
            { clipPath: 'inset(12% 17% 12% 17% round 40% 40% 0 0)' },
            { clipPath: 'inset(0% 0% 0% 0% round 0% 0% 0 0)', ease: 'none' },
          ).fromTo(
            scene.querySelectorAll('.chapter-caption > *'),
            { y: 55, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.15 },
            0.2,
          );
          gsap.fromTo(
            scene.querySelector('img'),
            { scale: 1.14 },
            {
              scale: 1,
              yPercent: 4,
              ease: 'none',
              scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 0.7 },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <section ref={root} className="chapters-section">
      <article className="chapter-scene">
        <div className="chapter-image">
          <Photo
            src={photos.parallax[1]}
            alt="A quiet moment shared by the couple"
            className="fill-photo"
          />
          <div className="chapter-shade" />
        </div>
        <div className="chapter-caption">
          <p className="eyebrow">Every love story is beautiful</p>
          <h2>
            But this one
            <br />
            <em>is ours.</em>
          </h2>
          <span className="chapter-number">I</span>
        </div>
      </article>
      <article className="chapter-scene chapter-next">
        <div className="chapter-image">
          <Photo
            src={photos.parallax[2]}
            alt="Brendon and Maria looking toward their future"
            className="fill-photo"
          />
          <div className="chapter-shade" />
        </div>
        <div className="chapter-caption">
          <p className="eyebrow">And with you beside me</p>
          <h2>
            Our favourite chapter
            <br />
            <em>begins here.</em>
          </h2>
          <span className="chapter-number">II</span>
        </div>
      </article>
    </section>
  );
}
