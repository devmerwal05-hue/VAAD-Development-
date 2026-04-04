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

  const planSpanClass = planCount <= 2 ? 'lg:col-span-6' : 'lg:col-span-4';

  return (
    <section className="section-pad swiss-section relative">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">pricing.matrix</span>
      <span className="swiss-meta swiss-meta--tr">schema // usd.v3</span>

      <div className="site-container swiss-grid relative z-10">
        {/* Header */}
        <div className="swiss-full-col mb-4 flex items-center gap-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '06'} / {labelParts[1] || 'Pricing'}</span>
        </div>

        <div className="swiss-full-col mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
          >
            {getContentValue('pricing', 'title', 'Transparent pricing')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
            className="reading-track lg:col-span-5 text-[14px] leading-[1.85]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
          >
            {getContentValue('pricing', 'subtitle', 'Clear ranges for common scopes. Final pricing depends on content volume, integrations, and operational complexity.')}
          </motion.p>
        </div>

        <div className="swiss-full-col rule-line-full mb-4" />

        <div className="swiss-full-col grid grid-cols-1 gap-8 lg:grid-cols-12">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease, delay: i * 0.07 }}
              className={`group relative flex flex-col ${planSpanClass}`}
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
                  className="absolute right-4 top-4 px-4 py-1.5 text-[9px] uppercase tracking-[0.2em]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: '#E8132A', border: '1px solid rgba(232,19,42,0.4)' }}
                >
                  {getContentValue('pricing', 'popular_badge', 'Popular')}
                </span>
              )}

              <div className="flex flex-1 flex-col p-8 md:p-9">
                {/* Plan index */}
                <p className="annotation-label mb-7">Plan / {String(i + 1).padStart(2, '0')}</p>

                <h3
                  className="mb-5"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.02em', color: '#EAE6DB' }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-5 flex items-end gap-1">
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
                  className="mb-7 text-[14px] leading-[1.85]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)', wordSpacing: '0.06em' }}
                >
                  {plan.description}
                </p>

                <div className="mb-7 h-[1px]" style={{ background: 'rgba(232,19,42,0.12)' }} />

                <ul className="mb-9 flex flex-1 flex-col gap-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-4 text-[14px] leading-[1.75]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.65)', wordSpacing: '0.06em' }}>
                      <Check size={13} style={{ color: '#E8132A', flexShrink: 0, marginTop: 2 }} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 px-6 py-4 text-[11px] uppercase tracking-[0.18em] transition-all duration-300"
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
          className="swiss-text-col mt-10 overflow-hidden border border-white/10 bg-zinc-900/50 p-6 md:p-7"
        >
          <p
            className="reading-track mb-7 text-[15px] leading-[1.85]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.45)', wordSpacing: '0.06em' }}
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
