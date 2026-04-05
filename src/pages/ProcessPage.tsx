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
    title: 'VAAD Development | Process',
    description: 'How VAAD Development scopes, designs, builds, and launches projects without losing visibility or momentum.',
    path: '/process',
  });

  return (
    <PageWrapper>
      <section className="pt-16 md:pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-[680px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                {getContentValue('process_page', 'eyebrow', 'How Delivery Works')}
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(32px, 10vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {getContentValue('process_page', 'title_before', 'Clear checkpoints from brief to')} <span className="gradient-text">{getContentValue('process_page', 'title_highlight', 'launch day')}</span>
            </h1>
            <p className="text-[15px] md:text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('process_page', 'description', 'The process is designed for speed without hidden surprises: scope first, build against decisions, then launch with a handoff that is actually usable.')}
            </p>
          </motion.div>
        </div>
      </section>
      <Process />
      <FAQ />
      <section className="py-20">
        <div className="max-w-[640px] mx-auto px-5 md:px-6 text-center">
          <h2 className="text-[28px] md:text-[32px] text-text-primary mb-4" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
            {getContentValue('process_page', 'cta_title', 'Want this process on your project?')}
          </h2>
          <p className="text-[14px] md:text-[16px] text-text-secondary mb-8" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {getContentValue('process_page', 'cta_description', 'We can start with scope, risks, and a release plan before touching design or code.')}
          </p>
          <Link to="/contact" className="shimmer-btn gradient-bg text-white px-8 py-[14px] rounded-lg text-[15px] font-medium inline-block" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            {getContentValue('process_page', 'cta_button', 'Request a project plan')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
