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
    title: getContentValue('seo', 'work_title', 'VAAD Development | Selected projects'),
    description: getContentValue('seo', 'work_description', 'Recent website and web application builds from VAAD Development, including e-commerce, operations tooling, and launch-focused product work.'),
    path: '/work',
  });

  return (
    <PageWrapper>
      {/* Page hero */}
      <section className="pt-28 md:pt-36 pb-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          {/* Scan-line grid accent */}
          <div className="absolute inset-x-0 top-0 h-[320px] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,180,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', opacity: 0.6 }} />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="max-w-[700px] relative z-10"
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2.5 mb-8"
              style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)', padding: '5px 12px', borderRadius: '2px' }}
            >
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#00B4FF', boxShadow: '0 0 6px rgba(0,180,255,0.7)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.8)' }}>
                {getContentValue('work_page', 'eyebrow', 'Selected Work')}
              </span>
            </div>

            <h1
              style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(52px,9vw,100px)', letterSpacing: '0.03em', textTransform: 'uppercase', lineHeight: 0.93, color: '#F0EDE6', marginBottom: '20px' }}
            >
              {getContentValue('work_page', 'title_before', 'Sites and products that had to')}{' '}
              <span style={{ color: '#00B4FF' }}>{getContentValue('work_page', 'title_highlight', 'ship on time')}</span>
            </h1>

            <p style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(14px,1.1vw,17px)', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}>
              {getContentValue('work_page', 'description', 'These are the kinds of builds we take on: lean teams, real delivery pressure, and a clear need for design and engineering to move in the same sprint.')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-10 md:py-14">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col gap-px" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
          {projects.map((project, index) => (
            <motion.div
              key={`${project.name}-${index}`}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.75, ease }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-px"
              style={{ background: '#07070F', borderBottom: index < projects.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
            >
              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div
                  className="aspect-[16/10] relative overflow-hidden group"
                  style={{
                    background: `radial-gradient(ellipse at 50% 50%, ${project.accentColor}, transparent 65%), linear-gradient(${project.gradientAngle}, #040408, #07070F)`,
                  }}
                >
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.04] transition-all duration-700"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.12)' }}>
                        {project.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,4,8,0.7) 0%, transparent 60%)' }} />
                </div>

                {project.gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    {project.gallery.map((imageUrl, galleryIndex) => (
                      <div
                        key={`${project.name}-gallery-${galleryIndex}`}
                        className="w-16 h-12 overflow-hidden shrink-0"
                        style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px' }}
                      >
                        <img
                          src={imageUrl}
                          alt={`${project.name} gallery image ${galleryIndex + 1}`}
                          className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div
                className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                style={{ borderLeft: index % 2 === 0 ? '1px solid rgba(255,255,255,0.04)' : 'none', borderRight: index % 2 === 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: '#040408', background: '#00B4FF', padding: '3px 8px', borderRadius: '2px', display: 'inline-block', marginBottom: '16px',
                  }}
                >
                  {project.tag}
                </span>

                <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 0.95, marginBottom: '10px' }}>
                  {project.name}
                </h2>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#00B4FF', marginBottom: '14px' }}>
                  {project.subtitle}
                </p>

                <div style={{ width: '20px', height: '1px', background: 'rgba(255,45,85,0.5)', marginBottom: '14px' }} />

                <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.78, marginBottom: '28px' }}>
                  {project.description}
                </p>

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shimmer-btn inline-flex items-center gap-2.5 self-start transition-all duration-300"
                    style={{
                      fontFamily: 'JetBrains Mono', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: '#040408', background: '#00B4FF', padding: '11px 22px', borderRadius: '2px',
                      boxShadow: '0 0 30px rgba(0,180,255,0.15)',
                    }}
                  >
                    {getContentValue('work_page', 'project_link_label', 'View live project')}
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Marquee />

      {/* CTA footer */}
      <section className="py-20 md:py-28">
        <div className="max-w-[640px] mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.5)', marginBottom: '16px' }}>
              — Start a project
            </p>
            <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(36px,5vw,64px)', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 0.95, marginBottom: '14px' }}>
              {getContentValue('work_page', 'cta_title', 'Have a build that needs traction?')}
            </h2>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75, marginBottom: '28px' }}>
              {getContentValue('work_page', 'cta_description', 'We can scope the work, call out the risks, and tell you what should happen in the first release.')}
            </p>
            <Link
              to="/contact"
              className="shimmer-btn inline-flex items-center gap-2.5"
              style={{
                fontFamily: 'JetBrains Mono', fontSize: '12px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: '#040408', background: '#00B4FF', padding: '14px 28px', borderRadius: '2px',
                boxShadow: '0 0 40px rgba(0,180,255,0.2)',
              }}
            >
              {getContentValue('work_page', 'cta_button', 'Start the conversation')}
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
