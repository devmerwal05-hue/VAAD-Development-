import { m } from 'framer-motion';
import type { ReactNode } from 'react';

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <m.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="display-section mb-12 break-words"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        fontSize: 'clamp(36px, 5vw, 68px)',
        color: '#EAE6DB',
      }}
    >
      {children}
    </m.h2>
  );
}
