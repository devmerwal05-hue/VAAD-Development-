import { motion } from 'framer-motion';
import { Globe, Code2, ShoppingBag, Wrench } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const iconComponents = [Globe, Code2, ShoppingBag, Wrench];
const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

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
    <section className="py-24 md:py-36 relative">
      {/* background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,180,255,0.04), transparent 70%)' }} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <SectionLabel number={labelParts[0] || '01'} label={labelParts[1] || 'Services'} />
        <SectionTitle>{getContentValue('services', 'title', 'What we build')}</SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="-mt-4 md:-mt-6 mb-12 md:mb-16 max-w-[580px]"
          style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(14px,1.1vw,16px)', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}
        >
          {getContentValue('services', 'subtitle', 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          {services.map((service, index) => {
            const Icon = iconComponents[index % iconComponents.length];
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, ease, delay: index * 0.07 }}
                className="group relative p-8 md:p-10 card-accent-top"
                style={{
                  background: '#07070F',
                  borderRight: index % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderBottom: index < services.length - 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,180,255,0.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#07070F'; }}
              >
                {/* Big index number */}
                <span
                  className="absolute top-5 right-6 pointer-events-none select-none"
                  style={{ fontFamily: 'Bebas Neue', fontSize: '80px', letterSpacing: '0.03em', color: 'rgba(0,180,255,0.025)', lineHeight: 1 }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-11 h-11 flex items-center justify-center mb-7 transition-all duration-300"
                    style={{
                      background: 'rgba(0,180,255,0.07)',
                      border: '1px solid rgba(0,180,255,0.12)',
                      borderRadius: '2px',
                    }}
                  >
                    <Icon size={19} style={{ color: '#00B4FF' }} />
                  </div>

                  <h3
                    style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(24px,2.5vw,32px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F0EDE6', marginBottom: '12px', lineHeight: 1 }}
                  >
                    {service.title}
                  </h3>
                  <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}>
                    {service.description}
                  </p>

                  {/* Hover detail */}
                  <div
                    className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.6)' }}
                  >
                    <span style={{ display: 'inline-block', width: '12px', height: '1px', background: 'rgba(0,180,255,0.5)' }} />
                    Learn more
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
