import { motion } from 'framer-motion';

export default function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.4 }}
      className="inline-flex items-center gap-3 mb-5"
    >
      <span className="text-accent text-[13px] font-[800]" style={{ fontFamily: 'Syne' }}>{number}</span>
      <span className="w-8 h-[1px] bg-accent/30" />
      <span className="text-[12px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{label}</span>
    </motion.div>
  );
}
