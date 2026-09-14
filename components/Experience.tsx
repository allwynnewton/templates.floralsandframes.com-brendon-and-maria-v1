'use client';
import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import OpeningSequence from './OpeningSequence';
import ScriptureIntro from './ScriptureIntro';
import OurStory from './OurStory';
import ParallaxMemories from './ParallaxMemories';
import ProposalSequence from './ProposalSequence';
import WeddingDate from './WeddingDate';
import BrideAndGroom from './BrideAndGroom';
import MemoryGallery from './MemoryGallery';
import CelebrationDetails from './CelebrationDetails';
import RSVPSection from './RSVPSection';
import FinalBlessing from './FinalBlessing';
import Footer from './Footer';
import MusicToggle from './audio/MusicToggle';
import DetailsJump from './DetailsJump';
import VolumeAutomation from './audio/VolumeAutomation';
export default function Experience() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);
  return (
    <>
      <main id="top">
        <OpeningSequence />
        <ScriptureIntro />
        <OurStory />
        <ParallaxMemories />
        <ProposalSequence />
        <WeddingDate />
        <BrideAndGroom />
        <MemoryGallery />
        <CelebrationDetails />
        <RSVPSection />
        <FinalBlessing />
        <Footer />
      </main>
      <DetailsJump />
      <MusicToggle />
      <VolumeAutomation />
    </>
  );
}
