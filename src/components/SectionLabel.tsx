import { m } from 'framer-motion';

export default function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <m.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-3 mb-5"
    >
      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
      <span className="section-ref">{number} / {label}</span>
    </m.div>
  );
}
