import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Hero() {
  const { getContentValue } = useContent();
  const line1 = getContentValue('hero', 'headline_line1', 'Small teams need fast systems');
  const line2 = getContentValue('hero', 'headline_line2', 'not vague agency timelines.');
  const words1 = line1.split(' ');
  const words2 = line2.split(' ');

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-5">
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-gradient-1 absolute inset-0" />
        <div className="hero-gradient-2 absolute inset-0" />
      </div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, #06060C 80%)' }} />

      <div className="relative z-10 text-center w-full max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 mb-8 md:mb-10 px-4 py-2 rounded-full"
          style={{ background: 'rgba(124,111,247,0.06)', border: '1px solid rgba(124,111,247,0.12)' }}
        >
          <span className="w-[6px] h-[6px] rounded-full bg-accent" />
          <span className="text-[10px] md:text-[11px] font-medium tracking-[0.12em] uppercase text-accent-light" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            {getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}
          </span>
        </motion.div>

        <h1 style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 0.88, letterSpacing: '-0.05em', fontSize: 'clamp(40px, 8vw, 110px)' }}>
          <span className="flex flex-wrap justify-center gap-x-[0.18em] mb-1 md:mb-2">
            {words1.map((word, index) => (
              <motion.span
                key={word + index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.2 + index * 0.07 }}
                className="text-text-primary inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className="flex flex-wrap justify-center gap-x-[0.18em]">
            {words2.map((word, index) => (
              <motion.span
                key={word + index}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.5 + index * 0.07 }}
                className="gradient-text inline-block"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.95 }}
          className="text-[14px] md:text-[17px] text-text-secondary max-w-[560px] mx-auto mt-7 mb-9 md:mt-10 md:mb-12 leading-[1.75]"
          style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
        >
          {getContentValue('hero', 'subheadline', 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 md:mb-16"
        >
          <Link to="/contact" className="shimmer-btn gradient-bg text-white px-7 md:px-8 py-3.5 md:py-4 rounded-2xl text-[14px] md:text-[15px] font-medium shadow-[0_4px_40px_rgba(124,111,247,0.3)] hover:shadow-[0_4px_60px_rgba(124,111,247,0.4)] transition-shadow duration-300 flex items-center gap-2.5 w-full sm:w-auto justify-center" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            {getContentValue('hero', 'cta_primary', 'Start a project')} <ArrowRight size={16} />
          </Link>
          <Link to="/work" className="text-text-primary px-7 md:px-8 py-3.5 md:py-4 rounded-2xl text-[14px] md:text-[15px] font-medium border-2 transition-all duration-300 hover:bg-[rgba(124,111,247,0.06)] hover:border-accent/30 w-full sm:w-auto text-center" style={{ fontFamily: 'DM Sans', fontWeight: 500, borderColor: 'rgba(255,255,255,0.08)' }}>
            {getContentValue('hero', 'cta_secondary', 'See shipped work')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 1.3 }}
          className="flex items-center justify-center gap-2 sm:gap-3"
        >
          {[
            { val: getContentValue('hero', 'stat_1_number', '5'), label: getContentValue('hero', 'stat_1_label', 'Senior Builders') },
            { val: getContentValue('hero', 'stat_2_number', '1-3'), label: getContentValue('hero', 'stat_2_label', 'Week Delivery') },
            { val: '∞', label: getContentValue('hero', 'stat_3_label', 'Post-launch iteration'), gradient: true },
          ].map((stat, index) => (
            <span key={index} className="perspective-container">
              <span className="tilt-card flex flex-col items-center px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl block" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span className={`text-[18px] sm:text-[24px] font-[800] ${stat.gradient ? 'gradient-text' : 'text-text-primary'}`} style={{ fontFamily: 'Syne' }}>{stat.val}</span>
                <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.08em] text-text-tertiary mt-0.5">{stat.label}</span>
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.2em] text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>scroll</span>
        <div className="w-[1px] h-[24px] bg-accent/30 scroll-indicator-line" />
      </div>
    </section>
  );
}
