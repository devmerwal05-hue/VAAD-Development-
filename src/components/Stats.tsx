import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

function AnimatedStat({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (current) => Math.round(current));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !inView) setInView(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (inView) {
      const numericValue = Number.parseInt(value, 10);
      if (!Number.isNaN(numericValue)) {
        animate(count, numericValue, { duration: 1.8, ease: [0.16, 0.77, 0.47, 0.97] });
      }
    }
  }, [count, inView, value]);

  const numericValue = Number.parseInt(value, 10);
  if (Number.isNaN(numericValue)) {
    return <span ref={ref} style={{ color: '#00B4FF' }}>{value}</span>;
  }

  return (
    <span ref={ref}>
      <motion.span style={{ color: '#00B4FF' }}>{rounded}</motion.span>
      {suffix && <span style={{ color: '#00B4FF' }}>{suffix}</span>}
    </span>
  );
}

export default function Stats() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('stats', 'label', '02 / Why Us').split(' / ');

  const statDefaults = [
    { value: '7', suffix: '', label: 'Days to first milestone', sublabel: 'Delivery', description: 'Projects start with a clearly defined first ship target instead of an open-ended discovery loop.' },
    { value: '48', suffix: 'h', label: 'Typical response window', sublabel: 'Communication', description: 'You are not waiting days for a status update when decisions are blocking progress.' },
    { value: '90', suffix: '%', label: 'Mobile traffic share considered', sublabel: 'Real usage', description: 'Layouts are designed around the traffic mix most small businesses actually see.' },
    { value: '1', suffix: '', label: 'Single accountable team', sublabel: 'Ownership', description: 'Design, development, and launch decisions are owned by the same small team.' },
  ];

  const storedStatCount = Number(getContentValue('stats', 'stat_count', ''));
  const statCount = (!isNaN(storedStatCount) && storedStatCount > 0) ? storedStatCount : statDefaults.length;

  const stats = Array.from({ length: statCount }, (_, index) => {
    const fallback = statDefaults[index];
    return {
      value: getContentValue('stats', `stat_${index + 1}_value`, fallback?.value || ''),
      suffix: getContentValue('stats', `stat_${index + 1}_suffix`, fallback?.suffix || ''),
      label: getContentValue('stats', `stat_${index + 1}_label`, fallback?.label || ''),
      sublabel: getContentValue('stats', `stat_${index + 1}_sublabel`, fallback?.sublabel || ''),
      description: getContentValue('stats', `stat_${index + 1}_desc`, fallback?.description || ''),
    };
  }).filter(s => s.label);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,180,255,0.03), transparent 60%)' }} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <SectionLabel number={labelParts[0] || '02'} label={labelParts[1] || 'Why Us'} />
        <SectionTitle>{getContentValue('stats', 'title', 'Why teams choose VAAD')}</SectionTitle>

        {/* Stat grid — seamless panel layout */}
        <div
          className={`grid grid-cols-1 ${statCount <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-px`}
          style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease, delay: index * 0.08 }}
              className="group relative p-7 md:p-8 card-accent-top transition-colors duration-300"
              style={{
                background: '#07070F',
                borderRight: (statCount <= 2 ? index % 2 === 0 : index % 4 !== 3) ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,180,255,0.025)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#07070F'; }}
            >
              {/* Sublabel */}
              <p
                className="mb-4"
                style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,45,85,0.6)' }}
              >
                {stat.sublabel}
              </p>

              {/* Number */}
              <div
                style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(48px,4.5vw,68px)', letterSpacing: '0.02em', lineHeight: 1 }}
              >
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <p
                className="mt-3 mb-4"
                style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#55556A' }}
              >
                {stat.label}
              </p>

              <div style={{ width: '20px', height: '1px', background: 'rgba(0,180,255,0.3)', marginBottom: '12px' }} />

              <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.7 }}>
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
