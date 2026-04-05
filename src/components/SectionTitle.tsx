import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mb-12 text-text-primary"
      style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 1.04, letterSpacing: '-0.02em' }}
    >
      {children}
    </motion.h2>
  );
}
