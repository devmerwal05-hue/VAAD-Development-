import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Marquee from '../components/Marquee';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.22, 0.03, 0.26, 1];

export default function WorkPage() {
  const { content, getContentValue, projectCount } = useContent();
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  usePageMetadata({
    title: getContentValue('seo', 'work_title', 'VAAD Development | Selected projects'),
    description: getContentValue('seo', 'work_description', 'Recent website and web application builds from VAAD Development, including e-commerce, operations tooling, and launch-focused product work.'),
    path: '/work',
  });

  const hoveredProject = hoveredIndex !== null ? projects[hoveredIndex] : null;

  return (
    <PageWrapper>
      <section className="relative overflow-hidden pb-12 pt-28 md:pt-36">
        <div className="absolute inset-x-0 top-0 h-[320px] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,180,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px', opacity: 0.6 }} />
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="max-w-[760px] relative z-10"
          >
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
              {getContentValue('work_page', 'description', 'A text index when you want the shortlist fast, and richer cards when you want the surface, stack, and delivery context.')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[520px]">
              <p
                className="text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.48)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                View mode
              </p>
              <p className="mt-2 text-[15px] leading-[1.8] text-text-secondary">
                Switch between the visual case-study cards and a restrained project index.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.72)] p-1">
              {[
                { mode: 'cards' as const, label: 'Cards', icon: LayoutGrid },
                { mode: 'list' as const, label: 'List', icon: List },
              ].map(({ mode, label, icon: Icon }) => {
                const active = viewMode === mode;

                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: active ? '#030308' : '#E8E8F0',
                      background: active ? '#00D4FF' : 'transparent',
                    }}
                    data-cursor-label={mode}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-[rgba(232,232,240,0.08)] bg-[rgba(7,8,16,0.88)]">
            <AnimatePresence>
              {hoveredProject?.image ? (
                <motion.div
                  key={hoveredProject.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.24 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute inset-0"
                >
                  <img src={hoveredProject.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,8,0.92),rgba(3,3,8,0.64),rgba(3,3,8,0.92))]" />
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="relative z-10">
              {viewMode === 'cards' ? (
                <div className="flex flex-col gap-px">
                  {projects.map((project, index) => (
                    <motion.article
                      key={`${project.name}-${project.year || index}`}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.08 }}
                      transition={{ duration: 0.65, ease, delay: index * 0.04 }}
                      className="grid grid-cols-1 gap-px lg:grid-cols-[minmax(0,0.52fr)_minmax(0,0.48fr)]"
                      style={{ background: 'rgba(232,232,240,0.05)' }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
                    >
                      <div className="relative overflow-hidden min-h-[320px] bg-[rgba(10,12,25,0.92)]">
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at 18% 18%, color-mix(in srgb, ${project.accentSolid} 26%, transparent), transparent 22%), linear-gradient(${project.gradientAngle}, rgba(6,8,18,0.24), rgba(6,8,18,0.92))`,
                          }}
                        />
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 hover:scale-[1.06]"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,8,0.12),rgba(3,3,8,0.12),rgba(3,3,8,0.82))]" />
                      </div>

                      <div
                        className="flex flex-col justify-between bg-[rgba(8,10,20,0.96)] p-8 md:p-10"
                        data-cursor-accent={project.accentSolid}
                      >
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className="rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]"
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                color: project.accentSolid,
                                background: `color-mix(in srgb, ${project.accentSolid} 12%, transparent)`,
                                border: `1px solid color-mix(in srgb, ${project.accentSolid} 32%, transparent)`,
                              }}
                            >
                              {project.tag}
                            </span>
                            <span
                              className="text-[10px] uppercase tracking-[0.24em] text-[rgba(232,232,240,0.44)]"
                              style={{ fontFamily: 'JetBrains Mono, monospace' }}
                            >
                              {project.year}
                            </span>
                          </div>

                          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(32px,4vw,56px)', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 0.95, marginTop: '20px' }}>
                            {project.name}
                          </h2>
                          <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: project.accentSolid, marginTop: '12px' }}>
                            {project.subtitle}
                          </p>
                          <p style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.82, marginTop: '24px' }}>
                            {project.description}
                          </p>
                        </div>

                        <div className="mt-8">
                          {project.credits.length > 0 ? (
                            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(232,232,240,0.48)', marginBottom: '18px' }}>
                              {`Built with: ${project.credits.join(' / ')}`}
                            </p>
                          ) : null}

                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-text-primary transition-transform duration-300 hover:-translate-y-0.5"
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                borderColor: `color-mix(in srgb, ${project.accentSolid} 28%, transparent)`,
                                background: `color-mix(in srgb, ${project.accentSolid} 12%, transparent)`,
                              }}
                              data-cursor-label="open"
                              data-cursor-accent={project.accentSolid}
                            >
                              {getContentValue('work_page', 'project_link_label', 'View live project')}
                              <ExternalLink size={13} />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col">
                  {projects.map((project, index) => (
                    <a
                      key={`${project.name}-${project.year || index}`}
                      href={project.url || undefined}
                      target={project.url ? '_blank' : undefined}
                      rel={project.url ? 'noopener noreferrer' : undefined}
                      className="group grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-[rgba(232,232,240,0.08)] px-6 py-6 transition-colors hover:bg-[rgba(255,255,255,0.02)] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_120px_40px]"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex((current) => (current === index ? null : current))}
                      data-cursor-accent={project.accentSolid}
                      data-cursor-label={project.url ? 'open' : 'view'}
                    >
                      <div>
                        <p style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px,4vw,42px)', letterSpacing: '0.03em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 0.95 }}>
                          {project.name}
                        </p>
                        <p
                          className="mt-2 text-[11px] uppercase tracking-[0.22em]"
                          style={{ fontFamily: 'JetBrains Mono, monospace', color: project.accentSolid }}
                        >
                          {project.tag}
                        </p>
                      </div>

                      <div className="hidden md:block">
                        <p className="text-[15px] leading-[1.75] text-text-secondary">{project.subtitle}</p>
                        {project.credits.length > 0 ? (
                          <p
                            className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[rgba(232,232,240,0.44)]"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            {project.credits.join(' / ')}
                          </p>
                        ) : null}
                      </div>

                      <p
                        className="self-center text-right text-[11px] uppercase tracking-[0.24em] text-[rgba(232,232,240,0.46)]"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {project.year}
                      </p>

                      <div className="flex items-center justify-end text-[rgba(232,232,240,0.58)] transition-colors group-hover:text-text-primary">
                        <ExternalLink size={16} />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="py-20 md:py-28">
        <div className="max-w-[640px] mx-auto px-6 md:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease }}
          >
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.5)', marginBottom: '16px' }}>
              Start a project
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
