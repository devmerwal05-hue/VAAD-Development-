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
      image: getContentValue('services', `card_${index + 1}_image`, ''),
      details,
    };
  }).filter((s) => s.title);

  const visualFallbacks = [
    'radial-gradient(circle at 50% 45%, rgba(188,208,242,0.68) 0%, rgba(33,57,98,0.35) 34%, rgba(5,24,58,0.95) 100%)',
    'linear-gradient(165deg, rgba(152,172,206,0.45), rgba(9,29,66,0.95) 52%), radial-gradient(circle at 25% 50%, rgba(235,240,250,0.25), transparent 55%)',
    'linear-gradient(180deg, rgba(10,36,80,0.3), rgba(4,18,48,0.98)), radial-gradient(circle at 70% 35%, rgba(205,216,237,0.42), transparent 52%)',
    'linear-gradient(140deg, rgba(160,183,221,0.32), rgba(5,23,55,0.96)), radial-gradient(circle at 40% 70%, rgba(220,228,244,0.28), transparent 48%)',
  ];

  return (
    <section className="section-pad swiss-section relative py-20 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-16 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">{getContentValue('services', 'meta_left', 'services.node')}</span>
      <span className="swiss-meta swiss-meta--tr">{getContentValue('services', 'meta_right', 'v2.6 // 12-col')}</span>

      <div className="site-container swiss-grid relative z-10 max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        <div className="swiss-full-col mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff2c1b', display: 'inline-block' }} />
            <span className="section-ref">{labelParts[0] || '01'} / {labelParts[1] || 'Services'}</span>
          </div>
          <span className="archive-tag hidden md:block">{getContentValue('services', 'archive_tag', 'bionic_catalog_stream')}</span>
        </div>

        <div className="swiss-full-col mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="display-section lg:col-span-7 text-[#dbe5f8]"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(44px, 8vw, 98px)', fontStyle: 'italic' }}
          >
            {getContentValue('services', 'title', 'What we build')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55, ease, delay: 0.1 }}
            className="reading-track lg:col-span-5 text-[14px] leading-[1.85] text-[rgba(164,188,226,0.88)]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            {getContentValue('services', 'subtitle', 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.')}
          </motion.p>
        </div>

        <div className="swiss-full-col grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.52, ease, delay: index * 0.06 }}
              className="archive-panel group flex h-full flex-col overflow-hidden lg:col-span-6"
            >
              <div className="relative h-[300px] border-b border-[rgba(126,164,224,0.25)] md:h-[340px]">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: visualFallbacks[index % visualFallbacks.length] }} />
                )}

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(1,14,42,0.96)_5%,rgba(1,14,42,0.18)_58%)]" />
                <div className="absolute left-5 top-5 border border-[rgba(255,44,27,0.62)] bg-[rgba(2,18,52,0.9)] px-3 py-1">
                  <span className="archive-tag">index.{String(index + 1).padStart(3, '0')}</span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-8 md:p-10">
                <h3
                  className="display-section mb-4 text-[#dfe7f8]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(34px, 3.8vw, 54px)', fontStyle: 'italic' }}
                >
                  {service.title}
                </h3>

                <p
                  className="reading-track mb-8 text-[15px] leading-[1.9] text-[rgba(168,190,226,0.9)]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
                >
                  {service.description}
                </p>

                <div className="mt-auto border-t border-[rgba(126,164,224,0.2)] pt-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    {service.details.slice(0, 4).map((detail) => (
                      <p key={detail} className="mono-readable flex items-start gap-2 text-[10px] uppercase text-[rgba(255,44,27,0.9)]">
                        <span className="mt-[6px] inline-block h-[3px] w-[3px] shrink-0 rounded-full bg-[rgba(255,44,27,0.9)]" />
                        <span>{detail}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
