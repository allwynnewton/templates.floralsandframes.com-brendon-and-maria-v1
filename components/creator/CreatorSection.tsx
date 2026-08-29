'use client';

import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { creator, whatsappEnquiryUrl } from '@/lib/site';

/**
 * CreatorSection — the closing creator credit, like the end of a wedding film.
 * Customer-focused CTA first; the business identity sits quietly underneath.
 * Understated by design — no business footer, logos, or green buttons.
 */
export default function CreatorSection() {
  const url = whatsappEnquiryUrl();

  return (
    <section className="bg-blush px-6 pb-40 pt-24 text-center">
      <div className="mx-auto max-w-2xl">
        <div className="hairline mx-auto mb-20 w-24" aria-hidden />

        <Reveal>
          <p className="eyebrow text-mauve">Loved this experience?</p>
          <h2 className="font-display mt-7 text-3xl leading-tight text-ink md:text-5xl">
            Your wedding deserves more than
            <br />
            just another invitation.
          </h2>
          <p className="mt-6 font-serif-e text-lg text-ink/70 md:text-xl">
            Turn your story into an experience.
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost mt-10 text-ink"
          >
            Create Your Wedding Website →
          </a>
        </Reveal>

        {/* Creator credit — brand emphasised, contact quiet */}
        <Reveal delay={0.15} className="mt-28 flex flex-col items-center gap-3">
          <Image
            src={creator.logo}
            alt={`${creator.brand} logo`}
            width={354}
            height={412}
            className="mb-6 h-28 w-auto md:h-32"
          />
          <p className="eyebrow text-ink/45">A digital love story by</p>
          <p className="font-display text-3xl text-mauve md:text-4xl">
            {creator.brand}
          </p>
          <p className="font-serif-e text-base text-ink/60">{creator.tagline}</p>

          <div className="mt-6 flex flex-col items-center gap-1.5">
            <p className="eyebrow text-ink/50">{creator.location}</p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-ink/55 transition-colors hover:text-mauve"
            >
              WhatsApp · {creator.whatsappDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
