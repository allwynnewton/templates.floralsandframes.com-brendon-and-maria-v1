'use client';

import { useEffect } from 'react';
import { useMusic } from './MusicProvider';

/**
 * VolumeAutomation — very subtle cinematic ducking, all in one place.
 * Reads `data-music-vol="<0..1>"` off a few section roots and fades the base
 * volume when they're in view (e.g. church swell 0.48, info sections 0.30,
 * final blessing 0.25). No effect on which audio element exists, no per-frame
 * state, no timeupdate. Leaving all zones restores the base volume.
 */
export default function VolumeAutomation() {
  const { setZoneVolume, resetZoneVolume } = useMusic();

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-music-vol]'));
    if (!nodes.length) return;

    const visible = new Map<HTMLElement, number>(); // el -> intersectionRatio
    let applied = -1;

    const apply = () => {
      let bestVol = -1;
      let bestRatio = 0;
      for (const [el, ratio] of visible) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestVol = parseFloat(el.dataset.musicVol || '0.4');
        }
      }
      if (bestVol >= 0) {
        if (bestVol !== applied) {
          applied = bestVol;
          setZoneVolume(bestVol);
        }
      } else if (applied !== -1) {
        applied = -1;
        resetZoneVolume();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio > 0.35) {
            visible.set(e.target as HTMLElement, e.intersectionRatio);
          } else {
            visible.delete(e.target as HTMLElement);
          }
        }
        apply();
      },
      { threshold: [0, 0.35, 0.6, 0.9] },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [setZoneVolume, resetZoneVolume]);

  return null;
}
