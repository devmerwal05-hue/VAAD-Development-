import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';
import StaggeredText from './StaggeredText';

export default function Hero() {
  const { content, getContentValue, projectCount } = useContent();
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const featuredProject = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount)[0];
  const line1 = getContentValue('hero', 'headline_line1', 'Small teams need fast systems');
  const line2 = getContentValue('hero', 'headline_line2', 'not timeline guesswork.');

  const statDefaults = [
    { value: '5', label: 'Senior builders' },
    { value: '1–3', label: 'Week delivery' },
    { value: 'Always', label: 'Post-launch support' },
  ];

  const storedStatCount = Number(getContentValue('hero', 'stat_count', ''));
  const statCount = (!isNaN(storedStatCount) && storedStatCount > 0) ? storedStatCount : statDefaults.length;
  const stats = Array.from({ length: statCount }, (_, index) => ({
    value: getContentValue('hero', `stat_${index + 1}_number`, statDefaults[index]?.value || ''),
    label: getContentValue('hero', `stat_${index + 1}_label`, statDefaults[index]?.label || ''),
  })).filter(s => s.value);

  return (
    <section className="relative min-h-[100svh] overflow-hidden px-6 md:px-10 pt-28 pb-16 md:pt-40 md:pb-28">

      {/* Scan-line grid */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Ambient gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-gradient-1 absolute inset-0" />
        <div className="hero-gradient-2 absolute inset-0" />
      </div>

      {/* Floating orbs */}
      <div className="absolute top-16 left-[8%] w-[280px] h-[280px] rounded-full pointer-events-none opacity-20" style={{ background: 'radial-gradient(circle, rgba(0,180,255,0.35) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-20 right-[4%] w-[220px] h-[220px] rounded-full pointer-events-none opacity-15" style={{ background: 'radial-gradient(circle, rgba(255,45,85,0.3) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10 xl:gap-14 items-center">

        {/* LEFT: Copy */}
        <div>
          {/* Eyebrow badge - scale in first */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0 }}
            className="inline-flex items-center gap-2.5 mb-10 border-shimmer"
            style={{
              background: 'rgba(0,180,255,0.06)',
              border: '1px solid rgba(0,180,255,0.15)',
              padding: '6px 14px',
              borderRadius: '2px',
            }}
          >
            <Zap size={11} style={{ color: '#00B4FF' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.8)' }}>
              {getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}
            </span>
          </motion.div>

          {/* Headline with staggered reveal */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              fontFamily: 'Bebas Neue',
              fontWeight: 400,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              lineHeight: 0.92,
              fontSize: 'clamp(58px, 10vw, 116px)',
              color: '#F0EDE6',
            }}
          >
            <StaggeredText text={line1} delay={100} staggerDelay={40} className="block" />
            <span style={{ color: '#00B4FF' }}><StaggeredText text={line2} delay={100 + line1.length * 40} staggerDelay={40} className="block" /></span>
          </motion.h1>

          {/* Sub - reveals after headline stagger */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="max-w-[560px] mt-7 md:mt-8"
            style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(14px,1.1vw,17px)', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.8 }}
          >
            {getContentValue('hero', 'subheadline', 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.')}
          </motion.p>

          {/* CTAs - reveal after featured project */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-10"
          >
            <Link
              to="/contact"
              className="shimmer-btn inline-flex items-center justify-center gap-2.5"
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#040408',
                background: '#00B4FF',
                padding: '14px 28px',
                borderRadius: '2px',
                boxShadow: '0 0 40px rgba(0,180,255,0.25)',
              }}
            >
              {getContentValue('hero', 'cta_primary', 'Start a project')}
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center justify-center gap-2.5 transition-colors duration-200"
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#8A8AA0',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '14px 28px',
                borderRadius: '2px',
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#F0EDE6'; el.style.borderColor = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = '#8A8AA0'; el.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              {getContentValue('hero', 'cta_secondary', 'See shipped work')}
            </Link>
          </motion.div>

          {/* Stats - reveal after CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="grid grid-cols-3 gap-px mt-10 md:mt-12"
            style={{ border: '1px solid rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label + index}
                className="px-4 py-5"
                style={{
                  background: '#07070F',
                  borderRight: index < stats.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <p style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px,3.5vw,44px)', letterSpacing: '0.04em', color: '#00B4FF', lineHeight: 1 }}>
                  {stat.value}
                </p>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', marginTop: '6px' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Featured project card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="relative"
        >
          {/* Corner decorations */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l pointer-events-none" style={{ borderColor: 'rgba(0,180,255,0.4)' }} />
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t border-r pointer-events-none" style={{ borderColor: 'rgba(0,180,255,0.4)' }} />
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b border-l pointer-events-none" style={{ borderColor: 'rgba(0,180,255,0.4)' }} />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r pointer-events-none" style={{ borderColor: 'rgba(0,180,255,0.4)' }} />

          <div
            className="overflow-hidden"
            style={{
              background: '#07070F',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px',
            }}
          >
            {/* Card header */}
            <div
              className="px-5 py-4 flex items-center justify-between gap-4"
              style={{ borderBottom: '1px solid rgba(0,180,255,0.08)' }}
            >
              <div>
                <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.7)' }}>
                  {getContentValue('hero', 'proof_kicker', 'Live delivery board')}
                </p>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 300, color: '#55556A', marginTop: '2px' }}>
                  {getContentValue('hero', 'proof_title', 'Creative builds that respect real deadlines.')}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2D55', flexShrink: 0 }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,45,85,0.7)' }}>Live</span>
              </div>
            </div>

            {/* Project image */}
            <div className="relative" style={{ minHeight: '340px' }}>
              {featuredProject?.image ? (
                <img
                  src={featuredProject.image}
                  alt={featuredProject.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover opacity-80"
                  style={{ transition: 'opacity 0.4s' }}
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(135deg, rgba(0,180,255,0.2) 0%, rgba(0,80,120,0.15) 50%, rgba(255,45,85,0.12) 100%)' }}
                />
              )}
              {/* Overlay */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,4,8,0.96) 0%, rgba(4,4,8,0.2) 50%, transparent 100%)' }} />

              {/* Tag */}
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
                {featuredProject?.tag || 'Featured release'}
              </span>

              {/* Project info */}
              <div className="absolute left-5 right-5 bottom-5">
                <h2
                  style={{
                    fontFamily: 'Bebas Neue',
                    fontSize: 'clamp(32px,4vw,52px)',
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                    color: '#F0EDE6',
                    lineHeight: 0.95,
                  }}
                >
                  {featuredProject?.name || 'Launch-ready systems'}
                </h2>
                <p
                  style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0', marginTop: '8px', maxWidth: '38ch' }}
                >
                  {getContentValue('hero', 'proof_description', 'Each release is scoped against launch pressure, content reality, and what your team can maintain after handoff.')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#55556A' }}>scroll</span>
        <div className="w-px h-6 scroll-indicator-line" style={{ background: 'rgba(0,180,255,0.4)' }} />
      </div>
    </section>
  );
}
