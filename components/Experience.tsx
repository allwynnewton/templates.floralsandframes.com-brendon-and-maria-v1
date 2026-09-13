'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { couple, wedding, story, photos, details, creator, whatsappEnquiryUrl } from '@/lib/site';
import AddToCalendar from './AddToCalendar';
import RSVPSection from './RSVPSection';
import MusicToggle from './audio/MusicToggle';
import WeddingTimer from './WeddingTimer';
import ScriptureApproach from './ScriptureApproach';
import s from './experience.module.css';

const nav = [['Our Story', 'our-story'], ['Celebration', 'celebration'], ['Gallery', 'gallery'], ['RSVP', 'rsvp']];
const dateParts = wedding.dateShort.split(' · ');
function Floral({ className = '' }: { className?: string }) {
  return <Image src={photos.floral} alt="" width={900} height={946} className={`${s.floral} ${className}`} sizes="(max-width: 600px) 180px, 320px" />;
}

export default function Experience() {
  const root = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Transform-only motion keeps content readable even if animation fails.
      gsap.from('[data-hero-copy] > *', { y: 18, duration: 1.15, stagger: .1, ease: 'power2.out' });
      gsap.to('[data-hero-image]', { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: .7 } });
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.from(element, { y: 22, duration: .85, ease: 'power2.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return <div ref={root} className={s.experience}>
    <a className={s.skipLink} href="#main">Skip to content</a>
    <header className={s.header} onKeyDown={e => { if (e.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } }}>
      <a href="#home" className={s.monogram} aria-label={`${couple.groom} and ${couple.bride}, home`}>B<span>&</span>M</a>
      <button ref={menuButton} className={s.menuButton} type="button" aria-expanded={menuOpen} aria-controls="wedding-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? 'Close' : 'Menu'} <span aria-hidden>{menuOpen ? '×' : '☰'}</span></button>
      <nav id="wedding-navigation" aria-label="Main navigation" className={`${s.nav} ${menuOpen ? s.navOpen : ''}`}>{nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
    </header>
    <main id="main">
      <section className={s.hero} id="home" data-hero aria-labelledby="couple-names">
        <div className={s.heroImage} data-hero-image><Image src={photos.hero} alt="A bride and groom walking through a Goan villa garden at sunset" fill priority sizes="100vw" /></div><div className={s.heroShade} />
        <div className={s.heroCopy} data-hero-copy><p className={s.eyebrow}>Together with our families</p><h1 id="couple-names">{couple.groom}<br /><span>&</span> {couple.bride}</h1><p className={s.heroDate}>{wedding.dateLong} <span>·</span> {wedding.city}</p><a className={s.heroCta} href="#celebration">Join our celebration <span aria-hidden>↗</span></a></div>
        <span className={s.heroFootnote}>A little moment. A lifetime of love.</span>
      </section>
      <section className={s.saveDate} aria-labelledby="save-date-title">
        <Floral className={s.dateFloralLeft} /><Floral className={s.dateFloralRight} /><p className={s.eyebrow} id="save-date-title">Save the date</p><div className={s.dateNumbers}><span>{dateParts[0]}</span><i>/</i><span>{dateParts[1]}</span><i>/</i><span>{dateParts[2]}</span></div><p className={s.dateLocation}>{wedding.day} <span>·</span> {wedding.city}</p><AddToCalendar />
      </section>
      <section id="our-story" className={`${s.section} ${s.story}`} aria-labelledby="story-title">
        <div className={s.storyPhoto} data-reveal><Image src={photos.storyIntro} alt="Watercolor illustration of a couple in casual clothes walking hand in hand through a Goan garden" fill sizes="(max-width: 767px) 90vw, 46vw" /><span className={s.photoNote}>Better together, always.</span></div>
        <div className={s.storyCopy} data-reveal><p className={s.eyebrow}>Our story</p><h2 id="story-title">Our forever<br />starts <em>here.</em></h2><span className={s.goldRule} /><p>{story.intro.join(' ')}</p><p className={s.script}>So grateful it’s you.</p></div><Floral className={s.storyFloral} />
      </section>
      <section className={`${s.section} ${s.milestones}`} aria-labelledby="milestones-title">
        <div className={s.sectionHeading}><p className={s.eyebrow}>The chapters that brought us here</p><h2 id="milestones-title">A love, gently unfolding.</h2></div>
        <div className={s.milestoneGrid}>{story.milestones.map((moment, i) => <article key={moment.year} className={s.milestone} data-reveal><div className={s.milestonePhoto}><Image src={photos.milestone[i]} alt={moment.title} fill sizes="(max-width: 600px) 43vw, 22vw" /></div><p className={s.year}>{moment.year}</p><h3>{moment.title}</h3></article>)}</div>
      </section>
      <ScriptureApproach />
      <section id="celebration" className={`${s.section} ${s.celebration}`} aria-labelledby="celebration-title">
        <div className={s.sectionHeading}><p className={s.eyebrow}>The celebration</p><h2 id="celebration-title">Two moments. A lifetime together.</h2><span className={s.goldRule} /></div>
        <div className={s.eventGrid}>
          <article className={s.eventCard} data-reveal><div className={s.eventPhoto}><Image src={photos.ceremony} alt="Floral decorations in a church interior, an illustrative wedding photograph" fill sizes="(max-width: 600px) 90vw, 28vw" /></div><div className={s.eventInfo}><p className={s.eventNumber}>01 / THE VOWS</p><h3><em>The</em> Nuptials</h3><span className={s.goldRule} /><h4>{wedding.ceremony.venue}</h4><p>{wedding.dateLong}<br />{wedding.ceremony.time}<br />{wedding.ceremony.place}</p><a className={s.textLink} href={wedding.ceremony.mapUrl} target="_blank" rel="noopener noreferrer">View location <span aria-hidden>↗</span></a></div></article>
          <article className={s.eventCard} data-reveal><div className={s.eventPhoto}><Image src={photos.reception} alt="A floral wedding cake, an illustrative reception photograph" fill sizes="(max-width: 600px) 90vw, 28vw" /></div><div className={s.eventInfo}><p className={s.eventNumber}>02 / THE CELEBRATION</p><h3><em>The</em> Reception</h3><span className={s.goldRule} /><h4>{wedding.reception.venue}</h4><p>{wedding.dateLong}<br />{wedding.reception.time}<br />{wedding.reception.resort}</p><a className={s.textLink} href={wedding.reception.mapUrl} target="_blank" rel="noopener noreferrer">View location <span aria-hidden>↗</span></a></div></article>
        </div><p className={s.eventNote}>{wedding.reception.note}</p>
        <details className={s.videoDetails} onToggle={e => { if (!e.currentTarget.open) e.currentTarget.querySelector('video')?.pause(); }}><summary>A glimpse inside the church <span aria-hidden>＋</span></summary><video controls playsInline preload="none" aria-label="Silent cinematic church film"><source src="/videos/church-cinematic.mp4" type="video/mp4" /></video><p>A quiet glimpse of the church. This film has no audio.</p></details>
      </section>
      <section id="gallery" className={`${s.section} ${s.gallery}`} aria-labelledby="gallery-title">
        <div className={s.sectionHeading}><p className={s.eyebrow}>Our gallery</p><h2 id="gallery-title">Little moments. Endless love.</h2><p>A few memories, held close.</p></div>
        <div className={s.galleryGrid}>{photos.memory.map((src, i) => <div className={s.galleryPhoto} key={src} data-reveal><Image src={src} alt={['A black and white moment at the altar', 'Holding hands during the ceremony', 'A close embrace', 'Joined hands beside a bridal gown', 'Wedding rings resting on the Bible'][i]} fill sizes="(max-width: 600px) 45vw, 32vw" /></div>)}</div>
      </section>
      <section className={`${s.section} ${s.guestInfo}`} aria-labelledby="guest-title"><div><p className={s.eyebrow}>A little planning</p><h2 id="guest-title">For our<br /><em>dearest guests.</em></h2><p className={s.guestIntro}>The details to help you feel at home.</p></div><div className={s.accordions}>{details.filter(d => !['Ceremony', 'Reception'].includes(d.title)).map(detail => <details key={detail.title}><summary>{detail.title}<span aria-hidden>＋</span></summary>{detail.title !== 'Dress Code' && <p className={s.demoNotice}>Illustrative demo details — not confirmed arrangements or contact information.</p>}<p>{detail.lines.map(line => <span key={line}>{line}<br /></span>)}</p></details>)}</div></section>
      <section id="rsvp" className={s.rsvp} aria-labelledby="rsvp-title"><Floral className={s.rsvpFloralLeft} /><Floral className={s.rsvpFloralRight} /><div className={s.rsvpContent} data-reveal><p className={s.eyebrow}>With love, and a little anticipation</p><h2 id="rsvp-title">We’re saving you a seat.</h2><p>Kindly RSVP by {wedding.rsvpDeadline}.</p><RSVPSection /><WeddingTimer /></div></section>
    </main>
    <footer className={s.footer}><a href="#home" className={s.monogram} aria-label="Back to top">B<span>&</span>M</a><p className={s.script}>We can’t wait to celebrate with you.</p><div className={s.footerBottom}><p>Crafted by <a href={creator.website} target="_blank" rel="noopener noreferrer">Florals & Frames</a></p><a href={whatsappEnquiryUrl()} target="_blank" rel="noopener noreferrer">Create a wedding website like this <span aria-hidden>↗</span></a></div><p className={s.footerDemo}>A fictional wedding invitation demo.</p></footer><MusicToggle />
  </div>;
}
