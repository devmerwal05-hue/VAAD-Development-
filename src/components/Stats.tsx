import { m as motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

function AnimatedStat({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (c) => Math.round(c));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !inView) setInView(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (inView) {
      const n = Number.parseInt(value, 10);
      if (!Number.isNaN(n)) animate(count, n, { duration: 1.8, ease: [0.16, 0.77, 0.47, 0.97] });
    }
  }, [count, inView, value]);

  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return <span ref={ref} className="gradient-text">{value}</span>;
  return (
    <span ref={ref}>
      <motion.span className="gradient-text">{rounded}</motion.span>
      {suffix && <span className="gradient-text">{suffix}</span>}
    </span>
  );
}

const statDefaults = [
  { value: '7',  suffix: '',  label: 'Days to first milestone',        sublabel: 'Delivery',      description: 'Projects start with a clearly defined first ship target instead of an open-ended discovery loop.' },
  { value: '48', suffix: 'h', label: 'Typical response window',        sublabel: 'Communication', description: 'You are not waiting days for a status update when decisions are blocking progress.' },
  { value: '90', suffix: '%', label: 'Mobile traffic share considered', sublabel: 'Real usage',   description: 'Layouts are designed around the traffic mix most small businesses actually see.' },
  { value: '1',  suffix: '',  label: 'Single accountable team',        sublabel: 'Ownership',     description: 'Design, development, and launch decisions are owned by the same small team.' },
];

export default function Stats() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('stats', 'label', '02 / Why Us').split(' / ');
  const storedCount = Number(getContentValue('stats', 'stat_count', ''));
  const statCount = !Number.isNaN(storedCount) && storedCount > 0 ? storedCount : statDefaults.length;

  const stats = Array.from({ length: statCount }, (_, i) => {
    const fb = statDefaults[i];
    return {
      value:       getContentValue('stats', `stat_${i + 1}_value`,    fb?.value || ''),
      suffix:      getContentValue('stats', `stat_${i + 1}_suffix`,   fb?.suffix || ''),
      label:       getContentValue('stats', `stat_${i + 1}_label`,    fb?.label || ''),
      sublabel:    getContentValue('stats', `stat_${i + 1}_sublabel`, fb?.sublabel || ''),
      description: getContentValue('stats', `stat_${i + 1}_desc`,    fb?.description || ''),
    };
  }).filter((s) => s.label);

  return (
    <section className="section-pad relative">
      {/* Subtle red radial */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(232,19,42,0.04), transparent 60%)' }} />
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-[1360px] mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '02'} / {labelParts[1] || 'Why Us'}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="mb-14"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
        >
          {getContentValue('stats', 'title', 'Why teams choose VAAD')}
        </motion.h2>

        <div className="rule-line-full mb-10" />

        <div className={`grid grid-cols-1 ${statCount <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-5 md:gap-6`}>
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease, delay: i * 0.08 }}
              className="group relative border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] px-8 py-10"
            >
              {/* Hover redlayer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />

              {/* Sublabel annotation */}
              <p className="annotation-label mb-4">{stat.sublabel}</p>

              {/* Value */}
              <div
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(42px, 5vw, 68px)', lineHeight: 0.9, letterSpacing: '-0.02em' }}
              >
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
              </div>

              {/* Label */}
              <p
                className="text-[12px] mt-4 mb-4"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(234,230,219,0.55)' }}
              >
                {stat.label}
              </p>

              {/* Rule */}
              <div className="h-[1px] mb-4 max-w-[40px]" style={{ background: 'rgba(232,19,42,0.4)' }} />

              {/* Description */}
              <p
                className="text-[13px] leading-[1.75]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.4)' }}
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
