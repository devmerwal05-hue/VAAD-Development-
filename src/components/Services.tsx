import { motion, type Variants } from 'framer-motion';
import { Globe, LayoutPanelTop, Rocket, Workflow } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const servicesIntroVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const servicesPanelVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
  },
};

const serviceCardVariants: Variants = {
  hidden: { opacity: 0, y: 44 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
};

export interface ServicesProps {
  className?: string;
}

interface ServiceItem {
  description: string;
  ingredients: string[];
  outcome: string;
  title: string;
}

const serviceIcons = [LayoutPanelTop, Workflow, Globe, Rocket];
const serviceAccents = ['#7C6FF7', '#00D4FF', '#22C55E', '#FB923C'];

export default function Services({ className = '' }: ServicesProps) {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('services', 'label', '01 / Services').split(' / ');
  const [activeIndex, setActiveIndex] = useState(0);
  const serviceRefs = useRef<Array<HTMLElement | null>>([]);

  const services: ServiceItem[] = [1, 2, 3, 4].map((index) => {
    const defaults = [
      {
        title: 'High-conviction websites',
        description: 'Marketing sites with strong information hierarchy, custom visuals, and a CMS handoff your team can actually maintain.',
        ingredients: ['Messaging', 'Design system', 'CMS', 'Analytics'],
        outcome: 'A clear, publishable site with structure that keeps working after launch.',
      },
      {
        title: 'Operational web apps',
        description: 'Internal tools, client dashboards, and workflow systems that reduce manual follow-up and keep teams aligned.',
        ingredients: ['Auth', 'Dashboards', 'Automation', 'Admin tools'],
        outcome: 'Manual status chasing gets replaced by a system your team can actually use daily.',
      },
      {
        title: 'Commerce builds',
        description: 'Stores and product funnels designed around clear merchandising, product storytelling, and mobile conversion paths.',
        ingredients: ['Catalog', 'Checkout', 'Content', 'Merchandising'],
        outcome: 'A storefront that supports how products are sold, not just how they are displayed.',
      },
      {
        title: 'Launch support',
        description: 'Deployment, analytics, content updates, and post-launch improvements so the build keeps paying off after go-live.',
        ingredients: ['Deploy', 'QA', 'Monitoring', 'Iteration'],
        outcome: 'Launch week stays controlled, with the next improvements already mapped instead of guessed.',
      },
    ][index - 1];

    const ingredients = getContentValue(
      'services',
      `card_${index}_ingredients`,
      defaults.ingredients.join(','),
    )
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    return {
      title: getContentValue('services', `card_${index}_title`, defaults.title),
      description: getContentValue('services', `card_${index}_desc`, defaults.description),
      ingredients,
      outcome: getContentValue('services', `card_${index}_outcome`, defaults.outcome),
    };
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const nextActive = entries
          .filter((entry) => entry.isIntersecting)
          .sort((entryA, entryB) => (
            entryB.intersectionRatio - entryA.intersectionRatio
            || entryA.boundingClientRect.top - entryB.boundingClientRect.top
          ))[0];

        if (!nextActive) return;

        const nextIndex = serviceRefs.current.findIndex((element) => element === nextActive.target);
        if (nextIndex >= 0) setActiveIndex(nextIndex);
      },
      {
        rootMargin: '-30% 0px -32% 0px',
        threshold: [0.22, 0.4, 0.6],
      },
    );

    serviceRefs.current.filter(Boolean).forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [services.length]);

  const activeService = services[activeIndex] ?? services[0];
  const ActiveIcon = serviceIcons[activeIndex % serviceIcons.length];
  const activeAccent = serviceAccents[activeIndex % serviceAccents.length];

  return (
    <section className={`relative overflow-hidden px-6 py-24 md:px-10 md:py-36 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,99,255,0.18),transparent_22%),radial-gradient(circle_at_78%_26%,rgba(0,212,255,0.12),transparent_18%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div
          variants={servicesIntroVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mb-12 max-w-[760px]"
        >
          <SectionLabel number={labelParts[0] || '01'} label={labelParts[1] || 'Services'} />
          <SectionTitle>{getContentValue('services', 'title', 'What we build')}</SectionTitle>
          <p className="-mt-4 max-w-[56ch] text-[15px] leading-[1.85] text-text-secondary md:text-[17px]">
            {getContentValue('services', 'subtitle', 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.')}
          </p>
        </motion.div>

        <div className="hidden gap-10 xl:grid xl:grid-cols-[minmax(380px,0.42fr)_minmax(0,0.58fr)] xl:items-start">
          <motion.aside
            variants={servicesPanelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="sticky top-28 h-fit"
          >
            <div className="rounded-[36px] border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.88)] p-6">
              <p className="editorial-kicker text-[rgba(0,212,255,0.78)]">Active service</p>

              <div className="relative mt-6 overflow-hidden rounded-[30px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.03)] p-8">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 14% 18%, color-mix(in srgb, ${activeAccent} 24%, transparent), transparent 24%), radial-gradient(circle at 80% 22%, rgba(255,255,255,0.06), transparent 18%), linear-gradient(180deg, rgba(8,10,20,0.12), rgba(8,10,20,0.84))`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-0 text-[clamp(10rem,17vw,15rem)] font-[800] leading-none tracking-[-0.08em] text-[rgba(232,232,240,0.05)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10 flex min-h-[470px] flex-col">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border"
                      style={{
                        borderColor: `color-mix(in srgb, ${activeAccent} 32%, transparent)`,
                        background: `color-mix(in srgb, ${activeAccent} 16%, transparent)`,
                      }}
                    >
                      <ActiveIcon size={18} style={{ color: activeAccent }} />
                    </div>
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.44)]"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        Sticky detail panel
                      </p>
                      <p className="mt-2 text-sm leading-[1.7] text-text-secondary">
                        The left panel stays fixed while the service chapters move beside it.
                      </p>
                    </div>
                  </div>

                  <h3
                    className="mt-10 max-w-[10ch] text-[clamp(2.6rem,4vw,4.2rem)] font-[800] uppercase leading-[0.9] tracking-[-0.055em] text-text-primary"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {activeService.title}
                  </h3>
                  <p className="mt-5 max-w-[34ch] text-[16px] leading-[1.9] text-text-secondary">
                    {activeService.description}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {activeService.ingredients.map((ingredient) => (
                      <div
                        key={ingredient}
                        className="rounded-[18px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3"
                      >
                        <p
                          className="text-[10px] uppercase tracking-[0.24em] text-[rgba(232,232,240,0.74)]"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {ingredient}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {['Scope', 'Design', 'Build'].map((phase, phaseIndex) => (
                      <div key={phase} className="rounded-[20px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.03)] p-4">
                        <p
                          className="text-[10px] uppercase tracking-[0.22em] text-[rgba(232,232,240,0.42)]"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {phase}
                        </p>
                        <div className="mt-4 h-20 rounded-full bg-[rgba(255,255,255,0.04)] p-2">
                          <div
                            className="w-full rounded-full"
                            style={{
                              height: `${54 + phaseIndex * 14}px`,
                              background: `linear-gradient(180deg, ${activeAccent}, color-mix(in srgb, ${activeAccent} 52%, #030308))`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto rounded-[24px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
                    <p
                      className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.72)]"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      Expected outcome
                    </p>
                    <p className="mt-3 text-[15px] leading-[1.8] text-text-secondary">
                      {activeService.outcome}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="space-y-6">
            {services.map((service, index) => {
              const Icon = serviceIcons[index % serviceIcons.length];
              const accent = serviceAccents[index % serviceAccents.length];
              const isActive = index === activeIndex;

              return (
                <motion.article
                  key={service.title}
                  ref={(element) => {
                    serviceRefs.current[index] = element;
                  }}
                  variants={serviceCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                  tabIndex={0}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  className="group relative min-h-[68vh] overflow-hidden rounded-[34px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.86)] p-10 outline-none transition-colors duration-300"
                  style={{
                    boxShadow: isActive ? `0 0 0 1px color-mix(in srgb, ${accent} 22%, transparent)` : 'none',
                  }}
                  data-cursor-label="open"
                  data-cursor-accent={accent}
                >
                  <div
                    className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `radial-gradient(circle at 18% 16%, color-mix(in srgb, ${accent} 22%, transparent), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(8,10,20,0.04) 28%, rgba(8,10,20,0.88))`,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-6 top-0 text-[clamp(10rem,22vw,25rem)] font-[800] leading-none tracking-[-0.08em] text-[rgba(232,232,240,0.04)]"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full border"
                          style={{
                            borderColor: `color-mix(in srgb, ${accent} 32%, transparent)`,
                            background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                          }}
                        >
                          <Icon size={18} style={{ color: accent }} />
                        </div>
                        <p
                          className="text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          Service {String(index + 1).padStart(2, '0')}
                        </p>
                      </div>

                      <h3
                        className="mt-10 max-w-[10ch] text-[clamp(3rem,4.8vw,5rem)] font-[800] uppercase leading-[0.9] tracking-[-0.055em] text-text-primary"
                        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                      >
                        {service.title}
                      </h3>
                      <p className="mt-6 max-w-[42ch] text-[16px] leading-[1.9] text-text-secondary">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2">
                        {service.ingredients.map((ingredient) => (
                          <span
                            key={ingredient}
                            className="rounded-full border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[rgba(232,232,240,0.72)]"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            {ingredient}
                          </span>
                        ))}
                      </div>
                      <p className="mt-6 max-w-[38ch] text-[15px] leading-[1.8] text-[rgba(232,232,240,0.56)]">
                        {service.outcome}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        <motion.div
          variants={servicesPanelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 xl:hidden"
        >
          {services.map((service, index) => {
            const Icon = serviceIcons[index % serviceIcons.length];
            const accent = serviceAccents[index % serviceAccents.length];

            return (
              <article
                key={service.title}
                className="relative overflow-hidden rounded-[28px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.82)] p-6"
                data-cursor-accent={accent}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 18% 18%, color-mix(in srgb, ${accent} 22%, transparent), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.02), rgba(8,10,20,0.88))`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-0 text-[clamp(7rem,20vw,10rem)] font-[800] leading-none tracking-[-0.08em] text-[rgba(232,232,240,0.04)]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="relative z-10">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border"
                    style={{
                      borderColor: `color-mix(in srgb, ${accent} 32%, transparent)`,
                      background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                    }}
                  >
                    <Icon size={18} style={{ color: accent }} />
                  </div>
                  <p className="editorial-kicker mt-5 text-[rgba(0,212,255,0.78)]">Service {String(index + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 text-[2rem] font-[800] uppercase leading-[0.92] tracking-[-0.05em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {service.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-[1.85] text-text-secondary">{service.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {service.ingredients.map((ingredient) => (
                      <span
                        key={ingredient}
                        className="rounded-full border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-[rgba(232,232,240,0.72)]"
                        style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
