'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { gsap } from '@/lib/gsap';
import { music } from '@/lib/site';

/**
 * MusicProvider
 * -------------
 * One global <audio> for the whole experience. Mounted once, high in the tree,
 * so section rerenders and ScrollTriggers never recreate or restart it.
 *
 * - No autoplay with sound. Playback is only ever started from a user gesture
 *   (the entry gate or the toggle), satisfying mobile Safari / all browsers.
 * - Volume is faded with GSAP (never hard-cut). No per-frame React state, no
 *   timeupdate listeners.
 */

type MusicContextValue = {
  hasEntered: boolean;
  musicEnabled: boolean;
  isPlaying: boolean;
  /** Called from the opening gate's click handler. */
  enter: (withMusic: boolean) => void;
  /** Toggle from the persistent control (fades out+pause / play+fade in). */
  toggle: () => void;
  /** Optional cinematic ducking: set the active target volume for a zone. */
  setZoneVolume: (v: number) => void;
  /** Restore the base volume when leaving a zone. */
  resetZoneVolume: () => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within <MusicProvider>');
  return ctx;
}

export default function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<gsap.core.Tween | null>(null);
  const targetVol = useRef(music.baseVolume); // current "intended" volume (base or zone)

  const [hasEntered, setHasEntered] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const fadeTo = useCallback(
    (value: number, duration: number, pauseAtEnd = false) => {
      const a = audioRef.current;
      if (!a) return;
      fadeRef.current?.kill();
      fadeRef.current = gsap.to(a, {
        volume: value,
        duration,
        ease: 'sine.inOut',
        onComplete: () => {
          if (pauseAtEnd) a.pause();
        },
      });
    },
    [],
  );

  // Start playback FROM a user gesture, at ~0 volume, then swell.
  const startPlayback = useCallback(
    (fadeDuration: number) => {
      const a = audioRef.current;
      if (!a) return;
      fadeRef.current?.kill();
      a.volume = 0;
      const p = a.play();
      const onOk = () => {
        setIsPlaying(true);
        setMusicEnabled(true);
        fadeTo(targetVol.current, fadeDuration);
      };
      if (p && typeof p.then === 'function') {
        p.then(onOk).catch(() => {
          // Blocked (rare, since we're inside a gesture). Reflect intent so the
          // toggle can retry later.
          setMusicEnabled(true);
          setIsPlaying(false);
        });
      } else {
        onOk();
      }
    },
    [fadeTo],
  );

  const enter = useCallback(
    (withMusic: boolean) => {
      setHasEntered(true);
      try {
        sessionStorage.setItem('cb-music', withMusic ? 'on' : 'off');
      } catch {
        /* ignore */
      }
      if (withMusic) {
        // Called synchronously within the click handler — keep play() first.
        startPlayback(2.6);
      }
    },
    [startPlayback],
  );

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      // gentle fade out, then pause — never a hard cut
      fadeTo(0, 0.8, true);
      setIsPlaying(false);
      setMusicEnabled(false);
      try {
        sessionStorage.setItem('cb-music', 'off');
      } catch {
        /* ignore */
      }
    } else {
      startPlayback(1.2);
      try {
        sessionStorage.setItem('cb-music', 'on');
      } catch {
        /* ignore */
      }
    }
  }, [isPlaying, fadeTo, startPlayback]);

  const setZoneVolume = useCallback(
    (v: number) => {
      targetVol.current = v;
      if (isPlaying) fadeTo(v, 1.4);
    },
    [isPlaying, fadeTo],
  );

  const resetZoneVolume = useCallback(() => {
    targetVol.current = music.baseVolume;
    if (isPlaying) fadeTo(music.baseVolume, 1.4);
  }, [isPlaying, fadeTo]);

  // Tab visibility: never override an explicit pause; only resume if the user
  // wanted music and the browser suspended it. Only one <audio> ever exists.
  useEffect(() => {
    const onVis = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.visibilityState === 'visible' && musicEnabled && isPlaying && a.paused) {
        a.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [musicEnabled, isPlaying]);

  useEffect(() => () => { fadeRef.current?.kill(); }, []);

  return (
    <MusicContext.Provider
      value={{ hasEntered, musicEnabled, isPlaying, enter, toggle, setZoneVolume, resetZoneVolume }}
    >
      {/* The single, global audio source. No controls, not autoplaying. */}
      <audio ref={audioRef} src={music.src} preload="metadata" loop aria-hidden />
      {children}
    </MusicContext.Provider>
  );
}
