import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import PageWrapper from '../components/PageWrapper';
import Services from '../components/Services';
import Stats from '../components/Stats';
import PageHero from '../components/PageHero';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function ServicesPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'services_title', 'VAAD Development | Services'),
    description: getContentValue('seo', 'services_description', 'Website builds, product interfaces, internal tools, and launch support from VAAD Development.'),
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(108,99,255,0.5)', marginBottom: '16px' }}>
            — Start a project
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,4.5vw,60px)', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 0.95, marginBottom: '14px' }}>
            {getContentValue('services_page', 'cta_title', 'Need a tighter scope before you commit?')}
          </h2>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75, marginBottom: '28px' }}>
            {getContentValue('services_page', 'cta_description', 'Send the requirements and we will outline the first release, constraints, and recommended stack.')}
          </p>
          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2.5"
            style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#040408', background: 'var(--color-accent)', padding: '14px 28px', borderRadius: '2px', boxShadow: '0 0 40px rgba(108,99,255,0.2)' }}
          >
            {getContentValue('services_page', 'cta_button', 'Scope my project')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
