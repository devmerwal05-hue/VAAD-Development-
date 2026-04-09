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
    title: getContentValue('seo', 'pricing_title', 'VAAD Development | Pricing'),
    description: getContentValue('seo', 'pricing_description', 'Project pricing, delivery ranges, and what is included in a typical VAAD Development engagement.'),
    path: '/pricing',
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
                {getContentValue('pricing_page', 'eyebrow', 'Pricing')}
              </span>
            </div>
            <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(50px,9vw,96px)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 0.93, color: '#F0EDE6', marginBottom: '20px' }}>
              {getContentValue('pricing_page', 'title_before', 'Pricing framed around delivery, not')}{' '}
              <span style={{ color: '#FF2D55' }}>{getContentValue('pricing_page', 'title_highlight', 'billable drift')}</span>
            </h1>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(14px,1.1vw,17px)', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}>
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
