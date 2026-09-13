'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { photos, scriptures } from '@/lib/site';
import s from './scripture-approach.module.css';

export default function ScriptureApproach() {
  const section = useRef<HTMLElement>(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      desktop: '(min-width: 768px)',
      mobile: '(max-width: 767px)',
      reduce: '(prefers-reduced-motion: reduce)',
    }, context => {
      if (context.conditions?.reduce) return;
      const mobile = context.conditions?.mobile;
      const scene = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          id: 'scripture-approach',
          trigger: section.current,
          start: 'top 90%',
          end: 'top 5%',
          scrub: .45,
          invalidateOnRefresh: true,
        },
      });
      // Reveal the aperture, without changing layout width or distorting the photo.
      scene.fromTo('[data-altar-frame]', {
        clipPath: `inset(0% ${mobile ? 5 : 11}% 0% ${mobile ? 5 : 11}% round 50% 50% 0% 0%)`,
        opacity: .55,
      }, { clipPath: 'inset(0% 0% 0% 0% round 50% 50% 0% 0%)', opacity: 1, duration: .8 }, 0);
      scene.fromTo('[data-altar-image]', { scale: 1, yPercent: mobile ? .4 : 1 }, {
        scale: mobile ? 1.03 : 1.065, yPercent: mobile ? -.4 : -1, duration: 1,
      }, 0);
      // Reveal the entire passage together, never words or individual lines.
      // Even the initial tone is readable; neither text nor cross moves.
      scene.fromTo('[data-scripture-passage]', { opacity: .78 }, { opacity: 1, duration: .35 }, .08);
    });
    return () => media.revert();
  }, { scope: section });

  return <section ref={section} id="scripture" className={s.section} aria-label="Scripture">
    <div className={s.inner}>
      <figure className={s.figure}>
        <div className={s.arch} data-altar-frame>
          <div className={s.image} data-altar-image>
            <Image src={photos.scripture} alt="An illustrative Catholic church interior, looking along the central aisle toward the altar" fill sizes="(max-width: 767px) 82vw, 440px" />
          </div>
          <div className={s.light} aria-hidden="true" />
        </div>
        <figcaption>Illustrative church interior</figcaption>
      </figure>
      <div className={s.reading}>
        <svg className={s.cross} viewBox="0 0 20 30" aria-hidden="true" focusable="false"><path d="M10 1v28M2 10h16" /></svg>
        <div data-scripture-passage>
          <blockquote>“{scriptures.love.lines.join(' ')}”</blockquote>
          <p className={s.citation}>{scriptures.love.ref}</p>
        </div>
      </div>
    </div>
  </section>;
}
