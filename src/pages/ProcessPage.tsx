import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ';
import PageWrapper from '../components/PageWrapper';
import Process from '../components/Process';
import PageHero from '../components/PageHero';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function ProcessPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'process_title', 'VAAD Development | Process'),
    description: getContentValue('seo', 'process_description', 'How VAAD Development scopes, designs, builds, and launches projects without losing visibility or momentum.'),
    path: '/process',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('process_page', 'eyebrow', 'How Delivery Works')}
        titleBefore={getContentValue('process_page', 'title_before', 'Clear checkpoints from brief to')}
        titleHighlight={getContentValue('process_page', 'title_highlight', 'launch day')}
        description={getContentValue('process_page', 'description', 'The process is designed for speed without hidden surprises: scope first, build against decisions, then launch with a handoff that is actually usable.')}
      />

      <Process />
      <FAQ />

      <section className="py-20">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(108,99,255,0.5)', marginBottom: '16px' }}>
            — Get started
          </p>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,4.5vw,60px)', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 0.95, marginBottom: '14px' }}>
            {getContentValue('process_page', 'cta_title', 'Want this process on your project?')}
          </h2>
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75, marginBottom: '28px' }}>
            {getContentValue('process_page', 'cta_description', 'We can start with scope, risks, and a release plan before touching design or code.')}
          </p>
          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2.5"
            style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#040408', background: 'var(--color-accent)', padding: '14px 28px', borderRadius: '2px', boxShadow: '0 0 40px rgba(108,99,255,0.2)' }}
          >
            {getContentValue('process_page', 'cta_button', 'Request a project plan')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
