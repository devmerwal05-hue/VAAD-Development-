import { m as motion } from 'framer-motion';
import { useContent } from '../lib/useContent';

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
  const cardCount = !Number.isNaN(storedCardCount) && storedCardCount > 0 ? storedCardCount : serviceDefaults.length;

  const services = Array.from({ length: cardCount }, (_, index) => {
    const fallback = serviceDefaults[index];
    return {
      title: getContentValue('services', `card_${index + 1}_title`, fallback?.title || ''),
      description: getContentValue('services', `card_${index + 1}_desc`, fallback?.description || ''),
    };
  }).filter((s) => s.title);

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="max-w-[1360px] mx-auto px-6 relative z-10">

        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '01'} / {labelParts[1] || 'Services'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
          >
            {getContentValue('services', 'title', 'What we build')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease, delay: 0.1 }}
            className="text-[14px] max-w-[360px] leading-[1.8]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
          >
            {getContentValue('services', 'subtitle', 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.')}
          </motion.p>
        </div>

        {/* Rule */}
        <div className="rule-line-full mb-10" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.55, ease, delay: index * 0.07 }}
              className="group relative border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] p-8 md:p-10"
            >
              {/* Hover fill */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />

              {/* Index */}
              <p
                className="mb-5"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.28em', color: 'rgba(232,19,42,0.5)', textTransform: 'uppercase' }}
              >
                Capability / {String(index + 1).padStart(2, '0')}
              </p>

              {/* Big number watermark */}
              <span
                className="absolute top-4 right-6 select-none pointer-events-none transition-all duration-500 group-hover:opacity-[0.04]"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 80, color: 'rgba(234,230,219,0.02)', lineHeight: 1 }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>

              <h3
                className="mb-4 group-hover:text-[#E8132A] transition-colors duration-400"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(20px, 2.2vw, 28px)', letterSpacing: '-0.02em', color: '#EAE6DB', lineHeight: 1.1 }}
              >
                {service.title}
              </h3>
              <p
                className="text-[14px] leading-[1.8]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
              >
                {service.description}
              </p>

              {/* Bottom rule on hover */}
              <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-500" style={{ background: 'rgba(232,19,42,0.4)' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
