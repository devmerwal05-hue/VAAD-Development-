import { m as motion } from 'framer-motion';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

const serviceDefaults = [
  {
    title: 'High-conviction websites',
    description: 'Marketing sites with strong hierarchy and conversion-driven storytelling.',
    details: ['Narrative-first page architecture', 'CMS-driven content blocks', 'Performance budget and launch QA', 'Responsive behavior mapped before build'],
  },
  {
    title: 'Operational web apps',
    description: 'Internal and client-facing tools that remove workflow drag.',
    details: ['Role-aware dashboard views', 'Form and approval flows', 'Audit-friendly data logging', 'Actionable status states for teams'],
  },
  {
    title: 'Commerce builds',
    description: 'Product surfaces built around trust, velocity, and checkout clarity.',
    details: ['Catalog and merch structure', 'Conversion-focused PDP templates', 'Mobile checkout optimization', 'Analytics event mapping'],
  },
  {
    title: 'Launch support',
    description: 'Post-ship improvements and content operations that sustain momentum.',
    details: ['Deployment and rollback readiness', 'CMS handoff and governance', 'Issue triage during launch window', 'Iteration backlog for phase two'],
  },
];

export default function Services() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('services', 'label', '01 / Services').split(' / ');
  const storedCardCount = Number(getContentValue('services', 'card_count', ''));
  const cardCount = !Number.isNaN(storedCardCount) && storedCardCount > 0 ? storedCardCount : serviceDefaults.length;

  const services = Array.from({ length: cardCount }, (_, index) => {
    const fallback = serviceDefaults[index];
    const detailFallbacks = fallback?.details || [];
    const details = [1, 2, 3, 4]
      .map((n) => getContentValue('services', `card_${index + 1}_detail_${n}`, detailFallbacks[n - 1] || ''))
      .filter(Boolean);

    return {
      title: getContentValue('services', `card_${index + 1}_title`, fallback?.title || ''),
      description: getContentValue('services', `card_${index + 1}_desc`, fallback?.description || ''),
      details,
    };
  }).filter((s) => s.title);

  return (
    <section className="section-pad relative">
      <div className="absolute inset-0 grid-pattern opacity-18 pointer-events-none" />
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(160px,0.2fr)_minmax(0,0.8fr)] lg:gap-12">
          <aside className="border-t border-[rgba(234,230,219,0.12)] pt-6">
            <div className="mb-6 flex items-center gap-4">
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
              <span className="section-ref">{labelParts[0] || '01'} // {labelParts[1] || 'Services'}</span>
            </div>
            <p className="annotation-label">VAAD // DEV_2026</p>
            <p className="annotation-label mt-4">MODE // TECHNICAL LIST</p>
          </aside>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, ease }}
              className="display-section"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', color: '#EAE6DB' }}
            >
              {getContentValue('services', 'title', 'What we build')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, ease, delay: 0.1 }}
              className="reading-track mt-6 text-[14px] leading-[1.8]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
            >
              {getContentValue('services', 'subtitle', 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.')}
            </motion.p>

            <div className="mt-10 border-t border-[rgba(234,230,219,0.12)]">
              {services.map((service, index) => (
                <motion.article
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, ease, delay: index * 0.06 }}
                  className="grid border-b border-[rgba(234,230,219,0.12)] py-8 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] lg:gap-8"
                >
                  <div>
                    <p
                      className="mb-4"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.28em', color: 'rgba(232,19,42,0.58)', textTransform: 'uppercase' }}
                    >
                      Capability // {String(index + 1).padStart(2, '0')}
                    </p>

                    <h3
                      className="display-section mb-4"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 2.8vw, 36px)', color: '#EAE6DB' }}
                    >
                      {service.title}
                    </h3>

                    <p
                      className="reading-track text-[14px] leading-[1.8]"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.52)' }}
                    >
                      {service.description}
                    </p>
                  </div>

                  <ul className="mt-6 grid gap-4 lg:mt-0">
                    {service.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-4">
                        <span className="mt-[7px] h-[1px] w-4 bg-[rgba(232,19,42,0.55)]" />
                        <p
                          className="mono-readable text-[12px]"
                          style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, color: 'rgba(234,230,219,0.62)' }}
                        >
                          {detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
