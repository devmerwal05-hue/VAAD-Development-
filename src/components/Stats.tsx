import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

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
  if (Number.isNaN(numericValue)) return <span ref={ref} className="gradient-text">{value}</span>;

  return (
    <span ref={ref}>
      <motion.span className="gradient-text">{rounded}</motion.span>
      {suffix && <span className="gradient-text">{suffix}</span>}
    </span>
  );
}

export default function Stats() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('stats', 'label', '02 / Why Us').split(' / ');
  const stats = [1, 2, 3, 4].map((index) => ({
    value: getContentValue('stats', `stat_${index}_value`, ['7', '48', '90', '1'][index - 1]),
    suffix: getContentValue('stats', `stat_${index}_suffix`, ['', 'h', '%', ''][index - 1]),
    label: getContentValue('stats', `stat_${index}_label`, ['Days to first milestone', 'Typical response window', 'Mobile traffic share considered', 'Single accountable team'][index - 1]),
    sublabel: getContentValue('stats', `stat_${index}_sublabel`, ['Delivery', 'Communication', 'Real usage', 'Ownership'][index - 1]),
    description: getContentValue('stats', `stat_${index}_desc`, [
      'Projects start with a clearly defined first ship target instead of an open-ended discovery loop.',
      'You are not waiting days for a status update when decisions are blocking progress.',
      'Layouts are designed around the traffic mix most small businesses actually see.',
      'Design, development, and launch decisions are owned by the same small team.',
    ][index - 1]),
  }));

  return (
    <section className="py-24 md:py-32 relative">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,111,247,0.03), transparent 60%)' }} />
      <div className="max-w-[1280px] mx-auto px-6 relative">
        <SectionLabel number={labelParts[0] || '02'} label={labelParts[1] || 'Why Us'} />
        <SectionTitle>{getContentValue('stats', 'title', 'Why teams choose VAAD')}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 0.77, 0.47, 0.97] as [number, number, number, number], delay: index * 0.08 }}
              className="perspective-container"
            >
              <div className="tilt-card p-6 rounded-2xl bg-surface-1 border border-[rgba(255,255,255,0.04)] card-hover relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] gradient-bg opacity-80" />
                <div className="text-[48px] leading-none mb-2" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
                  <AnimatedStat value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[11px] uppercase tracking-[0.1em] text-text-secondary mb-3" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{stat.sublabel} - {stat.label}</div>
                <p className="text-[14px] text-text-secondary leading-[1.7]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
