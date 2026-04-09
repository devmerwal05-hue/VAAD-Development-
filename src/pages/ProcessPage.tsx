import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ';
import PageWrapper from '../components/PageWrapper';
import Process from '../components/Process';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ProcessPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'process_title', 'VAAD Development | Process'),
    description: getContentValue('seo', 'process_description', 'How VAAD Development scopes, designs, builds, and launches projects without losing visibility or momentum.'),
    path: '/process',
  });

  return (
    <PageWrapper>
      <section className="pt-28 md:pt-36 pb-10 relative">
        <div className="absolute inset-x-0 top-0 h-[280px] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,180,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="max-w-[680px]"
          >
            <div
              className="inline-flex items-center gap-2.5 mb-8"
              style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)', padding: '5px 12px', borderRadius: '2px' }}
            >
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00B4FF', boxShadow: '0 0 6px rgba(0,180,255,0.7)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.8)' }}>
                {getContentValue('process_page', 'eyebrow', 'How Delivery Works')}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(50px,9vw,96px)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 0.93, color: '#F0EDE6', marginBottom: '20px' }}>
              {getContentValue('process_page', 'title_before', 'Clear checkpoints from brief to')}{' '}
              <span style={{ color: '#00B4FF' }}>{getContentValue('process_page', 'title_highlight', 'launch day')}</span>
            </h1>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(14px,1.1vw,17px)', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}>
              {getContentValue('process_page', 'description', 'The process is designed for speed without hidden surprises: scope first, build against decisions, then launch with a handoff that is actually usable.')}
            </p>
          </motion.div>
        </div>
      </section>

      <Process />
      <FAQ />

      <section className="py-20">
        <div className="max-w-[600px] mx-auto px-6 md:px-10 text-center">
          <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.5)', marginBottom: '16px' }}>
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
            style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#040408', background: '#00B4FF', padding: '14px 28px', borderRadius: '2px', boxShadow: '0 0 40px rgba(0,180,255,0.2)' }}
          >
            {getContentValue('process_page', 'cta_button', 'Request a project plan')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
