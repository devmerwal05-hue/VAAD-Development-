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
    <section className="relative min-h-[100svh] overflow-hidden px-6 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Atmospheric gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-gradient-1 absolute inset-0" />
        <div className="hero-gradient-2 absolute inset-0" />
      </div>

      {/* Deep vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #060C20 90%)' }}
      />

      {/* Horizontal rules */}
      <div className="absolute top-[50%] left-0 right-0 h-[1px] opacity-10 pointer-events-none" style={{ background: 'rgba(232,19,42,0.6)' }} />

      <div className="relative z-10 site-container grid grid-cols-1 items-center gap-12 xl:grid-cols-[1.2fr_0.8fr] xl:gap-16">

        {/* ── LEFT — Editorial copy ── */}
        <div className="corner-marks border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.7)] px-6 py-8 md:px-8 md:py-12">
          {/* Specimen label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
            className="mb-12 flex items-center gap-4"
          >
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
            <span className="section-ref">{getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}</span>
            <div className="flex-1 h-[1px] max-w-[120px]" style={{ background: 'rgba(232,19,42,0.3)' }} />
          </motion.div>

          {/* Main headline — Playfair Display editorial */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="text-[#EAE6DB]"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              lineHeight: 0.88,
              letterSpacing: '-0.03em',
              fontSize: 'clamp(44px, 7vw, 108px)',
            }}
          >
            <span className="block">{line1}</span>
            <span className="block italic" style={{ color: '#E8132A', marginTop: '0.08em' }}>{line2}</span>
          </motion.h1>

          {/* Rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="my-8 h-[1px] max-w-[280px]"
            style={{ background: 'linear-gradient(90deg, #E8132A, rgba(232,19,42,0.1))', transformOrigin: 'left' }}
          />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="reading-track max-w-[580px] text-[15px] leading-[1.85] md:text-[17px]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.65)' }}
          >
            {getContentValue('hero', 'subheadline', 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.')}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.42 }}
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              to="/contact"
              className="shimmer-btn flex items-center justify-center gap-2.5 px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-[#EAE6DB] transition-all duration-300 hover:shadow-[0_0_40px_rgba(232,19,42,0.3)] sm:justify-start"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 600,
                background: '#E8132A',
                border: '1px solid #E8132A',
              }}
            >
              {getContentValue('hero', 'cta_primary', 'Start a project')} <ArrowRight size={14} />
            </Link>
            <Link
              to="/work"
              className="flex items-center justify-center gap-2.5 border border-[rgba(234,230,219,0.18)] px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-[rgba(234,230,219,0.7)] transition-all duration-300 hover:border-[rgba(232,19,42,0.5)] hover:text-[#EAE6DB] sm:justify-start"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
            >
              {getContentValue('hero', 'cta_secondary', 'See shipped work')}
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.55 }}
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 border border-[rgba(232,19,42,0.18)] bg-[rgba(6,12,32,0.5)] px-4 py-4"
              >
                <p
                  className="text-[#EAE6DB]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(22px, 3vw, 34px)', lineHeight: 1 }}
                >
                  {stat.value}
                </p>
                <p className="annotation-label leading-[1.4]">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT — Data panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease, delay: 0.2 }}
          className="relative"
        >
          {/* Atmospheric blobs */}
          <div className="absolute -top-12 -right-8 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(232,19,42,0.08)' }} />
          <div className="absolute -bottom-10 -left-6 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(6,30,80,0.8)' }} />

          {/* Panel wrapper */}
          <div
            className="relative corner-marks"
            style={{
              border: '1px solid rgba(232,19,42,0.16)',
              background: 'rgba(9, 22, 40, 0.88)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-[rgba(232,19,42,0.1)] px-6 py-4">
              <div>
                <p className="section-ref">{getContentValue('hero', 'proof_kicker', 'System specs')}</p>
                <p className="annotation-label mt-2">LIVE // DENSITY MODE</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }}
                />
                <span className="annotation-label">SYNC</span>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid gap-4">
                {systemSpecs.map((spec) => (
                  <div key={spec.label} className="grid grid-cols-[130px_1fr] items-start gap-4 border-b border-[rgba(232,19,42,0.08)] pb-4">
                    <p className="annotation-label" style={{ color: 'rgba(232,19,42,0.7)' }}>{spec.label}</p>
                    <p
                      className="text-[11px] uppercase tracking-[0.12em]"
                      style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 300, color: 'rgba(234,230,219,0.65)' }}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, i) => (
                  <div key={i} className="border border-[rgba(232,19,42,0.16)] bg-[rgba(6,12,32,0.42)] px-4 py-4">
                    <p className="annotation-label" style={{ color: 'rgba(232,19,42,0.6)' }}>Metric {String(i + 1).padStart(2, '0')}</p>
                    <p
                      className="mt-3 text-[#EAE6DB]"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 28, lineHeight: 0.95 }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-2 text-[11px]" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(234,230,219,0.52)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-[rgba(232,19,42,0.16)] bg-[rgba(6,12,32,0.38)] px-4 py-4">
                <p className="annotation-label" style={{ color: 'rgba(232,19,42,0.65)' }}>Current focus</p>
                <p
                  className="mt-3 text-[13px]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: '#EAE6DB', letterSpacing: '-0.02em' }}
                >
                  {featuredProject?.name || 'Launch-ready systems'}
                </p>
                <p className="mt-3 text-[11px] leading-[1.7]" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(234,230,219,0.58)' }}>
                  {getContentValue('hero', 'proof_note', 'The homepage pulls from the same editable content system used by the admin panel.')}
                </p>
              </div>
            </div>
          </div>

          {/* Annotation coordinates */}
          <div className="flex justify-between mt-2 px-1">
            <span className="annotation-label">X:0 Y:0</span>
            <span className="annotation-label">FRAME / 001</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="annotation-label">scroll</span>
        <div className="w-[1px] h-6 scroll-indicator-line" />
      </div>
    </section>
  );
}
