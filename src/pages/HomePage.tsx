import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import Services from '../components/Services';
import Stats from '../components/Stats';
import TechStack from '../components/TechStack';
import Process from '../components/Process';
import Portfolio from '../components/Portfolio';
import Team from '../components/Team';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function HomePage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'home_title', 'VAAD Development | Fast websites and web apps'),
    description: getContentValue(
      'seo',
      'home_description',
      'VAAD Development designs, builds, and ships conversion-focused websites and operational web apps for small teams that need momentum.'
    ),
    path: '/',
  });

  return (
    <PageWrapper>
      <main>
        <Hero />
        <Marquee />
        <Services />
        <TechStack />
        <Stats />
        <Process />
        <Portfolio />
        <Team />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
    </PageWrapper>
  );
}
