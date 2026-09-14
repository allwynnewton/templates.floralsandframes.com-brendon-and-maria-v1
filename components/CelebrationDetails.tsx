'use client';
import Photo from './Photo';
import Reveal from './Reveal';
import WeddingCountdown from './WeddingCountdown';
import { wedding, photos } from '@/lib/site';
export default function CelebrationDetails() {
  return (
    <section className="celebration-section" id="details" data-music-vol="0.3">
      <Reveal className="section-heading">
        <p className="eyebrow">With joy, we invite you</p>
        <h2>
          The <em>celebration</em>
        </h2>
        <p className="story-intro">
          From a sacred promise to an evening of laughter.
          <br />
          We would love to have you beside us.
        </p>
      </Reveal>
      <div className="venue-grid">
        <Reveal className="venue-card">
          <div className="venue-image">
            <Photo
              src="/images/church-poster.jpg"
              alt="The church in our invitation film"
              className="fill-photo"
              sizes="(max-width:768px) 90vw, 45vw"
            />
            <span className="eyebrow">01 · The vows</span>
          </div>
          <div className="venue-content">
            <p className="eyebrow">
              {wedding.day} · {wedding.ceremony.time}
            </p>
            <h3>{wedding.ceremony.venue}</h3>
            <p>{wedding.ceremony.title}</p>
            <p>{wedding.ceremony.place}</p>
            <a
              className="btn-ghost"
              href={wedding.ceremony.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ceremony directions ↗
            </a>
          </div>
        </Reveal>
        <Reveal className="venue-card" delay={0.12}>
          <div className="venue-image">
            <Photo
              src={photos.reception}
              alt="An evening celebration under warm lights"
              className="fill-photo"
              sizes="(max-width:768px) 90vw, 45vw"
            />
            <span className="eyebrow">02 · The joy</span>
          </div>
          <div className="venue-content">
            <p className="eyebrow">
              {wedding.day} · {wedding.reception.time}
            </p>
            <h3>{wedding.reception.venue}</h3>
            <p>{wedding.reception.note}</p>
            <p>{wedding.reception.resort}</p>
            <a
              className="btn-ghost"
              href={wedding.reception.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reception directions ↗
            </a>
          </div>
        </Reveal>
      </div>
      <Reveal className="guest-notes">
        <div className="guest-note">
          <h3>A little dressed up</h3>
          <p>
            Formal or Indian formal.
            <br />
            Warm ivory and earthen tones are welcome.
          </p>
        </div>
        <div className="guest-note">
          <h3>Stay a little longer</h3>
          <p>The Heritage Resort offers preferred guest rates. Mention “Brendon & Maria”.</p>
        </div>
        <div className="guest-note">
          <h3>We’ll get you there</h3>
          <p>The shuttle leaves the resort at 3:15 PM, with a return after the reception.</p>
        </div>
      </Reveal>
      <WeddingCountdown />
    </section>
  );
}
