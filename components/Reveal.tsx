'use client';

import { ElementType, ReactNode, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Reveal — a gentle, weighted fade+rise as an element scrolls into view.
 * Honours prefers-reduced-motion via gsap.matchMedia (renders final state).
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  className,
  y = 28,
  delay = 0,
  duration = 1.1,
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  y?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(ref.current, { autoAlpha: 1, y: 0 });
      });

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(ref.current, { autoAlpha: 0, y });
        gsap.to(ref.current, {
          autoAlpha: 1,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 82%',
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
