'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { gsap } from '@/lib/gsap';
import { music } from '@/lib/site';

type MusicContextValue = {
  hasEntered: boolean;
  isPlaying: boolean;
  enter: (withMusic: boolean) => void;
  toggle: () => void;
  setZoneVolume: (volume: number) => void;
  resetZoneVolume: () => void;
};

const MusicContext =
  createContext<MusicContextValue | null>(null);

export function useMusic() {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error(
      'useMusic must be used inside MusicProvider',
    );
  }

  return context;
}

export default function MusicProvider({
  children,
}: {
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const targetVolumeRef = useRef(music.baseVolume);

  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const fadeTo = useCallback(
    (
      volume: number,
      duration = 1.2,
      pauseAfterFade = false,
    ) => {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      gsap.killTweensOf(audio);

      gsap.to(audio, {
        volume,
        duration,
        ease: 'sine.inOut',
        overwrite: true,
        onComplete: () => {
          if (pauseAfterFade) {
            audio.pause();
          }
        },
      });
    },
    [],
  );

  const startMusic = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    /*
     * play() runs directly inside the visitor's button click.
     * This satisfies mobile Safari and Chrome autoplay rules.
     */
    audio.volume = 0;

    const playRequest = audio.play();

    if (playRequest) {
      playRequest
        .then(() => {
          setIsPlaying(true);

          fadeTo(
            targetVolumeRef.current,
            1.8,
          );
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [fadeTo]);

  const stopMusic = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    setIsPlaying(false);
    fadeTo(0, 0.7, true);
  }, [fadeTo]);

  const enter = useCallback(
    (withMusic: boolean) => {
      /*
       * This function must be called synchronously by the
       * "Enter with music" button.
       */
      setHasEntered(true);

      if (withMusic) {
        startMusic();
      }
    },
    [startMusic],
  );

  const toggle = useCallback(() => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  }, [isPlaying, startMusic, stopMusic]);

  const setZoneVolume = useCallback(
    (volume: number) => {
      const safeVolume = Math.max(
        0,
        Math.min(1, volume),
      );

      targetVolumeRef.current = safeVolume;

      if (isPlaying) {
        fadeTo(safeVolume, 1.4);
      }
    },
    [fadeTo, isPlaying],
  );

  const resetZoneVolume = useCallback(() => {
    targetVolumeRef.current = music.baseVolume;

    if (isPlaying) {
      fadeTo(music.baseVolume, 1.4);
    }
  }, [fadeTo, isPlaying]);

  return (
    <MusicContext.Provider
      value={{
        hasEntered,
        isPlaying,
        enter,
        toggle,
        setZoneVolume,
        resetZoneVolume,
      }}
    >
      <audio
        ref={audioRef}
        src={music.src}
        preload="auto"
        loop
        playsInline
        aria-hidden
        onPlaying={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {children}
    </MusicContext.Provider>
  );
}