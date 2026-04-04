import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Hero() {
  const { content, getContentValue, projectCount } = useContent();
  const hasStoredCount = content.some((i) => i.section === 'portfolio' && i.key === 'project_count');
  const featuredProject = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount)[0];

  const line1 = getContentValue('hero', 'headline_line1', 'Small teams need fast systems');
  const line2 = getContentValue('hero', 'headline_line2', 'not vague agency timelines.');

  const stats = [
    { value: getContentValue('hero', 'stat_1_number', '5'),      label: getContentValue('hero', 'stat_1_label', 'Senior builders') },
    { value: getContentValue('hero', 'stat_2_number', '1-3'),    label: getContentValue('hero', 'stat_2_label', 'Week delivery') },
    { value: getContentValue('hero', 'stat_3_number', 'Always'), label: getContentValue('hero', 'stat_3_label', 'Post-launch iteration') },
  ];

  const systemSpecs = [
    { label: getContentValue('hero', 'spec_1_label', 'Delivery mode'), value: getContentValue('hero', 'spec_1_value', 'Embedded sprint') },
    { label: getContentValue('hero', 'spec_2_label', 'Iteration cycle'), value: getContentValue('hero', 'spec_2_value', '48-hour checkpoints') },
    { label: getContentValue('hero', 'spec_3_label', 'Stack bias'), value: getContentValue('hero', 'spec_3_value', 'React + TypeScript + Supabase') },
    { label: getContentValue('hero', 'spec_4_label', 'Launch profile'), value: getContentValue('hero', 'spec_4_value', 'Content-ready + measurable') },
  ];

  return (
    <section className="section-pad swiss-section relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_15%,rgba(95,160,255,0.12),transparent_58%)]" />
      <span className="swiss-meta swiss-meta--tl">grid:12x12</span>
      <span className="swiss-meta swiss-meta--tr">v2.6 // hero.matrix</span>

      <div className="relative z-10 site-container swiss-grid">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="archive-panel swiss-full-col grid gap-4 p-4 md:grid-cols-3 md:p-6"
        >
          <div>
            <p className="archive-tag mb-2">subject no:</p>
            <p className="mono-readable text-[11px] uppercase text-[rgba(174,198,235,0.88)]">{getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}</p>
          </div>
          <div>
            <p className="archive-tag mb-2">status:</p>
            <p className="mono-readable text-[11px] uppercase text-[rgba(255,44,27,0.95)]">{getContentValue('hero', 'proof_kicker', 'System specs')}</p>
          </div>
          <div>
            <p className="archive-tag mb-2">timestamp:</p>
            <p className="mono-readable text-[11px] uppercase text-[rgba(174,198,235,0.88)]">{getContentValue('hero', 'proof_title', 'Creative builds that still respect real deadlines.')}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="archive-panel swiss-full-col relative mt-2 overflow-hidden"
        >
          <div className="absolute left-5 top-4 z-10 border border-[rgba(255,44,27,0.55)] bg-[rgba(2,18,52,0.84)] px-3 py-1">
            <span className="archive-tag">specimen feed</span>
          </div>

          <div className="relative h-[420px] md:h-[620px]">
            {featuredProject?.image ? (
              <img
                src={featuredProject.image}
                alt={featuredProject.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(132,179,255,0.46)_0%,rgba(10,34,77,0.88)_55%,rgba(2,18,52,1)_100%)]" />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(1,14,42,0.94)_10%,rgba(1,14,42,0.2)_55%,rgba(1,14,42,0.72)_100%)]" />

            <div className="absolute bottom-16 left-5 right-5 text-left md:left-10 md:right-auto md:w-[68%] lg:w-1/2">
              <h1
                className="display-hero text-[#dbe4f8]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: 'clamp(48px, 10vw, 148px)',
                  fontStyle: 'italic',
                }}
              >
                <span className="block">{line1}</span>
                <span className="block" style={{ color: 'rgba(229,235,246,0.95)' }}>{line2}</span>
              </h1>
            </div>

            <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
              <span className="mono-readable text-[10px] uppercase text-[rgba(170,194,229,0.88)]">{featuredProject?.tag || 'Live release'}</span>
              <span className="archive-tag">{featuredProject?.name || 'Active specimen'}</span>
            </div>
          </div>
        </motion.div>

        <div className="swiss-full-col mt-8 grid gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease }}
            className="archive-panel lg:col-span-6 p-6"
          >
            <p className="archive-tag mb-4">morphology report</p>
            <p
              className="reading-track text-[15px] text-[rgba(172,193,226,0.9)] md:text-[17px]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              {getContentValue('hero', 'subheadline', 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.')}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="shimmer-btn flex items-center justify-center gap-2.5 bg-accent px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[#021234] transition-all duration-300 hover:brightness-110"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {getContentValue('hero', 'cta_primary', 'Start a project')} <ArrowRight size={14} />
              </Link>
              <Link
                to="/work"
                className="flex items-center justify-center gap-2.5 border border-[rgba(140,170,220,0.42)] px-8 py-4 text-[11px] uppercase tracking-[0.2em] text-[rgba(188,208,240,0.9)] transition-colors duration-300 hover:text-white"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {getContentValue('hero', 'cta_secondary', 'See shipped work')}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease, delay: 0.08 }}
            className="archive-panel lg:col-span-6 p-6"
          >
            <p className="archive-tag mb-5">biometric data</p>

            <div className="grid gap-4">
              {systemSpecs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[120px_1fr] items-start gap-4 border-b border-[rgba(140,170,220,0.22)] pb-3">
                  <p className="archive-tag" style={{ color: 'rgba(255,44,27,0.92)' }}>{spec.label}</p>
                  <p className="mono-readable text-[11px] uppercase text-[rgba(170,194,229,0.88)]">{spec.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {stats.slice(0, 4).map((stat, i) => (
                <div key={i} className="border border-[rgba(140,170,220,0.28)] bg-[rgba(4,20,50,0.82)] p-4">
                  <p className="archive-tag" style={{ color: 'rgba(255,44,27,0.92)' }}>metric_{String(i + 1).padStart(2, '0')}</p>
                  <p
                    className="mt-2 text-[44px] leading-none text-[#dfe7f8]"
                    style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic' }}
                  >
                    {stat.value}
                  </p>
                  <p className="mono-readable mt-2 text-[10px] uppercase text-[rgba(158,182,219,0.82)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
