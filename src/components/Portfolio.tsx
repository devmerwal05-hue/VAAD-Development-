import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
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
  project: PortfolioProject;
}

function AsteroidCard({ project, index, featured = false }: AsteroidCardProps) {
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const rotateX = useSpring(useTransform(pointerY, [0, 100], [10, -10]), { damping: 18, stiffness: 160 });
  const rotateY = useSpring(useTransform(pointerX, [0, 100], [-12, 12]), { damping: 18, stiffness: 160 });
  const glow = useMotionTemplate`radial-gradient(circle at ${pointerX}% ${pointerY}%, rgba(108, 99, 255, 0.34), transparent 38%)`;
  const cyanGlow = useMotionTemplate`radial-gradient(circle at ${pointerX}% ${pointerY}%, rgba(0, 212, 255, 0.18), transparent 42%)`;
  const transform = useMotionTemplate`perspective(1800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const cardBody = (
    <motion.article
      variants={portfolioCardVariants}
      className={`group relative h-full ${featured ? 'min-h-[560px]' : 'min-h-[440px]'}`}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set(((event.clientX - bounds.left) / bounds.width) * 100);
        pointerY.set(((event.clientY - bounds.top) / bounds.height) * 100);
      }}
      onMouseLeave={() => {
        pointerX.set(50);
        pointerY.set(50);
      }}
      style={{ transform }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-8%] rounded-[44px] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />

      <div className="asteroid-mask interactive-glow relative h-full overflow-hidden border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.84)]">
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: cyanGlow, opacity: 0.9 }} />
        <div className="surface-noise pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_28%,rgba(3,3,8,0.2)_58%,rgba(3,3,8,0.88)_100%)]" />
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-78 transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_24%,rgba(108,99,255,0.4),transparent_24%),radial-gradient(circle_at_76%_30%,rgba(0,212,255,0.22),transparent_20%),linear-gradient(160deg,#090914,#171b34)]" />
        )}

        <div className="absolute left-5 top-5 rounded-full border border-[rgba(232,232,240,0.1)] bg-[rgba(3,3,8,0.4)] px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.68)] backdrop-blur-md" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {project.tag}
        </div>

        <div className="absolute right-5 top-5 rounded-full border border-[rgba(0,212,255,0.16)] bg-[rgba(0,212,255,0.08)] px-3 py-1.5 text-[10px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.82)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <h3
            className={`max-w-[12ch] font-[800] uppercase leading-[0.9] tracking-[-0.055em] text-text-primary ${featured ? 'text-[clamp(2.8rem,5vw,4.8rem)]' : 'text-[clamp(2.2rem,4vw,3.5rem)]'}`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {project.name}
          </h3>
          <p className="mt-3 max-w-[34ch] text-[13px] uppercase tracking-[0.22em] text-[rgba(0,212,255,0.78)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {project.subtitle}
          </p>
          <p className="mt-4 max-w-[42ch] text-[15px] leading-[1.8] text-[rgba(232,232,240,0.72)]">
            {project.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.gallery.slice(0, 3).map((image, imageIndex) => (
              <div key={`${project.name}-${imageIndex}`} className="h-14 w-14 overflow-hidden rounded-[18px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.04)]">
                <img src={image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.56)] transition-colors duration-300 group-hover:text-text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <span className="h-px w-7 bg-current" />
            {project.url ? 'View live' : 'Internal showcase'}
            <ArrowUpRight size={14} />
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
      data-cursor-label="view"
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

  if (projects.length === 0) return null;

  return (
    <section className={`relative overflow-hidden px-6 py-24 md:px-10 md:py-36 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_20%,rgba(108,99,255,0.14),transparent_22%),radial-gradient(circle_at_12%_76%,rgba(0,212,255,0.12),transparent_18%)]" />

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
            {getContentValue('portfolio', 'subtitle', 'Deep-dive explorations of core systems, brand environments, and deployment-ready web products.')}
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
              key={`${project.name}-${index}`}
              project={project}
              index={index}
              featured={index === 0}
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
