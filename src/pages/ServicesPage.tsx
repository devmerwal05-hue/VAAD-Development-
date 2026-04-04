import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import PageHero from '../components/PageHero';
import PageWrapper from '../components/PageWrapper';
import Services from '../components/Services';
import Stats from '../components/Stats';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function ServicesPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'services_title', 'VAAD Development | Services'),
    description: getContentValue(
      'seo',
      'services_description',
      'Website builds, product interfaces, internal tools, and launch support from VAAD Development.'
    ),
    path: '/services',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('services_page', 'eyebrow', 'What We Build')}
        titleBefore={getContentValue('services_page', 'title_before', 'Design and engineering for teams that need a')}
        titleHighlight={getContentValue('services_page', 'title_highlight', 'working release')}
        description={getContentValue('services_page', 'description', 'We handle the interface, frontend, backend wiring, CMS setup, deployment, and the cleanup work that usually gets pushed past launch.')}
      />

      <Services />
      <Marquee />
      <Stats />

      <section className="section-pad swiss-section relative">
        <span className="swiss-meta swiss-meta--tl">services.cta</span>
        <span className="swiss-meta swiss-meta--tr">prompt // 02</span>
        <div className="site-container swiss-grid">
          <div className="corner-marks swiss-full-col border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.76)] px-8 py-8 text-center md:px-12 md:py-12 lg:col-span-6 lg:col-start-4">
          <h2
            className="mb-4 text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(30px, 4vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
          >
            {getContentValue('services_page', 'cta_title', 'Need a tighter scope before you commit?')}
          </h2>
          <p className="reading-track mx-auto mb-8 text-[15px] leading-[1.8] text-[rgba(234,230,219,0.56)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {getContentValue('services_page', 'cta_description', 'Send the requirements and we will outline the first release, constraints, and recommended stack.')}
          </p>

          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(232,19,42,0.28)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            {getContentValue('services_page', 'cta_button', 'Scope my project')}
          </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
