import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { buildPortfolioProjects, type PortfolioProject } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

function PortfolioCard({ project, featured }: { project: PortfolioProject; featured: boolean }) {
  const media = (
    <>
      <div
        className={featured ? 'h-[220px] md:h-[320px] relative overflow-hidden' : 'h-[200px] relative overflow-hidden'}
        style={{ background: `radial-gradient(ellipse at ${featured ? '25%' : '50%'} 50%, ${project.accentColor}, transparent 65%), linear-gradient(${project.gradientAngle}, #0A0A14, #0F0F1C)` }}
      >
        {project.image ? (
          <img src={project.image} alt={project.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-55 group-hover:opacity-80 group-hover:scale-[1.04] transition-all duration-700 ease-out will-change-transform" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[52px] font-[800] gradient-text" style={{ fontFamily: 'Syne' }}>{project.name}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-transparent to-transparent opacity-90" />
      </div>
      <div className={featured ? 'p-6 md:p-8' : 'p-6'}>
        <span className="inline-block text-[10px] uppercase tracking-[0.08em] px-2.5 py-1 rounded-md mb-3" style={{ fontFamily: 'DM Sans', fontWeight: 500, background: 'rgba(124,111,247,0.08)', color: '#A89AF9' }}>{project.tag}</span>
        <h3 className="text-[22px] md:text-[24px] text-text-primary mb-1.5" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
          {project.name} <span className="text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 300, fontSize: '15px' }}>- {project.subtitle}</span>
        </h3>
        <p className="text-[14px] text-text-secondary mb-3 leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{project.description}</p>
        {project.gallery.length > 0 && (
          <div className="flex gap-1.5 mb-4 overflow-hidden">
            {project.gallery.slice(0, 4).map((image, index) => (
              <div key={image + index} className="w-12 h-12 rounded-lg overflow-hidden border border-[rgba(255,255,255,0.06)] shrink-0">
                <img src={image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
            {project.gallery.length > 4 && (
              <div className="w-12 h-12 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
                <span className="text-[11px] text-text-secondary" style={{ fontFamily: 'JetBrains Mono' }}>+{project.gallery.length - 4}</span>
              </div>
            )}
          </div>
        )}
        <span className="text-accent text-[13px] font-medium inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
          {project.url ? 'View Project' : 'Internal showcase'} {project.url ? <ExternalLink size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> : null}
        </span>
      </div>
    </>
  );

  return project.url ? (
    <a href={project.url} target="_blank" rel="noopener noreferrer" className="block">{media}</a>
  ) : (
    <div className="block">{media}</div>
  );
}

export default function Portfolio() {
  const { getContentValue, projectCount } = useContent();
  const labelParts = getContentValue('portfolio', 'label', '04 / Work').split(' / ');
  const projects = buildPortfolioProjects(getContentValue, projectCount);

  if (projects.length === 0) return null;

  return (
    <section className="py-28 md:py-36">
      <div className="max-w-[1320px] mx-auto px-6">
        <SectionLabel number={labelParts[0] || '04'} label={labelParts[1] || 'Work'} />
        <SectionTitle>{getContentValue('portfolio', 'title', 'Selected work')}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, index) => (
            <motion.div
              key={project.name}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.7, ease: [0.16, 0.77, 0.47, 0.97] as [number, number, number, number], delay: index * 0.08 }}
              className={`group bg-surface-1 rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.04)] card-hover cursor-pointer ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <PortfolioCard project={project} featured={index === 0} />
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="text-center text-[15px] text-text-secondary max-w-[520px] mx-auto mt-14 leading-[1.7]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
          {getContentValue('portfolio', 'footer_text', 'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.')}
        </motion.p>
      </div>
    </section>
  );
}
