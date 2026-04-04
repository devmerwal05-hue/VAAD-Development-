import { m as motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

const planDefaults = [
  { name: 'Starter site',       price: '900',  description: 'For focused marketing sites that need clarity, speed, and a CMS handoff.',                     features: 'Strategy workshop|Custom UI direction|CMS setup|Vercel deployment',              highlighted: 'false' },
  { name: 'Growth build',       price: '1900', description: 'For businesses that need a stronger funnel, more pages, and clearer conversion flows.',          features: 'Multi-page build|Analytics setup|Structured content model|Launch QA',            highlighted: 'true' },
  { name: 'Operational system', price: '3900', description: 'For teams replacing manual workflows with a tailored internal or client-facing system.',         features: 'Workflow mapping|Admin dashboard|Role-aware logic|Post-launch support',          highlighted: 'false' },
];

export default function Pricing() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('pricing', 'label', '06 / Pricing').split(' / ');
  const storedCount = Number(getContentValue('pricing', 'plan_count', ''));
  const planCount = !Number.isNaN(storedCount) && storedCount > 0 ? storedCount : planDefaults.length;

  const plans = Array.from({ length: planCount }, (_, i) => {
    const fb = planDefaults[i];
    return {
      name:        getContentValue('pricing', `plan_${i + 1}_name`,        fb?.name || ''),
      price:       getContentValue('pricing', `plan_${i + 1}_price`,       fb?.price || ''),
      description: getContentValue('pricing', `plan_${i + 1}_desc`,        fb?.description || ''),
      features:    getContentValue('pricing', `plan_${i + 1}_features`,    fb?.features || '').split('|').filter(Boolean),
      highlighted: getContentValue('pricing', `plan_${i + 1}_highlighted`, fb?.highlighted || 'false') === 'true',
    };
  }).filter((p) => p.name);

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '06'} / {labelParts[1] || 'Pricing'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
          >
            {getContentValue('pricing', 'title', 'Transparent pricing')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
            className="text-[13px] max-w-[340px] leading-[1.8]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.45)' }}
          >
            {getContentValue('pricing', 'subtitle', 'Clear ranges for common scopes. Final pricing depends on content volume, integrations, and operational complexity.')}
          </motion.p>
        </div>

        <div className="rule-line-full mb-10" />

        <div className={`grid grid-cols-1 ${planCount <= 2 ? 'sm:grid-cols-2' : 'lg:grid-cols-3'} gap-5 md:gap-6`}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              className="group relative flex flex-col"
              style={{
                border: plan.highlighted ? '1px solid rgba(232,19,42,0.35)' : '1px solid rgba(232,19,42,0.1)',
                background: plan.highlighted ? 'rgba(232,19,42,0.05)' : 'transparent',
              }}
            >
              {/* Highlighted top bar */}
              {plan.highlighted && <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: '#E8132A' }} />}

              {/* Popular badge */}
              {plan.highlighted && (
                <span
                  className="absolute top-4 right-4 text-[9px] tracking-[0.2em] uppercase px-3 py-1"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: '#E8132A', border: '1px solid rgba(232,19,42,0.4)' }}
                >
                  {getContentValue('pricing', 'popular_badge', 'Popular')}
                </span>
              )}

              <div className="p-8 md:p-10 flex flex-col flex-1">
                {/* Plan index */}
                <p className="annotation-label mb-6">Plan / {String(i + 1).padStart(2, '0')}</p>

                <h3
                  className="mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.02em', color: '#EAE6DB' }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-end gap-1 mb-4">
                  <span
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 14, color: 'rgba(234,230,219,0.5)', marginBottom: 8 }}
                  >USD</span>
                  <span
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 4vw, 52px)', lineHeight: 1, color: plan.highlighted ? '#E8132A' : '#EAE6DB', letterSpacing: '-0.03em' }}
                  >
                    {plan.price.replace('$', '')}
                  </span>
                </div>

                <p
                  className="text-[13px] leading-[1.8] mb-6"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
                >
                  {plan.description}
                </p>

                <div className="h-[1px] mb-6" style={{ background: 'rgba(232,19,42,0.12)' }} />

                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.65)' }}>
                      <Check size={13} style={{ color: '#E8132A', flexShrink: 0, marginTop: 2 }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-[11px] tracking-[0.18em] uppercase transition-all duration-300"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 600,
                    background: plan.highlighted ? '#E8132A' : 'transparent',
                    color: plan.highlighted ? '#EAE6DB' : 'rgba(234,230,219,0.6)',
                    border: plan.highlighted ? '1px solid #E8132A' : '1px solid rgba(234,230,219,0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (!plan.highlighted) {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(232,19,42,0.5)';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#EAE6DB';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!plan.highlighted) {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(234,230,219,0.2)';
                      (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(234,230,219,0.6)';
                    }
                  }}
                >
                  {getContentValue('pricing', 'plan_button', 'Get Started')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="text-center mt-14"
        >
          <p
            className="text-[14px] mb-5 max-w-[480px] mx-auto leading-[1.8]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.45)' }}
          >
            {getContentValue('pricing', 'cta_text', 'If the scope is unusual, we price it from the workflow backward instead of forcing it into a generic package.')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 hover:text-[#E8132A]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: 'rgba(234,230,219,0.45)' }}
          >
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
            {getContentValue('pricing', 'cta_button', 'Request a scoped estimate')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
