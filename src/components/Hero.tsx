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

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-5 pt-28 pb-20 md:pt-36 md:pb-28">
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

      <div className="relative z-10 max-w-[1360px] mx-auto grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-12 items-center">

        {/* ── LEFT — Editorial copy ── */}
        <div>
          {/* Specimen label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
            className="flex items-center gap-3 mb-10"
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
            className="my-7 h-[1px] max-w-[280px]"
            style={{ background: 'linear-gradient(90deg, #E8132A, rgba(232,19,42,0.1))', transformOrigin: 'left' }}
          />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="text-[15px] md:text-[17px] max-w-[580px] leading-[1.85]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.65)' }}
          >
            {getContentValue('hero', 'subheadline', 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.')}
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.42 }}
            className="flex flex-col sm:flex-row gap-3 mt-9"
          >
            <Link
              to="/contact"
              className="shimmer-btn flex items-center gap-2.5 justify-center sm:justify-start px-7 py-[14px] text-[#EAE6DB] text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:shadow-[0_0_40px_rgba(232,19,42,0.3)]"
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
              className="flex items-center gap-2.5 justify-center sm:justify-start px-7 py-[14px] text-[rgba(234,230,219,0.7)] text-[11px] tracking-[0.18em] uppercase border border-[rgba(234,230,219,0.18)] hover:border-[rgba(232,19,42,0.5)] hover:text-[#EAE6DB] transition-all duration-300"
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
            className="grid grid-cols-3 gap-0 mt-12 border border-[rgba(232,19,42,0.14)]"
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                className="px-4 py-4 flex flex-col gap-2"
                style={{ borderRight: i < 2 ? '1px solid rgba(232,19,42,0.14)' : undefined }}
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
            <div className="px-5 py-3 border-b border-[rgba(232,19,42,0.1)] flex items-center justify-between">
              <div>
                <p className="section-ref">{getContentValue('hero', 'proof_kicker', 'Live delivery board')}</p>
                <p
                  className="text-[12px] mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(234,230,219,0.5)' }}
                >
                  {getContentValue('hero', 'proof_title', 'Creative builds that still respect real deadlines.')}
                </p>
              </div>
              {/* Status dot */}
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }}
                />
                <span className="annotation-label">LIVE</span>
              </div>
            </div>

            {/* Featured project */}
            <div className="grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[300px]">
                {featuredProject?.image ? (
                  <img
                    src={featuredProject.image}
                    alt={featuredProject.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(232,19,42,0.18), rgba(6,30,80,0.8), rgba(9,40,100,0.6))' }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,22,40,0.95)] via-[rgba(9,22,40,0.2)] to-transparent" />
                <div className="absolute left-5 right-5 bottom-5">
                  <p className="section-ref mb-2">{featuredProject?.tag || 'Featured release'}</p>
                  <h2
                    className="text-[#EAE6DB]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 900,
                      fontSize: 'clamp(24px, 3vw, 38px)',
                      lineHeight: 0.9,
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {featuredProject?.name || 'Launch-ready systems'}
                  </h2>
                  <p
                    className="text-[13px] mt-3 max-w-[38ch] leading-[1.7]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.55)' }}
                  >
                    {getContentValue('hero', 'proof_description', 'Each release is scoped against launch pressure, content reality, and what your team can maintain after handoff.')}
                  </p>
                </div>
              </div>

              {/* Stats sidebar */}
              <div className="flex flex-col border-l border-[rgba(232,19,42,0.1)]">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 px-5 py-5"
                    style={{ borderBottom: '1px solid rgba(232,19,42,0.08)' }}
                  >
                    <span className="annotation-label">Metric&nbsp;{String(i + 1).padStart(2, '0')}</span>
                    <p
                      className="text-[#EAE6DB]"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 26, lineHeight: 1 }}
                    >
                      {stat.value}
                    </p>
                    <p className="text-[12px]" style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(234,230,219,0.45)' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
                <div className="px-5 py-4 mt-auto">
                  <p
                    className="text-[11px] leading-[1.7]"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(232,19,42,0.6)' }}
                  >
                    {getContentValue('hero', 'proof_note', 'The homepage pulls from the same editable content system used by the admin panel.')}
                  </p>
                </div>
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
