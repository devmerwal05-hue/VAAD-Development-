import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Hero() {
  const { content, getContentValue, projectCount } = useContent();
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const featuredProject = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount)[0];
  const line1 = getContentValue('hero', 'headline_line1', 'Small teams need fast systems');
  const line2 = getContentValue('hero', 'headline_line2', 'not timeline guesswork.');

  const statDefaults = [
    { value: '5', label: 'Senior builders' },
    { value: '1-3', label: 'Week delivery' },
    { value: 'Always', label: 'Post-launch iteration' },
  ];
  
  const storedStatCount = Number(getContentValue('hero', 'stat_count', ''));
  const statCount = (!isNaN(storedStatCount) && storedStatCount > 0) ? storedStatCount : statDefaults.length;

  const stats = Array.from({ length: statCount }, (_, index) => ({
    value: getContentValue('hero', `stat_${index + 1}_number`, statDefaults[index]?.value || ''),
    label: getContentValue('hero', `stat_${index + 1}_label`, statDefaults[index]?.label || ''),
  })).filter(s => s.value);

  return (
    <section className="relative min-h-[92svh] md:min-h-[100svh] overflow-hidden px-5 pt-24 pb-14 md:pt-36 md:pb-24">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-gradient-1 absolute inset-0" />
        <div className="hero-gradient-2 absolute inset-0" />
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-[10%] w-[220px] h-[220px] md:w-[300px] md:h-[300px] rounded-full pointer-events-none opacity-20 md:opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C6FF7] to-[#A855F7] rounded-full blur-[80px] float-orb" />
      </div>
      <div className="absolute bottom-16 right-[5%] w-[180px] h-[180px] md:bottom-20 md:w-[250px] md:h-[250px] rounded-full pointer-events-none opacity-15 md:opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#22D3EE] to-[#7C6FF7] rounded-full blur-[60px] float-orb-slow" />
      </div>
      
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.04), transparent 35%), radial-gradient(ellipse at center, transparent 18%, #06060C 78%)' }} />

      <div className="relative z-10 max-w-[1360px] mx-auto grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-8 xl:gap-10 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full glass border-shimmer"
            style={{ background: 'rgba(124,111,247,0.08)' }}
          >
            <Sparkles size={13} className="text-accent-light animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-medium tracking-[0.14em] uppercase text-accent-light" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
              {getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease, delay: 0.12 }}
            className="text-text-primary"
            style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.02em', fontSize: 'clamp(34px, 10.8vw, 108px)' }}
          >
            <span className="block">{line1}</span>
            <span className="block gradient-text-enhanced">{line2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.62, ease, delay: 0.28 }}
            className="text-[14px] sm:text-[15px] md:text-[18px] text-text-secondary max-w-[620px] mt-6 md:mt-7 leading-[1.8]"
            style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
          >
            {getContentValue('hero', 'subheadline', 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mt-7 md:mt-8"
          >
            <Link to="/contact" className="shimmer-btn gradient-bg text-white px-7 md:px-8 py-4 rounded-2xl text-[14px] md:text-[15px] font-medium shadow-[0_8px_50px_rgba(124,111,247,0.28)] flex items-center gap-2.5 w-full sm:w-auto justify-center btn-glow" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
              {getContentValue('hero', 'cta_primary', 'Start a project')} <ArrowRight size={16} className="btn-arrow-icon" />
            </Link>
            <Link to="/work" className="text-text-primary px-7 md:px-8 py-4 rounded-2xl text-[14px] md:text-[15px] font-medium border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 w-full sm:w-auto text-center btn-arrow" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
              {getContentValue('hero', 'cta_secondary', 'See shipped work')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 md:mt-10"
          >
            {stats.map((stat, index) => (
              <div key={stat.label + index} className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,20,0.72)] px-4 py-4 backdrop-blur-sm glass card-hover">
                <p className="text-[24px] md:text-[30px] text-text-primary gradient-text-enhanced" style={{ fontFamily: 'Syne', fontWeight: 800 }}>{stat.value}</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary mt-2">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -top-10 -right-6 w-36 h-36 rounded-full bg-[rgba(236,72,153,0.12)] blur-3xl" />
          <div className="absolute -bottom-8 -left-4 w-44 h-44 rounded-full bg-[rgba(34,211,238,0.1)] blur-3xl" />

          <div className="relative rounded-[32px] border border-[rgba(255,255,255,0.08)] bg-[rgba(8,8,14,0.86)] backdrop-blur-md overflow-hidden">
            <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-accent-light" style={{ fontFamily: 'JetBrains Mono' }}>
                  {getContentValue('hero', 'proof_kicker', 'Live delivery board')}
                </p>
                <p className="text-[13px] text-text-secondary mt-1">
                  {getContentValue('hero', 'proof_title', 'Creative builds that still respect real deadlines.')}
                </p>
              </div>
              <span className="text-[12px] text-text-tertiary">Home</span>
            </div>

            <div className="grid grid-cols-1">
              <div className="relative min-h-[320px]">
                {featuredProject?.image ? (
                  <img src={featuredProject.image} alt={featuredProject.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                ) : (
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(124,111,247,0.32), rgba(34,211,238,0.12), rgba(236,72,153,0.18))' }} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,9,0.95)] via-[rgba(5,5,9,0.24)] to-transparent" />
                <div className="absolute left-5 right-5 bottom-5">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-accent-light mb-2">{featuredProject?.tag || 'Featured release'}</p>
                  <h2 className="text-[28px] md:text-[36px] text-text-primary" style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
                    {featuredProject?.name || 'Launch-ready systems'}
                  </h2>
                  <p className="text-[14px] text-text-secondary mt-3 max-w-[40ch]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                    {getContentValue('hero', 'proof_description', 'Each release is scoped against launch pressure, content reality, and what your team can maintain after handoff.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.2em] text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>scroll</span>
        <div className="w-[1px] h-[24px] bg-accent/30 scroll-indicator-line" />
      </div>
    </section>
  );
}
