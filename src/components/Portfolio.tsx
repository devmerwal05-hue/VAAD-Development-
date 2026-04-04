import { m as motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Portfolio() {
  const { content, getContentValue, projectCount } = useContent();
  const labelParts = getContentValue('portfolio', 'label', '04 / Work').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  if (projects.length === 0) return null;

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '04'} / {labelParts[1] || 'Work'}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="mb-14"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
        >
          {getContentValue('portfolio', 'title', 'Selected work')}
        </motion.h2>

        <div className="rule-line-full mb-8" />

        {/* Projects */}
        <div className="flex flex-col gap-6 md:gap-8">
          {projects.map((project, i) => {
            const inner = (
              <div
                className="group relative grid grid-cols-1 gap-0 border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] lg:grid-cols-[1fr_400px]"
              >
                {/* Hover background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.02)' }} />
                <div className="absolute left-0 top-0 bottom-0 w-0 group-hover:w-[2px] transition-all duration-500" style={{ background: '#E8132A' }} />

                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9', minHeight: 240 }}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-700"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(232,19,42,0.15), rgba(6,30,80,0.8))' }}
                    >
                      <span
                        className="text-[#EAE6DB] opacity-10"
                        style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 80, letterSpacing: '-0.04em' }}
                      >
                        {project.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[rgba(6,12,32,0.6)]" />

                  {/* Tag overlay */}
                  <div className="absolute top-5 left-5">
                    <span className="section-ref px-3 py-1.5" style={{ background: 'rgba(6,12,32,0.7)', border: '1px solid rgba(232,19,42,0.3)' }}>
                      {project.tag}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between px-8 py-10" style={{ borderLeft: '1px solid rgba(232,19,42,0.1)' }}>
                  <div>
                    <p className="annotation-label mb-6">Project / {String(i + 1).padStart(2, '0')}</p>
                    <h3
                      className="mb-3 group-hover:text-[#E8132A] transition-colors duration-300"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 3vw, 36px)', letterSpacing: '-0.03em', color: '#EAE6DB', lineHeight: 0.95 }}
                    >
                      {project.name}
                    </h3>
                    <p
                      className="text-[13px] mb-4"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(232,19,42,0.7)' }}
                    >
                      {project.subtitle}
                    </p>
                    <div className="h-[1px] mb-5 max-w-[36px]" style={{ background: 'rgba(232,19,42,0.4)' }} />
                    <p className="text-[14px] leading-[1.8]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.45)' }}>
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    {project.gallery.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto">
                        {project.gallery.slice(0, 3).map((img, gi) => (
                          <div key={gi} className="w-14 h-10 overflow-hidden shrink-0" style={{ border: '1px solid rgba(232,19,42,0.2)' }}>
                            <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    )}
                    <span
                      className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase transition-colors duration-200 group-hover:text-[#E8132A]"
                      style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: 'rgba(234,230,219,0.35)' }}
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              >
                {inner}
              </motion.a>
            ) : (
              <motion.div
                key={`${project.name}-${i}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
              >
                {inner}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.2 }}
          className="text-center text-[13px] max-w-[520px] mx-auto mt-12 leading-[1.8]"
          style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.35)' }}
        >
          {getContentValue('portfolio', 'footer_text', 'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.')}
        </motion.p>
      </div>
    </section>
  );
}
