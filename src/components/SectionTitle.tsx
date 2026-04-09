import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className="mb-12 text-text-primary"
      style={{
        fontFamily: 'Bebas Neue, sans-serif',
        fontWeight: 400,
        fontSize: 'clamp(52px, 7vw, 96px)',
        lineHeight: 0.95,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </motion.h2>
  );
}
