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
    <section className="py-24 md:py-32 relative">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none opacity-20">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#7C6FF7] to-transparent blur-[100px]" />
      </div>
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionLabel number={labelParts[0] || '06'} label={labelParts[1] || 'Pricing'} />
        <SectionTitle>{getContentValue('pricing', 'title', 'Transparent pricing')}</SectionTitle>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="text-[15px] text-text-secondary mb-12 -mt-6" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
          {getContentValue('pricing', 'subtitle', 'Clear ranges for common scopes. Final pricing depends on content volume, integrations, and operational complexity.')}
        </motion.p>
        <div className={`grid grid-cols-1 ${planCount <= 2 ? 'sm:grid-cols-2 max-w-3xl mx-auto' : 'lg:grid-cols-3'} gap-5`}>
          {plans.map((plan, index) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: index * 0.06 }} className={`relative bg-surface-1 rounded-2xl p-8 flex flex-col border transition-all duration-300 overflow-hidden glass card-hover ${plan.highlighted ? 'border-[rgba(124,111,247,0.3)] shadow-[0_0_50px_rgba(124,111,247,0.06)]' : 'border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)]'}`}>
              {plan.highlighted && <div className="absolute top-0 left-0 w-full h-[2px] gradient-bg" />}
              {plan.highlighted && <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.08em] px-3 py-1 rounded-full z-10 badge-glow badge-glow-pulse" style={{ fontFamily: 'DM Sans', fontWeight: 500, background: 'rgba(124,111,247,0.12)', color: '#A89AF9' }}>{getContentValue('pricing', 'popular_badge', 'Popular')}</span>}
              <div className="relative z-10">
                <h3 className="text-[18px] text-text-primary mb-3 gradient-text-enhanced break-words [text-wrap:balance]" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{plan.name}</h3>
                <div className="text-[42px] text-text-primary mb-1" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
                  <span className="text-text-secondary text-[22px]">$</span>{plan.price.replace('$', '')}
                </div>
                <p className="text-[14px] text-text-secondary mb-6 break-words" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{plan.description}</p>
                <div className="w-full h-[1px] mb-6" style={{ background: 'rgba(255,255,255,0.05)' }} />
                <ul className="flex flex-col gap-3 flex-1 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[14px] text-text-secondary break-words" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                      <Check size={15} className="text-accent shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`w-full py-3.5 rounded-xl text-[15px] font-medium transition-all duration-300 text-center block btn-glow ${plan.highlighted ? 'shimmer-btn gradient-bg text-white shadow-[0_0_30px_rgba(124,111,247,0.2)]' : 'border-2 border-[rgba(255,255,255,0.08)] text-text-primary hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.03)]'}`} style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                  {getContentValue('pricing', 'plan_button', 'Get Started')}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease, delay: 0.3 }} className="text-center mt-12">
          <p className="text-[15px] text-text-secondary mb-4" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {getContentValue('pricing', 'cta_text', 'If the scope is unusual, we price it from the workflow backward instead of forcing it into a generic package.')}
          </p>
          <Link to="/contact" className="text-accent hover:text-accent-light text-[14px] font-medium transition-colors underline underline-offset-4 decoration-accent/30 hover:decoration-accent/60 btn-arrow" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            {getContentValue('pricing', 'cta_button', 'Request a scoped estimate')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
