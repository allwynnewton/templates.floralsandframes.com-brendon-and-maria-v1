// 'use client';
// import { useRef } from 'react';
// import { gsap, useGSAP } from '@/lib/gsap';
// import { wedding } from '@/lib/site';
// import AddToCalendar from './AddToCalendar';
// export default function WeddingDate() {
//   const root = useRef<HTMLElement>(null);
//   useGSAP(
//     () => {
//       const mm = gsap.matchMedia();
//       mm.add('(prefers-reduced-motion: no-preference)', () => {
//         gsap.from('.date-composition', {
//           opacity: 0,
//           y: 40,
//           scale: 0.96,
//           duration: 1.5,
//           ease: 'power3.out',
//           scrollTrigger: { trigger: root.current, start: 'top 70%' },
//         });
//       });
//       return () => mm.revert();
//     },
//     { scope: root },
//   );
//   return (
//     <section ref={root} className="date-section">
//       <div className="date-composition">
//         <p className="eyebrow">Together with our families</p>
//         <h2>
//           A day for <em>forever</em>
//         </h2>
//         <div className="date-lockup" aria-label="28 December 2026">
//           <span className="date-day">28</span>
//           <span className="date-month">December</span>
//           <span className="date-year">2026</span>
//         </div>
//         <p className="date-time">
//           {wedding.day} <span>✧</span> {wedding.time} <span>✧</span> Goa, India
//         </p>
//         <AddToCalendar />
//       </div>
//     </section>
//   );
// }


'use client';

import Image from 'next/image';
import { useRef } from 'react';

import { gsap, useGSAP } from '@/lib/gsap';
import AddToCalendar from './AddToCalendar';

export default function WeddingDate() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        '(prefers-reduced-motion: no-preference)',
        () => {
          gsap
            .timeline({
              scrollTrigger: {
                trigger: root.current,
                start: 'top 72%',
              },
            })
            .fromTo(
              '.wedding-card-image',
              {
                autoAlpha: 0,
                y: 65,
                scale: 0.94,
                rotateX: 4,
              },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                duration: 1.6,
                ease: 'power3.out',
              },
            )
            .fromTo(
              '.wedding-card-actions',
              {
                autoAlpha: 0,
                y: 24,
              },
              {
                autoAlpha: 1,
                y: 0,
                duration: 1,
                ease: 'power3.out',
              },
              '-=0.6',
            );
        },
      );

      return () => mm.revert();
    },
    {
      scope: root,
    },
  );

  return (
    <section
      ref={root}
      className="wedding-card-section"
    >
      <div
        className="wedding-card-glow wedding-card-glow-left"
        aria-hidden
      />

      <div
        className="wedding-card-glow wedding-card-glow-right"
        aria-hidden
      />

      <div className="wedding-card-layout">
        <div className="wedding-card-image">
          <Image
            src="/images/card.png"
            alt="Wedding invitation for Brendon and Maria on Monday, 28 December 2026 at 4 PM in Goa"
            width={1024}
            height={1536}
            sizes="(max-width: 768px) 92vw, 660px"
            unoptimized
          />
        </div>

        <div className="wedding-card-actions">
          <p className="wedding-card-action-copy">
            Keep our day close
          </p>

          <AddToCalendar />
        </div>
      </div>
    </section>
  );
}