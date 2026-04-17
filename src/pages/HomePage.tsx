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
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';
import { useState } from 'react';
import EntryScreen from '../components/EntryScreen';

export default function HomePage() {
  const { getContentValue } = useContent();
  const [launchComplete, setLaunchComplete] = useState(() => {
    try {
      return sessionStorage.getItem('vaad_home_launch_complete') === '1';
    } catch {
      return false;
    }
  });

  usePageMetadata({
    title: getContentValue('seo', 'home_title', 'VAAD Development | Fast websites and web apps'),
    description: getContentValue('seo', 'home_description', 'VAAD Development designs, builds, and ships conversion-focused websites and operational web apps for small teams that need momentum.'),
    path: '/',
  });

  if (!launchComplete) {
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
      <main id="page-content">
        <Hero />
        <Marquee />
        <Services />
        <TechStack />
        <Stats />
        <Process />
        <Portfolio />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
