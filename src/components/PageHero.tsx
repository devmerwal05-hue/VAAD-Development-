import { motion, type Variants } from 'framer-motion';
import { useContent } from '../lib/useContent';

interface PageHeroProps {
  description: string;
  eyebrow: string;
  titleBefore: string;
  titleHighlight: string;
}

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const heroVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease },
  },
};

export default function PageHero({
  description,
  eyebrow,
  titleBefore,
  titleHighlight,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pb-10 pt-28 md:pt-36">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px]"
        style={{
          backgroundImage: 'linear-gradient(rgba(108,99,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.02) 1px, transparent 1px)',
          backgroundSize: '64px 64px'
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="max-w-[820px]"
        >
          <div
            className="mb-8 inline-flex items-center gap-2.5 rounded-[4px] border border-[rgba(108,99,255,0.15)] bg-[rgba(108,99,255,0.06)] px-3.5 py-1.5"
          >
            <span
              className="h-1 w-1 rounded-full bg-accent"
              style={{
                background: 'var(--color-accent)',
                boxShadow: '0 0 8px var(--color-accent-glow)',
                flexShrink: 0
              }}
            />
            <span
              className="text-[10px] font-[500] uppercase tracking-[0.2em] text-[rgba(108,99,255,0.85)]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {eyebrow}
            </span>
          </div>

          <h1
            className="mb-8 text-[clamp(2.8rem,8vw,6rem)] font-[800] uppercase leading-[0.92] tracking-[-0.05em] text-text-primary"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {titleBefore}{' '}
            <span className="gradient-text-blue">{titleHighlight}</span>
          </h1>

          <p
            className="max-w-[52ch] text-[15px] leading-[1.85] text-text-secondary md:text-[18px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
