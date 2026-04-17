import { motion, type Variants } from 'framer-motion';

const sectionLabelVariants: Variants = {
  hidden: { opacity: 0.2, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export interface SectionLabelProps {
  label: string;
  number: string;
}

export default function SectionLabel({ number, label }: SectionLabelProps) {
  return (
    <motion.div
      variants={sectionLabelVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="mb-6 flex items-center gap-4"
    >
      <span
        className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.34em] text-[rgba(232,232,240,0.48)]"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        <span className="h-px w-8 bg-[rgba(108,99,255,0.55)]" />
        {number}
      </span>
      <span
        className="text-[11px] uppercase tracking-[0.34em] text-[rgba(232,232,240,0.74)]"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {label}
      </span>
    </motion.div>
  );
}
