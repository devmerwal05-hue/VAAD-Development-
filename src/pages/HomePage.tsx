import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Services from '../components/Services';
import Stats from '../components/Stats';
import TechStack from '../components/TechStack';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import SectionChapterRail from '../components/SectionChapterRail';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';
import { useState, useEffect } from 'react';
import EntryScreen from '../components/EntryScreen';

export default function HomePage() {
  const { getContentValue } = useContent();
  const [isMobile, setIsMobile] = useState(true);
  const [launchComplete, setLaunchComplete] = useState(() => {
    try {
      return sessionStorage.getItem('vaad_home_launch_complete') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  usePageMetadata({
    title: getContentValue('seo', 'home_title', 'VAAD Development | Fast websites and web apps'),
    description: getContentValue('seo', 'home_description', 'VAAD Development designs, builds, and ships conversion-focused websites and operational web apps for small teams that need momentum.'),
    path: '/',
  });

  if (!launchComplete && !isMobile) {
    return (
      <EntryScreen
        onComplete={() => {
          try {
            sessionStorage.setItem('vaad_home_launch_complete', '1');
          } catch {
            // Ignore storage failures and continue without blocking usage.
          }
          setLaunchComplete(true);
        }}
      />
    );
  }

  const chapters = [
    { id: 'home-services', number: '01', label: 'Services' },
    { id: 'home-stats', number: '02', label: 'Why Us' },
    { id: 'home-process', number: '03', label: 'Process' },
    { id: 'home-work', number: '04', label: 'Work' },
    { id: 'home-pricing', number: '05', label: 'Pricing' },
    { id: 'home-faq', number: '06', label: 'FAQ' },
    { id: 'home-contact', number: '07', label: 'Contact' },
  ];

  return (
    <>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-page-bg focus:px-4 focus:py-2 focus:text-text-primary focus:shadow-[0_0_0_2px_rgba(124,111,247,0.35)]"
      >
        {getContentValue('ui', 'home_skip_link', 'Skip to content')}
      </a>
      <CustomCursor />
      <Navigation />
      <SectionChapterRail sections={chapters} />
      <main id="page-content">
        <Hero />
        <Marquee />
        <div id="home-services">
          <Services />
        </div>
        <TechStack />
        <div id="home-stats">
          <Stats />
        </div>
        <div id="home-process">
          <Process />
        </div>
        <div id="home-work">
          <Portfolio />
        </div>
        <div id="home-pricing">
          <Pricing />
        </div>
        <div id="home-faq">
          <FAQ />
        </div>
        <div id="home-contact">
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
