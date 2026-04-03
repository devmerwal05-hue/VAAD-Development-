import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import PageWrapper from '../components/PageWrapper';
import Services from '../components/Services';
import Stats from '../components/Stats';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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
      <section className="pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-[680px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                {getContentValue('services_page', 'eyebrow', 'What We Build')}
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              {getContentValue('services_page', 'title_before', 'Design and engineering for teams that need a')} <span className="gradient-text">{getContentValue('services_page', 'title_highlight', 'working release')}</span>
            </h1>
            <p className="text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('services_page', 'description', 'We handle the interface, frontend, backend wiring, CMS setup, deployment, and the cleanup work that usually gets pushed past launch.')}
            </p>
          </motion.div>
        </div>
      </section>
      <Services />
      <Marquee />
      <Stats />
      <section className="py-20">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <h2 className="text-[32px] text-text-primary mb-4" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
            {getContentValue('services_page', 'cta_title', 'Need a tighter scope before you commit?')}
          </h2>
          <p className="text-[16px] text-text-secondary mb-8" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {getContentValue('services_page', 'cta_description', 'Send the requirements and we will outline the first release, constraints, and recommended stack.')}
          </p>
          <Link to="/contact" className="shimmer-btn gradient-bg text-white px-8 py-[14px] rounded-lg text-[15px] font-medium inline-block" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            {getContentValue('services_page', 'cta_button', 'Scope my project')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
