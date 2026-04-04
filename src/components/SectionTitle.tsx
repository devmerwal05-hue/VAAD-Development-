import { m } from 'framer-motion';
import type { ReactNode } from 'react';

export default function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <m.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="mb-12 break-words [text-wrap:balance]"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontWeight: 900,
        fontSize: 'clamp(36px, 5vw, 68px)',
        lineHeight: 0.9,
        letterSpacing: '-0.03em',
        color: '#EAE6DB',
      }}
    >
      {children}
    </m.h2>
  );
}
