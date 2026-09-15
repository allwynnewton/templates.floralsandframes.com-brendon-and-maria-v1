'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { couple, wedding, photos } from '@/lib/site';
import Photo from './Photo';
import InvitationDecor from './InvitationDecor';
const RingPortal = dynamic(() => import('./RingPortal'), { ssr: false });
export default function OpeningSequence() {
  const root = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    video = useRef<HTMLVideoElement>(null);
  const [introDone, setIntroDone] = useState(false),
    [failed, setFailed] = useState(false);
  const finish = useCallback(() => setIntroDone(true), []);
  useEffect(() => {
    if (introDone) return;
    const html = document.documentElement,
      prev = html.style.overflow;
    html.style.overflow = 'hidden';
    const timeout = setTimeout(finish, 14000);
    return () => {
      clearTimeout(timeout);
      html.style.overflow = prev;
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
  }, [introDone, finish]);
  useGSAP(
    () => {
      const el = video.current;
      if (!el || !introDone) return;
      const mm = gsap.matchMedia();
      let built = false;
      let seekTarget = 0;
      const seek = () => {
        if (el.readyState >= 1 && !el.seeking && Math.abs(el.currentTime - seekTarget) > 0.035) {
          try {
            el.currentTime = seekTarget;
          } catch {}
        }
      };
      el.addEventListener('seeked', seek);
      const build = () => {
        if (built || !Number.isFinite(el.duration)) return;
        built = true;
        el.pause();
        mm.add('(prefers-reduced-motion: no-preference)', () => {
          const q = gsap.utils.selector(root);
          const progress = { time: 0 };
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root.current,
              refreshPriority: 10,
              start: 'top top',
              end: () => innerHeight * (innerWidth < 768 ? 3 : 3.6),
              pin: stage.current,
              scrub: 0.65,
              invalidateOnRefresh: true,
              anticipatePin: 1,
            },
          });
          tl.to(
            progress,
            {
              time: Math.max(0, el.duration - 0.08),
              duration: 7,
              ease: 'none',
              onUpdate: () => {
                seekTarget = progress.time;
                seek();
              },
            },
            0,
          )
            .to(q('.film-heading'), { opacity: 0, y: -25, duration: 1 }, 1.4)
            .fromTo(q('.film-promise'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, 3)
            .to(q('.film-promise'), { opacity: 0, duration: 0.7 }, 5)
            .fromTo(
              q('.opening-invitation'),
              { clipPath: 'inset(50% 42% 50% 42% round 46% 46% 0 0)', opacity: 0 },
              {
                clipPath: 'inset(0% 0% 0% 0% round 0%)',
                opacity: 1,
                duration: 2,
                ease: 'power2.inOut',
              },
              6,
            )
            .fromTo(
              q('.flourish-path'),
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut', stagger: 0.25 },
              6.7,
            )
            .fromTo(
              q('.invitation-copy > *'),
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, stagger: 0.12, duration: 1 },
              7.1,
            )
            .fromTo(
              q('.invitation-aside'),
              { autoAlpha: 0, y: 16 },
              { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.18, ease: 'power2.out' },
              7.4,
            )
            .to(q('.film-scroll'), { opacity: 0, duration: 0.4 }, 7)
            .to({}, { duration: 1.2 });
          return () => tl.kill();
        });
        mm.add('(prefers-reduced-motion: reduce)', () => {
          gsap.set('.opening-invitation', { opacity: 1, clipPath: 'none' });
        });
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      };
      if (el.readyState >= 1) build();
      else el.addEventListener('loadedmetadata', build, { once: true });
      // Muted priming unlocks frame seeking on touch browsers. Never starts sound.
      el.play()
        .then(() => el.pause())
        .catch(() => {});
      const timeout = setTimeout(() => {
        if (!built) setFailed(true);
      }, 12000);
      return () => {
        clearTimeout(timeout);
        el.pause();
        el.removeEventListener('loadedmetadata', build);
        el.removeEventListener('seeked', seek);
        mm.revert();
      };
    },
    { scope: root, dependencies: [introDone] },
  );
  return (
    <section ref={root} className="opening-sequence" aria-label="Our wedding invitation">
      <div ref={stage} className="opening-stage">
        <video
          ref={video}
          className="opening-film"
          muted
          playsInline
          preload="auto"
          poster="/images/church-poster.jpg"
          onError={() => setFailed(true)}
        >
          <source src="/videos/church-cinematic.mp4" type="video/mp4" />
        </video>
        <div className="film-shade" />
        <div className="film-heading">
          <p className="eyebrow">The sacrament of</p>
          <h1>
            Holy <em>Matrimony</em>
          </h1>
          <p className="film-subtitle">Two hearts, held in His grace.</p>
        </div>
        <p className="film-promise">
          By His grace,
          <br />
          <em>our forever begins.</em>
        </p>
        <div className={`opening-invitation ${failed ? 'film-fallback' : ''}`}>
          <div className="invitation-halo" />
          <InvitationDecor />
          <Photo
            src={photos.invitation}
            alt="Brendon and Maria together on their wedding day"
            priority
            className="invitation-photo"
            sizes="(max-width:768px) 84vw, 42vw"
          />
          <div className="invitation-copy">
            <p className="eyebrow">Together with their families</p>
            <h2>
              {couple.groom}
              <span>&</span>
              {couple.bride}
            </h2>
            <p className="invitation-message">invite you to celebrate their wedding</p>
            <p className="invitation-date">28 · December · 2026</p>
            <p className="eyebrow">{wedding.city}</p>
          </div>
        </div>
        <div className="film-scroll">
          <span />
          Scroll to unfold our story
        </div>
        {!introDone && <div className="opening-cover" aria-hidden />}
        {!introDone && <RingPortal onDone={finish} />}
      </div>
    </section>
  );
}
