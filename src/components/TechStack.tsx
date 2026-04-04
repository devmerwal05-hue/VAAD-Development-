import { useMemo, useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../lib/useContent';
import SectionLabel from './SectionLabel';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

const fallbackCategories = [
  { name: 'Frontend systems',  desc: 'React interfaces with durable component patterns and content-aware layouts.',             tags: ['React', 'TypeScript', 'Routing'] },
  { name: 'Backend workflows', desc: 'Serverless endpoints and operational logic built for forms, content, and admin tooling.', tags: ['Node', 'Vercel Functions', 'Validation'] },
  { name: 'Data models',       desc: 'Supabase tables and policies shaped around actual editing, intake, and reporting needs.',   tags: ['Supabase', 'Postgres', 'RLS'] },
  { name: 'Media delivery',    desc: 'Storage-backed image workflows so content editors are not blocked by manual asset handling.', tags: ['Storage', 'Caching', 'Optimization'] },
  { name: 'Integrations',      desc: 'Analytics, email, CRM, and ops touchpoints connected where they support the workflow.',    tags: ['Webhooks', 'Forms', 'Automation'] },
  { name: 'Deployment',        desc: 'Preview-to-production delivery on infrastructure that is simple to hand off and maintain.', tags: ['Vercel', 'CDN', 'Rollbacks'] },
];

export default function TechStack() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('techstack', 'label', '09 / Capabilities').split(' / ');
  const storedCount = Number(getContentValue('techstack', 'cat_count', ''));
  const maxCategories = !Number.isNaN(storedCount) && storedCount > 0 ? storedCount : 10;

  const categories = Array.from({ length: maxCategories }, (_, i) => {
    const n = i + 1;
    const fb = fallbackCategories[i];
    const name = getContentValue('techstack', `cat_${n}_name`, fb?.name || '');
    if (!name) return null;
    return {
      name,
      desc: getContentValue('techstack', `cat_${n}_desc`, fb?.desc || ''),
      tags: getContentValue('techstack', `cat_${n}_tags`, fb?.tags.join(', ') || '')
        .split(',').map((t) => t.trim()).filter(Boolean),
      index: i,
    };
  }).filter(Boolean) as { name: string; desc: string; tags: string[]; index: number }[];

  const [openCards, setOpenCards] = useState<Set<number>>(() => new Set([0]));

  const defaultExpandedLabel = useMemo(
    () => getContentValue('techstack', 'expanded_label', 'Expanded module'),
    [getContentValue]
  );

  function toggleCard(index: number) {
    setOpenCards((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  if (categories.length === 0) return null;

  return (
    <section className="section-pad swiss-section relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">{getContentValue('techstack', 'meta_left', 'tech.registry')}</span>
      <span className="swiss-meta swiss-meta--tr">{getContentValue('techstack', 'meta_right', 'hash // 0x12AF')}</span>

      <div className="site-container swiss-grid relative z-10 max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        {/* Header */}
        <div className="swiss-full-col mb-4 flex items-center gap-4">
          <SectionLabel number={labelParts[0] || '09'} label={labelParts[1] || 'Capabilities'} />
        </div>

        <div className="swiss-full-col mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
          >
            {getContentValue('techstack', 'title', 'How we build')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
            className="reading-track lg:col-span-5 text-[14px] leading-[1.85]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.45)' }}
          >
            {getContentValue('techstack', 'subtitle', 'The stack is chosen around delivery speed, maintainability, and how much control your team needs after launch.')}
          </motion.p>
        </div>

        <div className="swiss-full-col rule-line-full mb-4" />

        <div className="swiss-full-col grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {categories.map((cat, i) => {
            const isOpen = openCards.has(cat.index);

            return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-5%' }}
              transition={{ duration: 0.6, ease, delay: i * 0.06 }}
              className="group bento-card scanline-hover relative border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] p-8 md:p-10 lg:col-span-6 xl:col-span-4"
            >
              {/* Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />
              <div className="absolute top-0 left-0 right-0 h-0 group-hover:h-[2px] transition-all duration-500" style={{ background: '#E8132A' }} />

              {/* Watermark number */}
              <span
                className="absolute top-4 right-6 select-none pointer-events-none"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 64, color: 'rgba(234,230,219,0.02)', lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => toggleCard(cat.index)}
                  className="w-full text-left"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? defaultExpandedLabel : getContentValue('techstack', 'collapsed_label', 'Collapsed module')}: ${cat.name}`}
                >
                  <p className="annotation-label mb-4">
                    {getContentValue('techstack', 'module_prefix', 'Module')} / {String(i + 1).padStart(2, '0')}
                  </p>

                  <div className="flex items-start justify-between gap-6">
                    <h3
                      className="mb-1 group-hover:text-[#E8132A] transition-colors duration-300"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(19px, 2vw, 24px)', letterSpacing: '-0.02em', color: '#EAE6DB', lineHeight: 1.12 }}
                    >
                      {cat.name}
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`mt-1 shrink-0 text-[rgba(234,230,219,0.6)] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#E8132A]' : ''}`}
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -4 }}
                      transition={{ duration: 0.28, ease: [0.16, 0.77, 0.47, 0.97] }}
                      className="overflow-hidden"
                    >
                      <p className="mb-8 mt-4 text-[14px] leading-[1.9]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}>
                        {cat.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2.5">
                        {cat.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] transition-all duration-200 group-hover:border-[rgba(232,19,42,0.3)]"
                            style={{
                              fontFamily: "'JetBrains Mono', monospace",
                              color: 'rgba(234,230,219,0.42)',
                              border: '1px solid rgba(234,230,219,0.1)',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
          })}
        </div>
      </div>
    </section>
  );
}
