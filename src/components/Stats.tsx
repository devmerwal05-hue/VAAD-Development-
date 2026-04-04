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
    <section className="section-pad swiss-section relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_40%,rgba(120,174,255,0.12),transparent_60%)]" />
      <div className="absolute inset-0 grid-pattern opacity-12 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">stats.matrix</span>
      <span className="swiss-meta swiss-meta--tr">coord // 48.12N</span>

      <div className="site-container swiss-grid relative z-10">
        <div className="swiss-full-col mb-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff2c1b', display: 'inline-block' }} />
            <span className="section-ref">{labelParts[0] || '02'} / {labelParts[1] || 'Why Us'}</span>
          </div>
          <span className="archive-tag hidden md:block">sync_stability_matrix</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="display-section swiss-text-col mb-2 text-[#dfe8f8]"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 6vw, 82px)', fontStyle: 'italic' }}
        >
          {getContentValue('stats', 'title', 'Why teams choose VAAD')}
        </motion.h2>

        <div className="archive-panel swiss-full-col p-6 md:p-8">
          <div className={`grid grid-cols-1 ${statCount <= 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2'} gap-4 md:gap-6`}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                className="border border-[rgba(126,164,224,0.24)] bg-[rgba(5,22,52,0.85)] p-5"
              >
                <p className="archive-tag" style={{ color: 'rgba(255,44,27,0.92)' }}>metric_{String(i + 1).padStart(2, '0')}</p>

                <div
                  className="mt-3 text-[58px] leading-none text-[#dfe8f8]"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontStyle: 'italic' }}
                >
                  <AnimatedStat value={stat.value} suffix={stat.suffix} />
                </div>

                <p className="mono-readable mt-3 text-[10px] uppercase text-[rgba(166,192,227,0.9)]">{stat.label}</p>
                <p className="mt-2 text-[12px] text-[rgba(139,164,202,0.88)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
