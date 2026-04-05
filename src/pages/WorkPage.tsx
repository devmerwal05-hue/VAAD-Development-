import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.22, 0.03, 0.26, 1];

export default function WorkPage() {
  const { content, getContentValue, projectCount } = useContent();
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  usePageMetadata({
    title: 'VAAD Development | Selected projects',
    description: 'Recent website and web application builds from VAAD Development, including e-commerce, operations tooling, and launch-focused product work.',
    path: '/work',
  });

  return (
    <PageWrapper>
      <section className="pt-24 pb-8">
        <div className="max-w-[1320px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="max-w-[680px]">
            <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full" style={{ background: 'rgba(124,111,247,0.06)', border: '1px solid rgba(124,111,247,0.12)' }}>
              <span className="w-[5px] h-[5px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-accent-light" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                {getContentValue('work_page', 'eyebrow', 'Selected Work')}
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(44px, 7vw, 76px)', lineHeight: 0.95, letterSpacing: '-0.04em' }}>
              {getContentValue('work_page', 'title_before', 'Sites and products that had to')} <span className="gradient-text">{getContentValue('work_page', 'title_highlight', 'ship on time')}</span>
            </h1>
            <p className="text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('work_page', 'description', 'These are the kinds of builds we take on: lean teams, real delivery pressure, and a clear need for design and engineering to move in the same sprint.')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-[1320px] mx-auto px-6 flex flex-col gap-20">
          {projects.map((project, index) => (
            <motion.div
              key={`${project.name}-${index}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.8, ease }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className={`flex flex-col gap-3 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative rounded-2xl overflow-hidden group">
                    <div
                      className="aspect-[16/10] relative"
                      style={{
                        background: `radial-gradient(ellipse at 50% 50%, ${project.accentColor}, transparent 65%), linear-gradient(${project.gradientAngle}, #0A0A14, #0F0F1C)`,
                      }}
                    >
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-[1.04] transition-all duration-700 ease-out"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                          <span className="text-[52px] font-[800] gradient-text" style={{ fontFamily: 'Syne' }}>
                            {project.name}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A14] via-transparent to-transparent opacity-50" />
                    </div>
                    <div className="absolute inset-0 border rounded-2xl pointer-events-none border-[rgba(255,255,255,0.04)]" />
                  </div>

                  {project.gallery.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {project.gallery.map((imageUrl, galleryIndex) => (
                        <div
                          key={`${project.name}-gallery-${galleryIndex}`}
                          className="w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden border border-[rgba(255,255,255,0.05)] shrink-0 group/thumb"
                        >
                          <img
                            src={imageUrl}
                            alt={`${project.name} gallery image ${galleryIndex + 1}`}
                            className="w-full h-full object-cover opacity-60 group-hover/thumb:opacity-100 transition-opacity"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <span
                    className="inline-block text-[10px] uppercase tracking-[0.08em] px-3 py-1.5 rounded-md mb-5"
                    style={{ fontFamily: 'DM Sans', fontWeight: 500, background: 'rgba(124,111,247,0.08)', color: '#A89AF9' }}
                  >
                    {project.tag}
                  </span>
                  <h2 className="text-[36px] md:text-[42px] text-text-primary mb-2" style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em' }}>
                    {project.name}
                  </h2>
                  <p className="text-[18px] text-text-secondary mb-4" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
                    {project.subtitle}
                  </p>
                  <p className="text-[16px] text-text-secondary leading-[1.75] mb-8" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                    {project.description}
                  </p>
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shimmer-btn inline-flex items-center gap-2 gradient-bg text-white px-7 py-3.5 rounded-xl text-[14px] font-medium shadow-[0_0_30px_rgba(124,111,247,0.2)] hover:shadow-[0_0_50px_rgba(124,111,247,0.3)] transition-all duration-300"
                      style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
                    >
                      View live project
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Marquee />

      <section className="py-24">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}>
            {getContentValue('portfolio', 'footer_text', '') && (
              <p className="text-[15px] text-text-secondary mb-8 leading-[1.7]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                {getContentValue('portfolio', 'footer_text', '')}
              </p>
            )}
            <h2 className="text-[36px] text-text-primary mb-4" style={{ fontFamily: 'Syne', fontWeight: 800, letterSpacing: '-0.03em' }}>
              {getContentValue('work_page', 'cta_title', 'Have a build that needs traction?')}
            </h2>
            <p className="text-[16px] text-text-secondary mb-8" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('work_page', 'cta_description', 'We can scope the work, call out the risks, and tell you what should happen in the first release.')}
            </p>
            <Link
              to="/contact"
              className="shimmer-btn gradient-bg text-white px-8 py-4 rounded-xl text-[15px] font-medium inline-block shadow-[0_0_40px_rgba(124,111,247,0.2)]"
              style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
            >
              {getContentValue('work_page', 'cta_button', 'Start the conversation')}
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
