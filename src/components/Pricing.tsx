import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Pricing() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('pricing', 'label', '06 / Pricing').split(' / ');

  const planDefaults = [
    { name: 'Starter site', price: '900', description: 'For focused marketing sites that need clarity, speed, and a CMS handoff.', features: 'Strategy workshop|Custom UI direction|CMS setup|Vercel deployment', highlighted: 'false' },
    { name: 'Growth build', price: '1900', description: 'For businesses that need a stronger funnel, more pages, and clearer conversion flows.', features: 'Multi-page build|Analytics setup|Structured content model|Launch QA', highlighted: 'true' },
    { name: 'Operational system', price: '3900', description: 'For teams replacing manual workflows with a tailored internal or client-facing system.', features: 'Workflow mapping|Admin dashboard|Role-aware logic|Post-launch support', highlighted: 'false' },
  ];

  const storedPlanCount = Number(getContentValue('pricing', 'plan_count', ''));
  const planCount = (!isNaN(storedPlanCount) && storedPlanCount > 0) ? storedPlanCount : planDefaults.length;

  const plans = Array.from({ length: planCount }, (_, index) => {
    const fallback = planDefaults[index];
    return {
      name: getContentValue('pricing', `plan_${index + 1}_name`, fallback?.name || ''),
      price: getContentValue('pricing', `plan_${index + 1}_price`, fallback?.price || ''),
      description: getContentValue('pricing', `plan_${index + 1}_desc`, fallback?.description || ''),
      features: getContentValue('pricing', `plan_${index + 1}_features`, fallback?.features || '').split('|').filter(Boolean),
      highlighted: getContentValue('pricing', `plan_${index + 1}_highlighted`, fallback?.highlighted || 'false') === 'true',
    };
  }).filter(p => p.name);

  return (
    <section className="py-20 md:py-32 relative">
      {/* Background */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.05), transparent 70%)', filter: 'blur(60px)' }} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <SectionLabel number={labelParts[0] || '06'} label={labelParts[1] || 'Pricing'} />
        <SectionTitle>{getContentValue('pricing', 'title', 'Transparent pricing')}</SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="-mt-4 md:-mt-6 mb-12 md:mb-16 max-w-[560px]"
          style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}
        >
          {getContentValue('pricing', 'subtitle', 'Clear ranges for common scopes. Final pricing depends on content volume, integrations, and operational complexity.')}
        </motion.p>

        <div
          className={`grid grid-cols-1 ${planCount <= 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'lg:grid-cols-3'} gap-px`}
          style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease, delay: index * 0.07 }}
              className="relative flex flex-col p-7 md:p-9 card-accent-top"
              style={{
                background: plan.highlighted ? 'rgba(0,180,255,0.03)' : '#07070F',
                borderRight: index < plans.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'background 0.3s',
              }}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <span
                  className="absolute top-4 right-4"
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '9px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#040408',
                    background: '#00B4FF',
                    padding: '3px 8px',
                    borderRadius: '2px',
                  }}
                >
                  {getContentValue('pricing', 'popular_badge', 'Popular')}
                </span>
              )}

              {/* Index number */}
              <span
                className="absolute top-4 left-7 pointer-events-none select-none"
                style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#55556A' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="mt-6">
                {/* Plan name */}
                <h3
                  style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F0EDE6', marginBottom: '12px' }}
                >
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-4">
                  <span style={{ fontFamily: 'Bebas Neue', fontSize: '52px', letterSpacing: '0.02em', color: plan.highlighted ? '#00B4FF' : '#F0EDE6', lineHeight: 1 }}>
                    ${plan.price.replace('$', '')}
                  </span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#55556A', marginBottom: '4px' }}>
                    /project
                  </span>
                </div>

                <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75, marginBottom: '20px' }}>
                  {plan.description}
                </p>

                {/* Divider */}
                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', marginBottom: '20px' }} />

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span
                        className="shrink-0 mt-0.5"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '16px',
                          height: '16px',
                          background: 'rgba(0,180,255,0.08)',
                          border: '1px solid rgba(0,180,255,0.2)',
                          borderRadius: '2px',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={10} style={{ color: '#00B4FF' }} />
                      </span>
                      <span style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0' }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to="/contact"
                  className="shimmer-btn w-full py-3.5 text-center block transition-all duration-300"
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    borderRadius: '2px',
                    ...(plan.highlighted
                      ? {
                          background: '#00B4FF',
                          color: '#040408',
                          boxShadow: '0 0 30px rgba(0,180,255,0.18)',
                        }
                      : {
                          background: 'transparent',
                          color: '#8A8AA0',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }
                    ),
                  }}
                  onMouseEnter={e => {
                    if (!plan.highlighted) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgba(0,180,255,0.3)';
                      el.style.color = '#00B4FF';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!plan.highlighted) {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'rgba(255,255,255,0.08)';
                      el.style.color = '#8A8AA0';
                    }
                  }}
                >
                  {getContentValue('pricing', 'plan_button', 'Get Started')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="text-center mt-10 md:mt-12"
        >
          <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#55556A', marginBottom: '12px' }}>
            {getContentValue('pricing', 'cta_text', 'If the scope is unusual, we price it from the workflow backward instead of forcing it into a generic package.')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 transition-colors duration-200"
            style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#00B4FF' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#33C8FF'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#00B4FF'; }}
          >
            <span style={{ display: 'inline-block', width: '14px', height: '1px', background: '#00B4FF' }} />
            {getContentValue('pricing', 'cta_button', 'Request a scoped estimate')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
