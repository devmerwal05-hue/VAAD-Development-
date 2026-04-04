import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

export default function SectionLabel({ number, label }: { number: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ghostY = useTransform(scrollYProgress, [0, 0.5, 1], [22, 0, -24]);
  const ghostOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.12, 0.35, 0.1]);

  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
      className="section-label-wrap mb-6 inline-flex items-center gap-4"
    >
      <m.span
        aria-hidden="true"
        className="section-ghost-number"
        style={{ y: ghostY, opacity: ghostOpacity }}
      >
        {number}
      </m.span>

      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
      <span className="section-ref">{number} / {label}</span>
    </m.div>
  );
}
