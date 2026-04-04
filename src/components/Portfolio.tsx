import { useState } from 'react';
import { m as motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';
import SectionLabel from './SectionLabel';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Portfolio() {
  const { content, getContentValue, projectCount } = useContent();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const labelParts = getContentValue('portfolio', 'label', '04 / Work').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  if (projects.length === 0) return null;

  return (
    <section className="section-pad swiss-section relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-12 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">{getContentValue('portfolio', 'meta_left', 'portfolio.archive')}</span>
      <span className="swiss-meta swiss-meta--tr">{getContentValue('portfolio', 'meta_right', 'spec // v1.92')}</span>

      <div className="site-container swiss-grid relative z-10 max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        <div className="swiss-full-col mb-4 flex items-center justify-between">
          <SectionLabel number={labelParts[0] || '04'} label={labelParts[1] || 'Work'} />
          <span className="archive-tag hidden md:block">{getContentValue('portfolio', 'archive_tag', 'specimen_gallery')}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="display-section swiss-text-col mb-4 text-[#dfe8f8]"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(44px, 8vw, 96px)', fontStyle: 'italic' }}
        >
          {getContentValue('portfolio', 'title', 'Selected work')}
        </motion.h2>

        <div className="portfolio-focus-grid swiss-full-col grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {projects.map((project, i) => {
            const dimmed = hoveredIndex !== null && hoveredIndex !== i;

            const inner = (
              <div className="archive-panel portfolio-focus-card bento-card scanline-hover group flex h-full flex-col overflow-hidden transition-all duration-300" style={{ opacity: dimmed ? 0.44 : 1 }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', minHeight: 320 }}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover opacity-85 transition-all duration-700 group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(140deg, rgba(164,189,228,0.4), rgba(4,18,48,0.95))' }}
                    >
                      <span
                        className="text-[#dce7fb] opacity-18"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 80, fontStyle: 'italic' }}
                      >
                        {project.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(1,14,42,0.95)_8%,rgba(1,14,42,0.22)_58%)] transition-opacity duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-[rgba(3,10,26,0.24)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="absolute left-4 top-4 border border-[rgba(255,44,27,0.62)] bg-[rgba(2,18,52,0.9)] px-3 py-1">
                    <span className="archive-tag">
                      {project.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="archive-tag block text-[rgba(214,229,255,0.95)]">{project.tag}</span>
                      <span className="mono-readable mt-2 block text-[10px] uppercase text-[rgba(214,229,255,0.76)]">{project.subtitle}</span>
                    </div>

                    <span className="portfolio-view-chip rounded-full border border-[rgba(95,178,255,0.42)] bg-[rgba(7,20,48,0.82)] px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-[rgba(214,229,255,0.95)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {project.url ? getContentValue('portfolio', 'view_project_label', 'View project') : getContentValue('portfolio', 'view_details_label', 'View details')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-8 md:p-10">
                  <h3
                    className="display-section mb-3 text-[#e3ebfb]"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(32px, 4.2vw, 54px)', fontStyle: 'italic' }}
                  >
                    {project.name}
                  </h3>

                  <p className="archive-tag mb-4">#{project.subtitle}</p>

                  <p className="reading-track mb-8 text-[15px] leading-[1.9] text-[rgba(168,190,226,0.88)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                    {project.description}
                  </p>

                  <div className="mt-auto border-t border-[rgba(126,164,224,0.2)] pt-6">
                    <span
                      className="mono-readable inline-flex items-center gap-2 text-[11px] uppercase text-[rgba(255,44,27,0.95)]"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
                    >
                      {project.url ? getContentValue('portfolio', 'link_label_live', 'View live project') : getContentValue('portfolio', 'link_label_internal', 'Internal showcase')}
                      {project.url && <ExternalLink size={12} />}
                    </span>
                  </div>
                </div>
              </div>
            );

            return project.url ? (
              <motion.a
                key={`${project.name}-${i}`}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`lg:col-span-6 transition-all duration-300 ${dimmed ? 'opacity-45' : 'opacity-100'}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={`${project.name}-${i}`}
                className={`lg:col-span-6 transition-all duration-300 ${dimmed ? 'opacity-45' : 'opacity-100'}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {inner}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
