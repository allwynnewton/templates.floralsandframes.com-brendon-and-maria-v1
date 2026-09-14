'use client';
import { useRef, useEffect } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
export default function ScriptureIntro() {
  const root = useRef<HTMLElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.verse-line', {
          y: 36,
          opacity: 0,
          stagger: 0.18,
          duration: 1.3,
          ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 65%' },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  useEffect(() => {
    const el = root.current,
      c = canvas.current;
    if (!el || !c || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let w = 0,
      h = 0,
      frame = 0,
      active = false,
      start = 0,
      swept = false;
    type Dust = { x: number; y: number; vx: number; vy: number; life: number; size: number };
    let dust: Dust[] = [];
    const resize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const emit = (x: number, y: number, n = 4) => {
      for (let i = 0; i < n; i++)
        dust.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 1.7,
          life: 1,
          size: 1 + Math.random() * 3,
        });
      if (dust.length > 200) dust = dust.slice(-200);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (active) emit(e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener('pointermove', move);
    let last = 0;
    const draw = (time: number) => {
      if (!active) return;
      const dt = Math.min((time - last) / 16.67, 2) || 1;
      last = time;
      ctx.clearRect(0, 0, w, h);
      if (start && time - start < 2000) {
        const p = (time - start) / 2000;
        emit(w * (0.2 + 0.6 * p), h * 0.5 + Math.sin(p * Math.PI * 2) * 26, 2);
      }
      dust = dust.filter((p) => p.life > 0);
      for (const p of dust) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= 0.018 * dt;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.size > 3 ? '#ebd19b' : '#b28b43';
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        active = e.isIntersecting;
        cancelAnimationFrame(frame);
        if (active) {
          if (!swept) {
            start = performance.now();
            swept = true;
          }
          last = performance.now();
          frame = requestAnimationFrame(draw);
        } else {
          dust = [];
          ctx.clearRect(0, 0, w, h);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      el.removeEventListener('pointermove', move);
    };
  }, []);
  return (
    <section ref={root} className="scripture-section">
      <span className="fineline-cross verse-line" aria-hidden />
      <p className="eyebrow verse-line">Written in grace</p>
      <blockquote>
        <p className="verse-line">And now these three remain:</p>
        <p className="verse-line verse-virtues">
          faith, hope <span>&</span> love.
        </p>
        <p className="verse-line">
          But the greatest of these is <em>love.</em>
        </p>
      </blockquote>
      <p className="eyebrow verse-line">1 Corinthians 13:13</p>
      <canvas ref={canvas} className="gold-dust" aria-hidden />
    </section>
  );
}
