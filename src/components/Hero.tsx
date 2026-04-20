import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { lazy, Suspense, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buildPortfolioProjects } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const StarField = lazy(() => import('./StarField'));

const heroShellVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const headlineRowVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.18 },
  },
};

const headlineWordVariants: Variants = {
  hidden: { opacity: 0, y: 72, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] },
  },
};

const glitchFrameVariants: Variants = {
  hidden: { opacity: 0, x: -12, scaleX: 1.04 },
  visible: {
    opacity: [0, 0.65, 0],
    x: [-14, 8, 0],
    scaleX: [1.04, 0.98, 1],
    transition: { duration: 0.42, times: [0, 0.35, 1], ease: 'easeOut' },
  },
};

const proofCardVariants: Variants = {
  hidden: { opacity: 0, y: 64, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 },
  },
};

const statGridVariants: Variants = {
  hidden: { opacity: 0.2, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.42, staggerChildren: 0.08 },
  },
};

const statCardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export interface HeroProps {
  className?: string;
}

interface HeadlineWordProps {
  accent?: boolean;
  children: string;
}

function HeadlineWord({ children, accent = false }: HeadlineWordProps) {
  return (
    <motion.span
      variants={headlineWordVariants}
      className="relative inline-flex overflow-hidden"
    >
      <motion.span
        variants={glitchFrameVariants}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: accent
            ? 'linear-gradient(90deg, transparent, rgba(0,212,255,0.45), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(108,99,255,0.42), transparent)',
          mixBlendMode: 'screen',
        }}
      />
      <span
        className={accent ? 'gradient-text-blue' : 'text-text-primary'}
        style={{ position: 'relative' }}
      >
        {children}
      </span>
    </motion.span>
  );
}

export default function Hero({ className = '' }: HeroProps) {
  const { content, getContentValue, projectCount } = useContent();
  const reduceMotion = useReducedMotion();

  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const featuredProject = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount)[0];

  const lineOne = getContentValue('hero', 'headline_line1', 'Small teams need fast systems');
  const lineTwo = getContentValue('hero', 'headline_line2', 'not vague agency timelines.');
  const brandWord = getContentValue('nav', 'logo_text', 'VAAD');

  const stats = [
    {
      value: getContentValue('hero', 'stat_1_number', '5'),
      label: getContentValue('hero', 'stat_1_label', 'Senior builders'),
    },
    {
      value: getContentValue('hero', 'stat_2_number', '1-3'),
      label: getContentValue('hero', 'stat_2_label', 'Week delivery'),
    },
    {
      value: getContentValue('hero', 'stat_3_number', 'Always'),
      label: getContentValue('hero', 'stat_3_label', 'Post-launch iteration'),
    },
  ];

  const warpStrength = useMotionValue(1);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { damping: 22, stiffness: 180, mass: 0.8 });
  const springY = useSpring(pointerY, { damping: 22, stiffness: 180, mass: 0.8 });
  const cardRotateY = useTransform(springX, [-0.6, 0.6], [10, -10]);
  const cardRotateX = useTransform(springY, [-0.6, 0.6], [-8, 8]);
  const cardShiftX = useTransform(springX, [-0.6, 0.6], [-16, 16]);
  const cardShiftY = useTransform(springY, [-0.6, 0.6], [-10, 10]);
  const cardTransform = useMotionTemplate`perspective(1800px) rotateX(${cardRotateX}deg) rotateY(${cardRotateY}deg) translate3d(${cardShiftX}px, ${cardShiftY}px, 0px)`;

  useEffect(() => {
    const controls = animate(warpStrength, reduceMotion ? 0.22 : 0.28, {
      duration: reduceMotion ? 0.8 : 2.6,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [reduceMotion, warpStrength]);

  return (
    <section
      className={`relative min-h-[100svh] overflow-hidden px-6 pb-20 pt-28 md:px-10 md:pb-28 md:pt-36 ${className}`}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 1.2);
        pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 1.2);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      <div className="hero-grid-overlay absolute inset-0 opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,8,0),rgba(3,3,8,0.65)_72%,rgba(3,3,8,1))]" />
      <div className="hero-nebula hero-nebula-a absolute left-[-6%] top-[8%] h-[340px] w-[340px]" />
      <div className="hero-nebula hero-nebula-b absolute right-[-4%] top-[16%] h-[380px] w-[380px]" />
      <div className="hero-nebula hero-nebula-c absolute bottom-[18%] left-[24%] h-[300px] w-[300px]" />
      <div className="hero-nebula hero-nebula-d absolute bottom-[-8%] right-[12%] h-[420px] w-[420px]" />
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.12),transparent_54%)]" />}>
          <StarField className="absolute inset-0" warpStrength={warpStrength} />
        </Suspense>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[12%] z-[1] flex justify-center overflow-hidden"
      >
        <span
          className="hero-brand-ghost whitespace-nowrap text-[clamp(9rem,28vw,30rem)] font-[800] uppercase leading-none tracking-[-0.08em] text-[rgba(232,232,240,0.03)]"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {brandWord}
        </span>
      </div>

      <motion.div
        variants={heroShellVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] xl:items-end"
      >
        <div className="max-w-[860px]">
          <p
            className="editorial-kicker mb-8 text-[rgba(232,232,240,0.72)]"
            data-cursor-label="open"
          >
            {getContentValue('hero', 'eyebrow', 'Web Design + Web App Delivery')}
          </p>

          <div className="space-y-2">
            <motion.div
              variants={headlineRowVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-x-[0.22em] gap-y-3 text-[clamp(3.9rem,10vw,8.8rem)] font-[800] uppercase leading-[0.88] tracking-[-0.065em]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {lineOne.split(' ').map((word) => (
                <HeadlineWord key={word}>{word}</HeadlineWord>
              ))}
            </motion.div>

            <motion.div
              variants={headlineRowVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-x-[0.22em] gap-y-3 text-[clamp(3.9rem,10vw,8.8rem)] font-[800] uppercase leading-[0.88] tracking-[-0.065em]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {lineTwo.split(' ').map((word) => (
                <HeadlineWord key={word} accent>
                  {word}
                </HeadlineWord>
              ))}
            </motion.div>
          </div>

          <motion.p
            variants={heroShellVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.32 }}
            className="mt-7 max-w-[56ch] text-[15px] leading-[1.85] text-text-secondary md:text-[18px]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {getContentValue(
              'hero',
              'subheadline',
              'VAAD builds conversion-focused websites and operational web apps. We do it for small teams that need a tight scope, a fast release window, and a handoff they can maintain.',
            )}
          </motion.p>

          <motion.div
            variants={heroShellVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.44 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(108,99,255,0.38)] bg-[rgba(108,99,255,0.16)] px-7 py-4 text-[12px] uppercase tracking-[0.28em] text-text-primary transition-transform duration-300 hover:-translate-y-0.5"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              data-cursor-label="send"
              data-magnetic="true"
            >
              {getContentValue('hero', 'cta_primary', 'Start a project')}
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(232,232,240,0.14)] bg-[rgba(255,255,255,0.03)] px-7 py-4 text-[12px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.74)] transition-all duration-300 hover:border-[rgba(0,212,255,0.32)] hover:text-text-primary"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
              data-cursor-label="view"
              data-magnetic="true"
            >
              {getContentValue('hero', 'cta_secondary', 'See shipped work')}
            </Link>
          </motion.div>

          <motion.div
            variants={statGridVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={statCardVariants}
                className="rounded-[28px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.68)] px-5 py-5 backdrop-blur-md"
              >
                <p
                  className="text-[clamp(2rem,4vw,2.9rem)] font-[800] leading-none text-text-primary"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stat.value}
                </p>
                <p
                  className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={proofCardVariants} initial="hidden" animate="visible" className="relative">
          <div className="pointer-events-none absolute -left-12 top-12 h-44 w-44 rounded-full bg-[rgba(108,99,255,0.18)] blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-4 right-0 h-56 w-56 rounded-full bg-[rgba(0,212,255,0.14)] blur-[110px]" />

          <motion.div
            style={{ transform: cardTransform }}
            className="interactive-glow overflow-hidden rounded-[34px] border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.88)]"
          >
            <div className="flex items-center justify-between border-b border-[rgba(232,232,240,0.08)] px-5 py-4">
              <div>
                <p
                  className="text-[11px] uppercase tracking-[0.34em] text-[rgba(0,212,255,0.76)]"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  {getContentValue('hero', 'proof_kicker', 'Live delivery board')}
                </p>
                <p className="mt-2 max-w-[36ch] text-sm leading-[1.6] text-text-secondary">
                  {getContentValue('hero', 'proof_title', 'Creative builds that still respect real deadlines.')}
                </p>
              </div>
              <span
                className="rounded-full border border-[rgba(0,212,255,0.18)] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.76)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1.12fr_0.88fr]">
              <div className="group relative min-h-[360px] overflow-hidden border-b border-[rgba(232,232,240,0.08)] md:border-b-0 md:border-r">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(108,99,255,0.28),transparent_30%),radial-gradient(circle_at_76%_20%,rgba(0,212,255,0.18),transparent_24%),linear-gradient(180deg,rgba(6,7,14,0.25),rgba(3,3,8,0.86))]" />
                {featuredProject?.image ? (
                  <img
                    src={featuredProject.image}
                    alt={featuredProject.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover opacity-74 transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(3,3,8,0.16)_42%,rgba(3,3,8,0.88)_100%)]" />
                
                {/* Hover reveal overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-[rgba(3,3,8,0.75)]">
                  <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(0,212,255,0.5)] bg-[rgba(0,212,255,0.1)] text-[rgba(0,212,255,0.9)] text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      View Project
                      <ArrowUpRight size={14} />
                    </span>
                    <p className="mt-3 text-[rgba(232,232,240,0.5)] text-[12px]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {featuredProject?.name || 'Featured release'}
                    </p>
                  </div>
                </div>
                
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.84)]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    {featuredProject?.tag || 'Featured release'}
                  </p>
                  <h2
                    className="max-w-[10ch] text-[clamp(2.4rem,6vw,4.5rem)] font-[800] uppercase leading-[0.88] tracking-[-0.06em] text-text-primary"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {featuredProject?.name || 'Launch-ready systems'}
                  </h2>
                  <p className="mt-4 max-w-[40ch] text-[15px] leading-[1.8] text-[rgba(232,232,240,0.72)]">
                    {getContentValue(
                      'hero',
                      'proof_description',
                      'Each release is scoped against launch pressure, content reality, and what your team can maintain after handoff.',
                    )}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px bg-[rgba(232,232,240,0.06)]">
                {stats.map((stat, index) => (
                  <div
                    key={stat.label}
                    className="bg-[rgba(10,12,25,0.96)] px-5 py-5"
                  >
                    <p
                      className="text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.48)]"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      Panel {String(index + 1).padStart(2, '0')}
                    </p>
                    <p
                      className="mt-4 text-[clamp(1.9rem,4vw,2.8rem)] font-[800] leading-none text-text-primary"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm leading-[1.65] text-text-secondary">{stat.label}</p>
                  </div>
                ))}
                <div className="bg-[rgba(10,12,25,0.96)] px-5 py-5">
                  <p
                    className="text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.48)]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    Notes
                  </p>
                  <p className="mt-4 text-sm leading-[1.8] text-[rgba(232,232,240,0.72)]">
                    {getContentValue(
                      'hero',
                      'proof_note',
                      'The homepage pulls from the same editable content system used by the admin panel.',
                    )}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
