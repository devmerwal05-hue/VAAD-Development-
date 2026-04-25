import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { buildPortfolioProjects, type PortfolioProject } from '../lib/portfolio';
import { useContent } from '../lib/useContent';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MEDIA_QUERY = '(min-width: 1024px)';

const showcaseGradientPairs: Array<[string, string]> = [
  ['#6c5ce7', '#a29bfe'],
  ['#00b894', '#55efc4'],
  ['#fd79a8', '#fab1a0'],
  ['#fdcb6e', '#f39c12'],
  ['#0984e3', '#74b9ff'],
  ['#8e44ad', '#d2b4ff'],
];

export interface PortfolioProps {
  className?: string;
}

interface ProjectCardProps {
  gradient: [string, string];
  index: number;
  project: PortfolioProject;
  techTags: string;
}

function buildTechTags(project: PortfolioProject) {
  if (project.credits.length > 0) {
    return project.credits.join(' • ');
  }

  if (project.subtitle) {
    return project.subtitle;
  }

  return project.tag || 'Web Experience';
}

function ProjectCard({ project, index, gradient, techTags }: ProjectCardProps) {
  const numberLabel = String(index + 1).padStart(2, '0');

  const cardBody = (
    <article
      className="project-card group"
      data-cursor-accent={project.accentSolid}
      data-cursor-label={project.url ? 'open' : 'view'}
    >
      <div className="project-card-image border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.92)]">
        <div
          className="project-card-gradient"
          style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
        />
        {project.image ? (
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-55 transition-transform duration-700 group-hover:scale-[1.05]"
          />
        ) : null}
        <div className="project-card-overlay absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.42))]" />
        <span className="project-card-number">{numberLabel}</span>
      </div>

      <h3
        className="text-[clamp(1.7rem,2.6vw,2.35rem)] font-[700] leading-[0.95] tracking-[-0.04em] text-text-primary"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {project.name}
      </h3>
      <p className="mt-3 text-[15px] leading-[1.75] text-text-secondary">{project.description}</p>
      <span
        className="mt-4 inline-flex text-[11px] uppercase tracking-[0.12em]"
        style={{ fontFamily: 'JetBrains Mono, monospace', color: project.accentSolid }}
      >
        {techTags}
      </span>
    </article>
  );

  if (!project.url) {
    return cardBody;
  }

  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      data-cursor-accent={project.accentSolid}
      data-cursor-label="open"
    >
      {cardBody}
    </a>
  );
}

export default function Portfolio({ className = '' }: PortfolioProps) {
  const { content, getContentValue, projectCount } = useContent();
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
  });

  const labelParts = getContentValue('portfolio', 'label', '04 / Work').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'portfolio' && item.key === 'project_count');
  const projects = buildPortfolioProjects(getContentValue, projectCount, !hasStoredCount);

  const cards = useMemo(
    () =>
      projects.map((project, index) => ({
        gradient: showcaseGradientPairs[index % showcaseGradientPairs.length],
        index,
        project,
        techTags: buildTechTags(project),
      })),
    [projects],
  );

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const update = () => setIsDesktop(media.matches);

    update();
    media.addEventListener('change', update);

    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    const trackElement = trackRef.current;

    tweenRef.current?.kill();

    if (!sectionElement || !trackElement || !isDesktop || cards.length === 0) {
      if (trackElement) {
        gsap.set(trackElement, { clearProps: 'transform' });
      }
      return;
    }

    const initialWidth = Math.max(0, trackElement.scrollWidth - window.innerWidth + 100);
    if (initialWidth <= 0) {
      gsap.set(trackElement, { x: 0 });
      return;
    }

    const tween = gsap.to(trackElement, {
      x: () => -Math.max(0, trackElement.scrollWidth - window.innerWidth + 100),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionElement,
        start: 'top top',
        end: () => `+=${Math.max(0, trackElement.scrollWidth - window.innerWidth + 100)}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    tweenRef.current = tween;
    ScrollTrigger.refresh();

    return () => {
      tween.kill();
      gsap.set(trackElement, { clearProps: 'transform' });
    };
  }, [cards.length, isDesktop]);

  if (cards.length === 0) {
    return null;
  }

  return (
    <section ref={sectionRef} className={`relative overflow-hidden py-24 md:py-36 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_16%,rgba(108,99,255,0.12),transparent_24%),radial-gradient(circle_at_16%_78%,rgba(0,212,255,0.1),transparent_20%)]" />

      <div className="relative z-10 mx-auto mb-12 max-w-[1440px] px-6 md:mb-14 md:px-10">
        <SectionLabel number={labelParts[0] || '04'} label={labelParts[1] || 'Work'} />
        <SectionTitle>{getContentValue('portfolio', 'title', 'Featured projects')}</SectionTitle>
        <p className="-mt-4 max-w-[56ch] text-[15px] leading-[1.85] text-text-secondary md:text-[17px]">
          {getContentValue(
            'portfolio',
            'subtitle',
            'Scroll through selected builds with a narrative sequence from concept to shipped release.',
          )}
        </p>
      </div>

      <div className="relative z-10">
        <div className="horizontal-scroll">
          <div ref={trackRef} className={`horizontal-track${isDesktop ? '' : ' horizontal-track-mobile'}`}>
            {cards.map((card) => (
              <ProjectCard
                key={`${card.project.name}-${card.project.year || card.index}`}
                project={card.project}
                index={card.index}
                gradient={card.gradient}
                techTags={card.techTags}
              />
            ))}
          </div>
        </div>
      </div>

      <p className="relative z-10 mx-auto mt-12 max-w-[48ch] px-6 text-center text-[14px] leading-[1.85] text-[rgba(232,232,240,0.58)] md:px-10">
        {getContentValue(
          'portfolio',
          'footer_text',
          'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.',
        )}
      </p>
    </section>
  );
}
