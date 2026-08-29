'use client';

import { useState, useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

import WeddingLoader from '@/components/WeddingLoader';
import FloralArchHero from '@/components/FloralArchHero';
import PetalFall from '@/components/PetalFall';
import ScriptureIntro from '@/components/ScriptureIntro';
import OurStory from '@/components/OurStory';
import ParallaxMemories from '@/components/ParallaxMemories';
import ProposalSequence from '@/components/ProposalSequence';
import WeddingAnnouncement from '@/components/WeddingAnnouncement';
import WeddingDate from '@/components/WeddingDate';
import ChurchCinematicSection from '@/components/ChurchCinematicSection';
import StainedGlassVerse from '@/components/StainedGlassVerse';
import BrideAndGroom from '@/components/BrideAndGroom';
import MemoryGallery from '@/components/MemoryGallery';
import CovenantSection from '@/components/CovenantSection';
import ReceptionSection from '@/components/ReceptionSection';
import WeddingCountdown from '@/components/WeddingCountdown';
import WeddingDetails from '@/components/WeddingDetails';
import RSVPSection from '@/components/RSVPSection';
import FinalBlessing from '@/components/FinalBlessing';
import Footer from '@/components/Footer';

import { useMusic } from '@/components/audio/MusicProvider';
import EntryGate from '@/components/audio/EntryGate';
import MusicToggle from '@/components/audio/MusicToggle';
import VolumeAutomation from '@/components/audio/VolumeAutomation';
import CreatorSection from '@/components/creator/CreatorSection';
import CreatorCTA from '@/components/creator/CreatorCTA';

export default function Experience() {
  const [loading, setLoading] = useState(true);
  const { hasEntered } = useMusic();

  // Scroll stays fully locked through the loader AND the entry invitation, so
  // the visitor can't scroll the site behind the gate before choosing.
  useEffect(() => {
    const locked = loading || !hasEntered;
    const html = document.documentElement;
    const body = document.body;

    // Lock the real scroll container (html) as well as body — locking body
    // alone leaks because html is the scroller.
    const lock = (on: boolean) => {
      html.style.overflow = on ? 'hidden' : '';
      body.style.overflow = on ? 'hidden' : '';
    };

    // Actively block every scroll input while gated — overflow:hidden alone
    // doesn't reliably stop wheel/touch/keyboard, so the page can't move behind
    // the gate until the visitor chooses.
    const preventDefault = (e: Event) => e.preventDefault();
    const SCROLL_KEYS = new Set([
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' ',
      'Spacebar',
    ]);
    const preventKeys = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
      if (!typing && SCROLL_KEYS.has(e.key)) e.preventDefault();
    };

    lock(locked);
    if (locked) {
      window.addEventListener('wheel', preventDefault, { passive: false });
      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('keydown', preventKeys);
    } else {
      window.scrollTo(0, 0);
      // pin/scrub triggers were measured behind overlays; recompute now.
      requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    return () => {
      lock(false);
      window.removeEventListener('wheel', preventDefault);
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('keydown', preventKeys);
    };
  }, [loading, hasEntered]);

  // Self-healing layout: re-measure the scroll animations once heavy assets
  // (images, fonts) have actually finished loading, so scrolling early can never
  // leave the pinned sections mis-positioned ("broken") while things stream in.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === 'complete') {
      requestAnimationFrame(refresh);
    } else {
      window.addEventListener('load', refresh);
    }
    // fonts can shift text-anchored trigger positions once they swap in
    document.fonts?.ready.then(refresh).catch(() => {});
    // safety net for images/video that decode a beat later
    const t1 = window.setTimeout(refresh, 1500);
    const t2 = window.setTimeout(refresh, 4000);

    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {loading && <WeddingLoader onDone={() => setLoading(false)} />}
      {!loading && <EntryGate />}

      <main className="relative">
        <FloralArchHero />
        <ScriptureIntro />
        <OurStory />
        <ParallaxMemories />
        <ProposalSequence />
        <WeddingAnnouncement />
        <WeddingDate />
        <ChurchCinematicSection />
        <StainedGlassVerse />
        <BrideAndGroom />
        <MemoryGallery />
        <CovenantSection />
        <ReceptionSection />
        <WeddingCountdown />
        <WeddingDetails />
        <RSVPSection />
        <FinalBlessing />
        <Footer />
        <CreatorSection />
      </main>

      <PetalFall />
      <MusicToggle />
      <CreatorCTA />
      <VolumeAutomation />
    </>
  );
}
