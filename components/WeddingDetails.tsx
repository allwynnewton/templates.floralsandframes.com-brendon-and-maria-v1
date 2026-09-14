'use client';

import Reveal from './Reveal';
import AddToCalendar from './AddToCalendar';
import { details, dressSwatches } from '@/lib/site';

export default function WeddingDetails() {
  return (
    <section
      id="details"
      className="scroll-mt-6 bg-blush px-6 py-32 text-ink md:py-48"
      data-music-vol="0.3"
    >
      <Reveal className="mb-20 text-center">
        <p className="eyebrow text-mauve">Everything you need to know</p>
        <h2 className="display-lg mt-6 text-ink">THE DETAILS</h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {details.map((d, i) => (
          <Reveal key={d.title} delay={(i % 3) * 0.08} className="border-t border-ink/15 pt-6">
            <h3 className="font-display text-2xl text-ink md:text-3xl">{d.title}</h3>
            <div className="mt-4 space-y-1">
              {d.lines.map((l, j) => (
                <p key={j} className="font-sans text-sm leading-relaxed text-ink/70">
                  {l}
                </p>
              ))}
            </div>

            {d.title === 'Dress Code' && (
              <div className="mt-5 flex gap-2">
                {dressSwatches.map((c) => (
                  <span
                    key={c}
                    className="h-6 w-6 rounded-full ring-1 ring-charcoal/10"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            )}
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20 flex justify-center">
        <AddToCalendar />
      </Reveal>
    </section>
  );
}
