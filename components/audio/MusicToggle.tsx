'use client';

import { useMusic } from './MusicProvider';

export default function MusicToggle() {
  const {
    hasEntered,
    isPlaying,
    toggle,
  } = useMusic();

  if (!hasEntered) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="music-control"
      aria-label={
        isPlaying
          ? 'Stop background music'
          : 'Play background music'
      }
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <span className="wave" aria-hidden>
          <span
            className="wave-bar"
            style={{
              animationDuration: '0.8s',
            }}
          />

          <span
            className="wave-bar"
            style={{
              animationDuration: '1s',
            }}
          />

          <span
            className="wave-bar"
            style={{
              animationDuration: '0.7s',
            }}
          />
        </span>
      ) : (
        <span
          className="music-note"
          aria-hidden
        >
          ♪
        </span>
      )}
    </button>
  );
}