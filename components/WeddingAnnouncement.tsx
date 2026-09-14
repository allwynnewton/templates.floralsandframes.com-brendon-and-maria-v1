'use client';

import Reveal from './Reveal';
import { couple } from '@/lib/site';

export default function WeddingAnnouncement() {
  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center bg-blush px-6 py-40 text-ink">
      <Reveal className="text-center">
        <p className="eyebrow text-mauve">With gratitude to God</p>
        <p className="eyebrow mt-2 text-mauve">and joy in our hearts</p>
      </Reveal>

      <Reveal delay={0.15} className="my-12 flex flex-col items-center">
        <h2 className="display-xl leading-[0.9] text-ink">{couple.groom.toUpperCase()}</h2>
        <span className="font-script my-2 text-5xl text-mauve md:text-7xl">&amp;</span>
        <h2 className="display-xl leading-[0.9] text-ink">{couple.bride.toUpperCase()}</h2>
      </Reveal>

      <Reveal delay={0.25} className="flex flex-col items-center text-center">
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px w-16 bg-champagne/50" />
          <span className="fineline-cross" aria-hidden />
          <span className="h-px w-16 bg-champagne/50" />
        </div>
        <p className="max-w-md font-serif-e text-xl leading-relaxed text-ink/75 md:text-2xl">
          request the pleasure of your company as they exchange their wedding vows
        </p>
      </Reveal>
    </section>
  );
}
