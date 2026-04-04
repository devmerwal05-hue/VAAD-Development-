import { m as motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import PageHero from '../components/PageHero';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

export default function WorkPage() {
  const { content, getContentValue, projectCount } = useContent();
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  usePageMetadata({
    title: getContentValue('seo', 'work_title', 'VAAD Development | Selected projects'),
    description: getContentValue(
      'seo',
      'work_description',
      'Recent website and web application builds from VAAD Development, including e-commerce, operations tooling, and launch-focused product work.'
    ),
    path: '/work',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('work_page', 'eyebrow', 'Selected Work')}
        titleBefore={getContentValue('work_page', 'title_before', 'Sites and products that had to')}
        titleHighlight={getContentValue('work_page', 'title_highlight', 'ship on time')}
        description={getContentValue('work_page', 'description', 'These are the kinds of builds we take on: lean teams, real delivery pressure, and a clear need for design and engineering to move in the same sprint.')}
      />

      <section className="section-pad swiss-section relative">
        <span className="swiss-meta swiss-meta--tl">work.index</span>
        <span className="swiss-meta swiss-meta--tr">catalog // active</span>
        <div className="site-container swiss-grid">
          {projects.map((project, index) => (
            <motion.article
              key={`${project.name}-${index}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.72 }}
              className="swiss-full-col group relative grid grid-cols-1 border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.62)] lg:grid-cols-[1fr_0.95fr]"
            >
              <div className={`relative min-h-[320px] overflow-hidden border-b border-[rgba(232,19,42,0.12)] lg:min-h-[420px] lg:border-b-0 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${project.accentColor}, transparent 65%), linear-gradient(${project.gradientAngle}, #071126, #0D1834)`,
                  }}
                />
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.name}
                    className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-92"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                    <span className="text-[56px] text-[rgba(234,230,219,0.12)]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: '-0.04em' }}>
                      {project.name}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,12,32,0.9)] via-[rgba(6,12,32,0.25)] to-transparent" />

                <div className="absolute left-5 top-5 border border-[rgba(232,19,42,0.34)] bg-[rgba(6,12,32,0.72)] px-4 py-1.5">
                  <span className="section-ref">{project.tag}</span>
                </div>
              </div>

              <div className={`relative border-[rgba(232,19,42,0.14)] px-6 py-9 md:px-8 md:py-10 lg:border-l ${index % 2 === 1 ? 'lg:order-1 lg:border-l-0 lg:border-r' : ''}`}>
                <p className="annotation-label mb-5">Project / {String(index + 1).padStart(2, '0')}</p>

                <h2
                  className="mb-3 text-text-primary"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 3.8vw, 62px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}
                >
                  {project.name}
                </h2>

                <p className="mb-5 text-[11px] uppercase tracking-[0.2em] text-[rgba(232,19,42,0.72)]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {project.subtitle}
                </p>

                <div className="mb-7 h-[1px] w-16 bg-[rgba(232,19,42,0.42)]" />

                <p className="reading-track mb-9 max-w-[58ch] text-[16px] leading-[1.85] text-[rgba(234,230,219,0.6)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {project.description}
                </p>

                {project.gallery.length > 0 && (
                  <div className="mb-8 flex gap-3 overflow-x-auto pb-1">
                    {project.gallery.map((imageUrl, galleryIndex) => (
                      <div
                        key={`${project.name}-gallery-${galleryIndex}`}
                        className="h-16 w-24 shrink-0 overflow-hidden border border-[rgba(232,19,42,0.2)] md:h-20 md:w-28"
                      >
                        <img
                          src={imageUrl}
                          alt={`${project.name} gallery image ${galleryIndex + 1}`}
                          className="h-full w-full object-cover opacity-60 transition-opacity group-hover:opacity-95"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-6 py-4 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_36px_rgba(232,19,42,0.26)]"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
                  >
                    {getContentValue('portfolio', 'link_label_live', 'View live project')}
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <span className="annotation-label">{getContentValue('portfolio', 'link_label_internal', 'Internal showcase')}</span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <Marquee />

      <section className="section-pad swiss-section relative">
        <span className="swiss-meta swiss-meta--tl">work.cta</span>
        <span className="swiss-meta swiss-meta--tr">prompt // 01</span>
        <div className="site-container swiss-grid">
          <div className="corner-marks swiss-full-col border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.76)] px-8 py-10 text-center md:px-12 md:py-14 lg:col-span-6 lg:col-start-4">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              {getContentValue('portfolio', 'footer_text', '') && (
                <p className="reading-track mx-auto mb-9 text-[15px] leading-[1.85] text-[rgba(234,230,219,0.56)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {getContentValue('portfolio', 'footer_text', '')}
                </p>
              )}

              <h2
                className="mb-5 text-text-primary"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(30px, 4vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
              >
                {getContentValue('work_page', 'cta_title', 'Have a build that needs traction?')}
              </h2>

              <p className="reading-track mx-auto mb-9 text-[15px] leading-[1.85] text-[rgba(234,230,219,0.56)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                {getContentValue('work_page', 'cta_description', 'We can scope the work, call out the risks, and tell you what should happen in the first release.')}
              </p>

              <Link
                to="/contact"
                className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(232,19,42,0.28)]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
              >
                {getContentValue('work_page', 'cta_button', 'Start the conversation')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
