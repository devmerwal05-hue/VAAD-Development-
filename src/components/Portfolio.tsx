import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

export default function Portfolio() {
  const { content, getContentValue, projectCount } = useContent();
  const labelParts = getContentValue('portfolio', 'label', '04 / Work').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  if (projects.length === 0) return null;

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(124,111,247,0.06), transparent 45%), radial-gradient(ellipse at 10% 80%, rgba(236,72,153,0.05), transparent 45%)' }} />
      <div className="max-w-[1360px] mx-auto px-6 relative z-10">
        <div className="max-w-[720px] mb-14">
          <SectionLabel number={labelParts[0] || '04'} label={labelParts[1] || 'Work'} />
          <SectionTitle>{getContentValue('portfolio', 'title', 'Selected work')}</SectionTitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {projects.map((project, index) => {
            const featured = index === 0;
            const card = (
              <div className={`group rounded-[30px] overflow-hidden border border-[rgba(255,255,255,0.06)] bg-surface-1 h-full ${featured ? 'lg:col-span-7' : 'lg:col-span-5'}`}>
                <div className={`grid ${featured ? 'md:grid-cols-[1.1fr_0.9fr]' : ''} h-full`}>
                  <div
                    className={`relative overflow-hidden ${featured ? 'min-h-[360px]' : 'min-h-[280px]'}`}
                    style={{ background: `radial-gradient(ellipse at 35% 35%, ${project.accentColor}, transparent 65%), linear-gradient(${project.gradientAngle}, #090914, #14121F)` }}
                  >
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover opacity-75 transition-all duration-700 group-hover:scale-[1.05] group-hover:opacity-100"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                        <span className="text-[44px] md:text-[62px] font-[800] gradient-text" style={{ fontFamily: 'Syne', lineHeight: 0.95 }}>
                          {project.name}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,20,0.9)] via-[rgba(10,10,20,0.18)] to-transparent" />
                    <span className="absolute top-5 left-5 text-[11px] uppercase tracking-[0.14em] px-3 py-1.5 rounded-full bg-[rgba(10,10,20,0.6)] border border-[rgba(255,255,255,0.1)] text-accent-light">
                      {project.tag}
                    </span>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col gap-5 justify-between">
                    <div>
                      <span className="text-[12px] uppercase tracking-[0.18em] text-text-tertiary" style={{ fontFamily: 'JetBrains Mono' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-[28px] md:text-[36px] text-text-primary mt-3 mb-3" style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
                        {project.name}
                      </h3>
                      <p className="text-[15px] text-accent-light mb-4">{project.subtitle}</p>
                      <p className="text-[15px] text-text-secondary leading-[1.8]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {project.gallery.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {project.gallery.slice(0, 4).map((image, galleryIndex) => (
                            <div key={`${project.name}-${galleryIndex}`} className="w-16 h-16 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.06)] shrink-0">
                              <img src={image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                      <span className="inline-flex items-center gap-2 text-accent-light text-[14px] font-medium">
                        {project.url ? 'View live project' : 'Internal showcase'}
                        {project.url ? <ExternalLink size={14} /> : null}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );

            return project.url ? (
              <motion.a
                key={`${project.name}-${index}`}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className={featured ? 'lg:col-span-7' : 'lg:col-span-5'}
              >
                {card}
              </motion.a>
            ) : (
              <motion.div
                key={`${project.name}-${index}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className={featured ? 'lg:col-span-7' : 'lg:col-span-5'}
              >
                {card}
              </motion.div>
            );
          })}
        </div>

        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.2 }} className="text-center text-[15px] text-text-secondary max-w-[560px] mx-auto mt-14 leading-[1.8]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
          {getContentValue('portfolio', 'footer_text', 'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.')}
        </motion.p>
      </div>
    </section>
  );
}
