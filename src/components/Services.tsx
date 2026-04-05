import { motion } from 'framer-motion';
import { Globe, Code2, ShoppingBag, Wrench } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const iconComponents = [Globe, Code2, ShoppingBag, Wrench];

const serviceDefaults = [
  { title: 'High-conviction websites', description: 'Marketing sites with strong information hierarchy, custom visuals, and a CMS handoff your team can actually maintain.' },
  { title: 'Operational web apps', description: 'Internal tools, client dashboards, and workflow systems that reduce manual follow-up and keep teams aligned.' },
  { title: 'Commerce builds', description: 'Stores and product funnels designed around clear merchandising, product storytelling, and mobile conversion paths.' },
  { title: 'Launch support', description: 'Deployment, analytics, content updates, and post-launch improvements so the build keeps paying off after go-live.' },
];

export default function Services() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('services', 'label', '01 / Services').split(' / ');
  
  const storedCardCount = Number(getContentValue('services', 'card_count', ''));
  const cardCount = (!isNaN(storedCardCount) && storedCardCount > 0) ? storedCardCount : serviceDefaults.length;
  
  const services = Array.from({ length: cardCount }, (_, index) => {
    const fallback = serviceDefaults[index];
    return {
      title: getContentValue('services', `card_${index + 1}_title`, fallback?.title || ''),
      description: getContentValue('services', `card_${index + 1}_desc`, fallback?.description || ''),
    };
  }).filter(s => s.title);

  return (
    <section className="py-24 md:py-32 relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-[#7C6FF7] to-transparent rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionLabel number={labelParts[0] || '01'} label={labelParts[1] || 'Services'} />
        <SectionTitle>{getContentValue('services', 'title', 'What we build')}</SectionTitle>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-[15px] md:text-[17px] text-text-secondary mb-12 -mt-6 max-w-[620px] leading-[1.75]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
          {getContentValue('services', 'subtitle', 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.')}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {services.map((service, index) => {
            const Icon = iconComponents[index % iconComponents.length];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease: [0.16, 0.77, 0.47, 0.97] as [number, number, number, number], delay: index * 0.08 }}
                className="perspective-container"
              >
                <div className="tilt-card bg-surface-1 rounded-2xl p-8 md:p-10 min-h-[240px] flex flex-col border border-[rgba(255,255,255,0.04)] card-hover relative overflow-hidden group glass">
                  <span className="absolute top-4 right-6 text-[72px] font-[800] text-[rgba(255,255,255,0.015)] pointer-events-none select-none transition-all duration-500 group-hover:text-[rgba(124,111,247,0.04)]" style={{ fontFamily: 'Syne' }}>
                    0{index + 1}
                  </span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at ${index % 2 === 0 ? '20% 0%' : '80% 100%'}, rgba(124,111,247,0.06), transparent 60%)` }} />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-[rgba(124,111,247,0.08)] flex items-center justify-center mb-6 group-hover:bg-[rgba(124,111,247,0.14)] transition-colors duration-300 glow-ring">
                      <Icon size={22} className="text-accent" />
                    </div>
                    <h3 className="text-[22px] text-text-primary mb-3 gradient-text-enhanced" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{service.title}</h3>
                    <p className="text-[15px] text-text-secondary leading-[1.75] flex-1" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{service.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
