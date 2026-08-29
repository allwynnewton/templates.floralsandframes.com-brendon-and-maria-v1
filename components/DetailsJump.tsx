'use client';

import { useMusic } from '@/components/audio/MusicProvider';

/**
 * DetailsJump — a small floating pill (top-right) that jumps straight to the
 * wedding details (date · venues · map · add-to-calendar), so a guest who just
 * wants the logistics never has to scroll the whole film. Appears only after
 * the visitor has entered.
 */
export default function DetailsJump() {
  const { hasEntered } = useMusic();
  if (!hasEntered) return null;

  const jump = () => {
    const el = document.getElementById('details');
    if (el) el.scrollIntoView({ block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={jump}
      aria-label="Jump to the wedding details"
      className="fixed right-4 top-4 z-40 rounded-full border border-ink/15 bg-blush/85 px-4 py-2 text-[0.68rem] uppercase tracking-[0.2em] text-ink/70 shadow-sm backdrop-blur transition-colors hover:text-mauve md:right-6 md:top-6"
    >
      The Details ↓
    </button>
  );
}
