import { motion, type Variants } from 'framer-motion';
import { Globe, Orbit, Sparkles, Workflow } from 'lucide-react';
import { useState } from 'react';
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

const servicesDiagramVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 60 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.12 },
  },
};

const tooltipVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

const nodeRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const orbitIcons = [Globe, Workflow, Orbit, Sparkles];

export interface ServicesProps {
  className?: string;
}

interface ServiceItem {
  description: string;
  ring: number;
  title: string;
}

interface OrbitNodeProps {
  active: boolean;
  angle: number;
  iconIndex: number;
  onHover: () => void;
  onLeave: () => void;
  radius: number;
  service: ServiceItem;
}

function OrbitNode({ radius, angle, service, active, iconIndex, onHover, onLeave }: OrbitNodeProps) {
  const Icon = orbitIcons[iconIndex % orbitIcons.length];

  return (
    <motion.button
      type="button"
      variants={nodeRevealVariants}
      className="absolute left-1/2 top-1/2 z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[rgba(232,232,240,0.1)] bg-[rgba(10,12,25,0.92)] text-text-primary shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition-all duration-300"
      style={{
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
        borderColor: active ? 'rgba(0,212,255,0.42)' : 'rgba(232,232,240,0.1)',
        boxShadow: active ? '0 0 0 1px rgba(0,212,255,0.18), 0 18px 40px rgba(0,212,255,0.18)' : '0 20px 50px rgba(0,0,0,0.35)',
      }}
      onMouseEnter={onHover}
      onFocus={onHover}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      data-cursor-label="open"
    >
      <Icon size={18} style={{ color: active ? '#00D4FF' : '#E8E8F0' }} />
      <span className="sr-only">{service.title}</span>
    </motion.button>
  );
}

export default function Services({ className = '' }: ServicesProps) {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('services', 'label', '01 / Services').split(' / ');
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);

  const services: ServiceItem[] = [1, 2, 3, 4].map((index) => ({
    title: getContentValue('services', `card_${index}_title`, ['High-conviction websites', 'Operational web apps', 'Commerce builds', 'Launch support'][index - 1]),
    description: getContentValue('services', `card_${index}_desc`, [
      'Marketing sites with strong information hierarchy, custom visuals, and a CMS handoff your team can actually maintain.',
      'Internal tools, client dashboards, and workflow systems that reduce manual follow-up and keep teams aligned.',
      'Stores and product funnels designed around clear merchandising, product storytelling, and mobile conversion paths.',
      'Deployment, analytics, content updates, and post-launch improvements so the build keeps paying off after go-live.',
    ][index - 1]),
    ring: index <= 2 ? 0 : 1,
  }));

  const hoveredService = services[hoveredIndex] || services[0];
  const hoveredRing = hoveredService.ring;

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

        <div className="hidden gap-10 xl:grid xl:grid-cols-[minmax(640px,0.95fr)_minmax(340px,0.55fr)] xl:items-center">
          <motion.div
            variants={servicesDiagramVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="relative h-[720px]"
          >
            {[0, 1].map((ringIndex) => {
              const ringSize = ringIndex === 0 ? 560 : 400;
              const ringServices = services.filter((service) => service.ring === ringIndex);
              return (
                <div
                  key={`ring-${ringIndex}`}
                  className="absolute left-1/2 top-1/2 rounded-full border border-[rgba(232,232,240,0.08)]"
                  style={{
                    width: ringSize,
                    height: ringSize,
                    transform: 'translate(-50%, -50%)',
                    animation: `${ringIndex === 0 ? 'orbitSpin' : 'orbitSpinReverse'} ${ringIndex === 0 ? 34 : 26}s linear infinite`,
                    animationPlayState: hoveredRing === ringIndex ? 'paused' : 'running',
                  }}
                >
                  <div className="absolute inset-6 rounded-full border border-dashed border-[rgba(232,232,240,0.05)]" />
                  {ringServices.map((service, serviceIndex) => (
                    <OrbitNode
                      key={service.title}
                      radius={ringSize / 2}
                      angle={ringIndex === 0 ? serviceIndex * 180 + 26 : serviceIndex * 180 + 112}
                      iconIndex={services.indexOf(service)}
                      service={service}
                      active={hoveredIndex === services.indexOf(service)}
                      onHover={() => setHoveredIndex(services.indexOf(service))}
                      onLeave={() => setHoveredIndex(services.indexOf(service))}
                    />
                  ))}
                </div>
              );
            })}

            <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(108,99,255,0.22)] bg-[radial-gradient(circle_at_50%_50%,rgba(108,99,255,0.28),rgba(8,10,20,0.98)_62%)] shadow-[0_0_120px_rgba(108,99,255,0.18)]">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <p className="editorial-kicker text-[rgba(232,232,240,0.48)]">VAAD orbit</p>
                <h3 className="mt-4 max-w-[8ch] text-[2.7rem] font-[800] uppercase leading-[0.88] tracking-[-0.055em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Launch systems
                </h3>
              </div>
            </div>
          </motion.div>

          <motion.aside
            variants={tooltipVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="rounded-[34px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.88)] p-8"
          >
            <p className="editorial-kicker text-[rgba(0,212,255,0.78)]">Hovered service</p>
            <h3 className="mt-5 text-[clamp(2.3rem,4vw,4rem)] font-[800] uppercase leading-[0.9] tracking-[-0.055em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {hoveredService.title}
            </h3>
            <p className="mt-5 text-[16px] leading-[1.9] text-text-secondary">
              {hoveredService.description}
            </p>

            <div
              className="mt-8 rounded-[26px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.03)] p-5"
              style={{ animation: 'tooltipPulse 4s ease-in-out infinite' }}
            >
              <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.48)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Orbit status
              </p>
              <p className="mt-3 text-sm leading-[1.8] text-[rgba(232,232,240,0.72)]">
                Hovering a node freezes that service ring so the tooltip can expand without losing spatial context, closer to a locomotive-style hover card than a static grid.
              </p>
            </div>
          </motion.aside>
        </div>

        <motion.div
          variants={servicesDiagramVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-4 xl:hidden"
        >
          {services.map((service, index) => (
            <article
              key={service.title}
              className="rounded-[28px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.82)] p-6"
            >
              <p className="editorial-kicker text-[rgba(0,212,255,0.78)]">Orbit {String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-4 text-[2rem] font-[800] uppercase leading-[0.92] tracking-[-0.05em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {service.title}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.85] text-text-secondary">{service.description}</p>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
