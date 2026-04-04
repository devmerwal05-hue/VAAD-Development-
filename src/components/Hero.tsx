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
  const subheadline = getContentValue(
    'hero',
    'subheadline',
    'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.'
  );

  const stats = [
    { value: getContentValue('hero', 'stat_1_number', '5'), label: getContentValue('hero', 'stat_1_label', 'Senior builders') },
    { value: getContentValue('hero', 'stat_2_number', '1-3'), label: getContentValue('hero', 'stat_2_label', 'Week delivery') },
    { value: getContentValue('hero', 'stat_3_number', 'Always'), label: getContentValue('hero', 'stat_3_label', 'Post-launch iteration') },
  ];

  const systemSpecs = [
    { label: getContentValue('hero', 'spec_1_label', 'Delivery mode'), value: getContentValue('hero', 'spec_1_value', 'Embedded sprint') },
    { label: getContentValue('hero', 'spec_2_label', 'Iteration cycle'), value: getContentValue('hero', 'spec_2_value', '48-hour checkpoints') },
    { label: getContentValue('hero', 'spec_3_label', 'Stack bias'), value: getContentValue('hero', 'spec_3_value', 'React + TypeScript + Supabase') },
    { label: getContentValue('hero', 'spec_4_label', 'Launch profile'), value: getContentValue('hero', 'spec_4_value', 'Content-ready + measurable') },
  ];

  const infoCards = [
    {
      title: getContentValue('hero', 'info_1_title', 'Build brief'),
      text: getContentValue('hero', 'info_1_text', 'Clear scoping, focused execution, and handoff-ready delivery in one loop.'),
      image: getContentValue('hero', 'info_1_image', ''),
    },
    {
      title: getContentValue('hero', 'info_2_title', 'System specs'),
      text: getContentValue('hero', 'info_2_text', 'Critical constraints and architecture details.'),
      image: getContentValue('hero', 'info_2_image', ''),
    },
    {
      title: getContentValue('hero', 'info_3_title', 'Delivery metrics'),
      text: getContentValue('hero', 'info_3_text', 'Operational metrics for timeline confidence.'),
      image: getContentValue('hero', 'info_3_image', ''),
    },
  ];

  return (
    <section className="section-pad swiss-section relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_15%,rgba(95,160,255,0.12),transparent_58%)]" />
      <span className="swiss-meta swiss-meta--tl">hero.layout // 12-col</span>
      <span className="swiss-meta swiss-meta--tr">v3.0 // top-shell</span>

      <div className="relative z-10 site-container swiss-grid">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease }}
          className="swiss-full-col flex items-center justify-between border-b border-white/10 pb-5"
        >
          <span className="archive-tag text-[rgba(198,213,239,0.9)]">{getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}</span>
          <span className="archive-tag hidden md:block">{getContentValue('hero', 'proof_kicker', 'System specs')}</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="swiss-full-col mt-2 grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <h1
              className="display-hero text-[#e6edfa]"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 900,
                fontSize: 'clamp(56px, 11vw, 150px)',
                fontStyle: 'italic',
              }}
            >
              <span className="block">{line1}</span>
              <span className="block text-[rgba(239,244,255,0.95)]">{line2}</span>
            </h1>

            <p
              className="reading-track mt-8 text-[18px] leading-[1.85] text-[rgba(199,214,239,0.92)] md:text-[22px]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
            >
              {subheadline}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/contact"
                className="shimmer-btn inline-flex items-center justify-center gap-2.5 bg-accent px-9 py-4 text-[12px] uppercase tracking-[0.28em] text-[#050d22] transition-all duration-300 hover:brightness-110"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {getContentValue('hero', 'cta_primary', 'Start a project')} <ArrowRight size={14} />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center justify-center gap-2.5 border border-white/20 bg-black/30 px-9 py-4 text-[12px] uppercase tracking-[0.28em] text-[rgba(214,227,248,0.92)] transition-all duration-300 hover:border-white/35 hover:text-white"
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}
              >
                {getContentValue('hero', 'cta_secondary', 'See shipped work')}
              </Link>
            </div>
          </div>

          <div className="border border-white/10 bg-zinc-900/50 p-4 lg:col-span-4">
            <p className="archive-tag mb-3 text-[rgba(255,255,255,0.76)]">featured output</p>
            <div className="relative min-h-[220px] overflow-hidden border border-white/10">
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
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_8%,rgba(0,0,0,0.12)_55%)]" />
              <span className="archive-tag absolute bottom-3 left-3">{featuredProject?.tag || 'Live release'}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.62, ease, delay: 0.1 }}
          className="swiss-full-col mt-2 overflow-hidden border border-white/10 bg-zinc-900/50"
        >
          <div className="relative h-[280px] md:h-[380px]">
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

            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(8,10,14,0.9)_10%,rgba(8,10,14,0.18)_55%,rgba(8,10,14,0.7)_100%)]" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4">
              <span className="archive-tag text-[rgba(255,255,255,0.82)]">{featuredProject?.name || 'Active specimen'}</span>
              <span className="archive-tag">{getContentValue('hero', 'proof_title', 'Creative builds that still respect real deadlines.')}</span>
            </div>
          </div>
        </motion.div>

        <div className="swiss-full-col mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease }}
            className="border border-white/10 bg-zinc-900/50 p-5"
          >
            {infoCards[0].image && (
              <img src={infoCards[0].image} alt={infoCards[0].title} loading="lazy" decoding="async" className="mb-4 h-24 w-full object-cover" />
            )}
            <p className="archive-tag mb-3">{infoCards[0].title}</p>
            <p className="text-[16px] leading-[1.75] text-[rgba(213,226,248,0.9)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {infoCards[0].text}
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease, delay: 0.06 }}
            className="border border-white/10 bg-zinc-900/50 p-5"
          >
            {infoCards[1].image && (
              <img src={infoCards[1].image} alt={infoCards[1].title} loading="lazy" decoding="async" className="mb-4 h-24 w-full object-cover" />
            )}
            <p className="archive-tag mb-2">{infoCards[1].title}</p>
            <p className="mb-3 text-[14px] leading-[1.75] text-[rgba(194,210,236,0.86)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {infoCards[1].text}
            </p>
            <div className="grid gap-2">
              {systemSpecs.slice(0, 3).map((spec) => (
                <div key={spec.label} className="flex items-start justify-between gap-3 border-t border-white/10 pt-2">
                  <span className="archive-tag text-[rgba(255,255,255,0.72)]">{spec.label}</span>
                  <span className="mono-readable text-[11px] uppercase text-[rgba(184,202,231,0.88)]">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease, delay: 0.12 }}
            className="border border-white/10 bg-zinc-900/50 p-5"
          >
            {infoCards[2].image && (
              <img src={infoCards[2].image} alt={infoCards[2].title} loading="lazy" decoding="async" className="mb-4 h-24 w-full object-cover" />
            )}
            <p className="archive-tag mb-2">{infoCards[2].title}</p>
            <p className="mb-4 text-[14px] leading-[1.75] text-[rgba(194,210,236,0.86)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
              {infoCards[2].text}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {stats.slice(0, 3).map((stat, i) => (
                <div key={`${stat.label}-${i}`} className="border border-white/10 bg-black/30 p-3 text-center">
                  <p className="text-[34px] leading-none text-[#e8f0ff]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic' }}>
                    {stat.value}
                  </p>
                  <p className="mono-readable mt-2 text-[11px] uppercase text-[rgba(164,188,225,0.86)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
