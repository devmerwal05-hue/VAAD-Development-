import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
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
    <section className="py-20 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(0,180,255,0.04), transparent 45%), radial-gradient(ellipse at 10% 80%, rgba(255,45,85,0.04), transparent 45%)' }} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <div className="max-w-[720px] mb-12 md:mb-16">
          <SectionLabel number={labelParts[0] || '04'} label={labelParts[1] || 'Work'} />
          <SectionTitle>{getContentValue('portfolio', 'title', 'Selected work')}</SectionTitle>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-px" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          {projects.map((project, index) => {
            const featured = index === 0;
            const colSpan = featured ? 'lg:col-span-7' : 'lg:col-span-5';

            const card = (
              <div
                className={`group card-accent-top ${colSpan} h-full`}
                style={{
                  background: '#07070F',
                  borderRight: featured ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'transform 0.25s ease, background 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={e => { 
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'rgba(0,180,255,0.015)';
                  el.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => { 
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = '#07070F';
                  el.style.transform = 'translateY(0)';
                }}
              >
                {/* Image area */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    minHeight: featured ? '320px' : '240px',
                    background: `radial-gradient(ellipse at 35% 35%, ${project.accentColor}, transparent 65%), linear-gradient(${project.gradientAngle}, #040408, #07070F)`,
                  }}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-90"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(48px,6vw,80px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.15)' }}
                      >
                        {project.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,4,8,0.95) 0%, rgba(4,4,8,0.2) 60%, transparent 100%)' }} />

                  {/* Tag badge */}
                  <span
                    className="absolute top-4 left-4"
                    style={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: '9px',
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#040408',
                      background: '#00B4FF',
                      padding: '3px 8px',
                      borderRadius: '2px',
                    }}
                  >
                    {project.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col gap-4 flex-1 justify-between">
                  <div>
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#55556A' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h3
                      style={{
                        fontFamily: 'Bebas Neue',
                        fontSize: featured ? 'clamp(32px,3.5vw,52px)' : 'clamp(26px,2.5vw,38px)',
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        color: '#F0EDE6',
                        marginTop: '8px',
                        marginBottom: '8px',
                        lineHeight: 0.95,
                      }}
                    >
                      {project.name}
                    </h3>
                    <p style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#00B4FF', marginBottom: '10px' }}>
                      {project.subtitle}
                    </p>
                    <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}>
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    {project.gallery.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {project.gallery.slice(0, 4).map((image, galleryIndex) => (
                          <div
                            key={`${project.name}-${galleryIndex}`}
                            className="w-14 h-14 overflow-hidden shrink-0"
                            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px' }}
                          >
                            <img src={image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                    <span
                      className="inline-flex items-center gap-2 group-hover:text-[#00B4FF] transition-colors"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A' }}
                    >
                      <span style={{ display: 'inline-block', width: '12px', height: '1px', background: project.url ? '#00B4FF' : '#55556A' }} />
                      {project.url ? 'View live project' : 'Internal showcase'}
                      {project.url && <ExternalLink size={11} />}
                    </span>
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
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: index * 0.06 }}
                className={colSpan}
              >
                {card}
              </motion.a>
            ) : (
              <motion.div
                key={`${project.name}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.6, ease, delay: index * 0.06 }}
                className={colSpan}
              >
                {card}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10 md:mt-14 max-w-[500px] mx-auto"
          style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#55556A', lineHeight: 1.8 }}
        >
          {getContentValue('portfolio', 'footer_text', 'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.')}
        </motion.p>
      </div>
    </section>
  );
}
