import { motion } from 'framer-motion';

interface SectionLabelProps {
  number: string;
  label: string;
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 mb-6"
    >
      <span
        className="section-number"
        style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.55)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{ display: 'inline-block', width: '20px', height: '1px', background: 'rgba(0,180,255,0.5)' }} />
        {number}
      </span>
      <span style={{ display: 'inline-block', width: '4px', height: '4px', background: '#FF2D55', borderRadius: '50%', flexShrink: 0 }} />
      <span
        style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}
      >
        {label}
      </span>
    </motion.div>
  );
}
