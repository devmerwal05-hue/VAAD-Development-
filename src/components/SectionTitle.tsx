import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const sectionTitleVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

export interface SectionTitleProps {
  children: ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <motion.h2
      variants={sectionTitleVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      className="mb-12 max-w-[14ch] text-[clamp(2.8rem,7vw,6.25rem)] font-[800] uppercase leading-[0.92] tracking-[-0.055em] text-text-primary"
      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
    >
      {children}
    </motion.h2>
  );
}
