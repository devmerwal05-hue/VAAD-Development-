import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export interface ChapterSection {
  id: string;
  label: string;
  number: string;
}

export interface SectionChapterRailProps {
  sections: ChapterSection[];
}

export default function SectionChapterRail({ sections }: SectionChapterRailProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const nextActive = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => (
            entryB.intersectionRatio - entryA.intersectionRatio
            || entryA.boundingClientRect.top - entryB.boundingClientRect.top
          ))[0];

        if (nextActive) {
          setActiveId(nextActive.target.id);
        }
      },
      {
        rootMargin: '-24% 0px -44% 0px',
        threshold: [0.2, 0.35, 0.5, 0.65],
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [sections]);

  const activeSection = sections.find((section) => section.id === activeId) ?? sections[0];

  if (!activeSection) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:flex"
      aria-label="Page chapters"
    >
      <div className="pointer-events-auto rounded-[28px] border border-[rgba(232,232,240,0.08)] bg-[rgba(7,8,16,0.82)] px-4 py-5 backdrop-blur-xl">
        <p
          className="text-[10px] uppercase tracking-[0.34em] text-[rgba(0,212,255,0.72)]"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          Chapter
        </p>
        <p
          className="mt-3 max-w-[15ch] text-[13px] uppercase leading-[1.7] tracking-[0.22em] text-text-primary"
          style={{ fontFamily: 'JetBrains Mono, monospace' }}
        >
          {`Ch. ${activeSection.number} / ${activeSection.label}`}
        </p>

        <div className="mt-6 flex flex-col items-center gap-3" role="list">
          {sections.map((section) => {
            const isActive = section.id === activeSection.id;

            return (
              <button
                key={section.id}
                type="button"
                role="listitem"
                onClick={() => {
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group flex flex-col items-center gap-2"
                aria-label={`Jump to ${section.label}`}
                aria-current={isActive ? 'true' : undefined}
              >
                <motion.span
                  animate={{
                    backgroundColor: isActive ? '#00D4FF' : 'rgba(232,232,240,0.18)',
                    opacity: isActive ? 1 : 0.52,
                    scale: isActive ? 1.15 : 1,
                  }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="h-2.5 w-2.5 rounded-full"
                />
                {section.id !== sections[sections.length - 1]?.id ? (
                  <span className="h-7 w-px bg-[rgba(232,232,240,0.12)]" aria-hidden="true" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </motion.aside>
  );
}
