import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { buildPortfolioProjects, type PortfolioProject } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

const portfolioIntroVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const portfolioGridVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, delayChildren: 0.12 },
  },
};

const portfolioCardVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export interface PortfolioProps {
  className?: string;
}

interface AsteroidCardProps {
  featured?: boolean;
  index: number;
  onHoverEnd: () => void;
  onHoverStart: () => void;
  project: PortfolioProject;
}

function AsteroidCard({ project, index, featured = false, onHoverStart, onHoverEnd }: AsteroidCardProps) {
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const rotateX = useSpring(useTransform(pointerY, [0, 100], [9, -9]), { damping: 18, stiffness: 160 });
  const rotateY = useSpring(useTransform(pointerX, [0, 100], [-12, 12]), { damping: 18, stiffness: 160 });
  const glow = useMotionTemplate`radial-gradient(circle at ${pointerX}% ${pointerY}%, color-mix(in srgb, ${project.accentSolid} 26%, transparent), transparent 38%)`;
  const transform = useMotionTemplate`perspective(1800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const cardBody = (
    <motion.article
      variants={portfolioCardVariants}
      className={`group relative h-full ${featured ? 'min-h-[580px]' : 'min-h-[470px]'}`}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
      onMouseEnter={() => {
        pointerX.set(50);
        pointerY.set(50);
        onHoverStart();
      }}
      onFocus={onHoverStart}
      onMouseLeave={() => {
        pointerX.set(50);
        pointerY.set(50);
        onHoverEnd();
      }}
      onBlur={onHoverEnd}
      style={{ transform }}
      data-cursor-accent={project.accentSolid}
      data-cursor-label="view"
      tabIndex={project.url ? -1 : 0}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-10%] rounded-[48px] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />

      <div
        className="asteroid-mask relative h-full overflow-hidden border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.82)]"
        style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${project.accentSolid} 12%, transparent), 0 30px 70px rgba(0,0,0,0.35)` }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.1]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 20% 18%, color-mix(in srgb, ${project.accentSolid} 34%, transparent), transparent 22%), linear-gradient(${project.gradientAngle}, #090914, #171b34)`,
            }}
          />
        )}

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,8,0.1),rgba(3,3,8,0.18)_36%,rgba(3,3,8,0.94)_100%)] transition-all duration-500 group-hover:bg-[linear-gradient(180deg,rgba(3,3,8,0.02),rgba(3,3,8,0.08)_26%,rgba(3,3,8,0.86)_100%)]" />

        <div className="absolute left-5 top-5 rounded-full border border-[rgba(232,232,240,0.12)] bg-[rgba(3,3,8,0.4)] px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.72)] backdrop-blur-md" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {project.tag}
        </div>

        <div
          className="absolute right-5 top-5 rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] backdrop-blur-md"
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            borderColor: `color-mix(in srgb, ${project.accentSolid} 32%, transparent)`,
            background: `color-mix(in srgb, ${project.accentSolid} 12%, transparent)`,
            color: project.accentSolid,
          }}
        >
          {project.year || String(index + 1).padStart(2, '0')}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="transition-all duration-500 group-hover:-translate-y-6 group-hover:opacity-0">
            <p className="editorial-kicker mb-4 text-[rgba(232,232,240,0.5)]">
              {featured ? 'Featured case study' : 'Case study'}
            </p>
            <h3
              className={`max-w-[12ch] font-[800] uppercase leading-[0.9] tracking-[-0.055em] text-text-primary ${featured ? 'text-[clamp(2.8rem,5vw,4.8rem)]' : 'text-[clamp(2.2rem,4vw,3.5rem)]'}`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {project.name}
            </h3>
            <p
              className="mt-3 max-w-[34ch] text-[13px] uppercase tracking-[0.22em]"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: project.accentSolid }}
            >
              {project.subtitle}
            </p>
          </div>

          <div className="pointer-events-none absolute inset-x-6 bottom-6 translate-y-8 opacity-0 transition-all duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:inset-x-8 md:bottom-8">
            <div className="rounded-[28px] border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.92)] p-5 backdrop-blur-xl">
              <p className="text-[15px] leading-[1.85] text-[rgba(232,232,240,0.76)]">
                {project.description}
              </p>

              {project.credits.length > 0 ? (
                <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-[rgba(232,232,240,0.56)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {`Built with: ${project.credits.join(' / ')}`}
                </p>
              ) : null}

              <div className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {project.url ? 'View live' : 'Internal showcase'}
                <ArrowUpRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (!project.url) {
    return <div className={featured ? 'lg:col-span-7' : 'lg:col-span-5'}>{cardBody}</div>;
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className={featured ? 'lg:col-span-7' : 'lg:col-span-5'}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
      data-cursor-accent={project.accentSolid}
      data-cursor-label="open"
    >
      {cardBody}
    </a>
  );
}

export default function Portfolio({ className = '' }: PortfolioProps) {
  const { content, getContentValue, projectCount } = useContent();
  const labelParts = getContentValue('portfolio', 'label', '04 / Work').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (projects.length === 0) return null;

  const hoveredProject = hoveredIndex !== null ? projects[hoveredIndex] : null;

  return (
    <section className={`relative overflow-hidden px-6 py-24 md:px-10 md:py-36 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_20%,rgba(108,99,255,0.14),transparent_22%),radial-gradient(circle_at_12%_76%,rgba(0,212,255,0.12),transparent_18%)]" />
      <AnimatePresence>
        {hoveredProject?.image ? (
          <motion.div
            key={hoveredProject.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0"
          >
            <img src={hoveredProject.image} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,8,0.9),rgba(3,3,8,0.46),rgba(3,3,8,0.92))]" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        variants={portfolioIntroVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.18 }}
        className="relative z-10 mx-auto max-w-[1440px]"
      >
        <div className="mb-12 max-w-[780px]">
          <SectionLabel number={labelParts[0] || '04'} label={labelParts[1] || 'Work'} />
          <SectionTitle>{getContentValue('portfolio', 'title', 'Selected work')}</SectionTitle>
          <p className="-mt-4 max-w-[56ch] text-[15px] leading-[1.85] text-text-secondary md:text-[17px]">
            {getContentValue('portfolio', 'subtitle', 'Hover a case study to let the image take over, then slide the build notes in only when they matter.')}
          </p>
        </div>

        <motion.div
          variants={portfolioGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12"
        >
          {projects.map((project, index) => (
            <AsteroidCard
              key={`${project.name}-${project.year || index}`}
              project={project}
              index={index}
              featured={index === 0}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex((current) => (current === index ? null : current))}
            />
          ))}
        </motion.div>

        <motion.p
          variants={portfolioIntroVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.55 }}
          className="mx-auto mt-12 max-w-[48ch] text-center text-[14px] leading-[1.85] text-[rgba(232,232,240,0.58)]"
        >
          {getContentValue(
            'portfolio',
            'footer_text',
            'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.',
          )}
        </motion.p>
      </motion.div>
    </section>
  );
}
