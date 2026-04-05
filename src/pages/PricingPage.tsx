import { motion } from 'framer-motion';
import FAQ from '../components/FAQ';
import PageWrapper from '../components/PageWrapper';
import Pricing from '../components/Pricing';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function PricingPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: 'VAAD Development | Pricing',
    description: 'Project pricing, delivery ranges, and what is included in a typical VAAD Development engagement.',
    path: '/pricing',
  });

  return (
    <PageWrapper>
      <section className="pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-[680px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                {getContentValue('pricing_page', 'eyebrow', 'Pricing')}
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              {getContentValue('pricing_page', 'title_before', 'Pricing framed around delivery, not')} <span className="gradient-text">{getContentValue('pricing_page', 'title_highlight', 'billable drift')}</span>
            </h1>
            <p className="text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('pricing_page', 'description', 'We scope around the release, the complexity, and the support needed after launch. That gives you a clearer budget before execution starts.')}
            </p>
          </motion.div>
        </div>
      </section>
      <Pricing />
      <FAQ />
    </PageWrapper>
  );
}
