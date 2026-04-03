import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'letters' | 'diamond' | 'glow' | 'exit'>('letters');
  const { getContentValue } = useContent();

  useEffect(() => {
    // Letter animation: 0-800ms
    // Diamond pop: 800ms
    // Glow pulse: 1200ms
    // Exit: 1800ms
    const t1 = setTimeout(() => setPhase('diamond'), 800);
    const t2 = setTimeout(() => setPhase('glow'), 1200);
    const t3 = setTimeout(() => setPhase('exit'), 1900);
    const t4 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? null : null}
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0, scale: 1.1 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-0 z-[200] flex items-center justify-center"
        style={{ background: '#050509' }}
      >
        {/* Ambient glow behind logo */}
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={phase === 'glow' || phase === 'exit'
            ? { opacity: 0.6, scale: 1.2 }
            : phase === 'diamond'
            ? { opacity: 0.3, scale: 0.8 }
            : { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: 0.8, ease }}
          style={{
            background: 'radial-gradient(circle, rgba(124,111,247,0.25) 0%, rgba(168,85,247,0.1) 40%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Logo container */}
        <div className="relative flex items-center gap-0" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
          {/* V */}
          <motion.span
            initial={{ opacity: 0, y: 30, rotateY: -40 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="text-[64px] md:text-[80px] text-white inline-block"
            style={{ transformOrigin: 'center bottom' }}
          >
            V
          </motion.span>

          {/* A (first) */}
          <motion.span
            initial={{ opacity: 0, y: 30, rotateY: -40 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.25 }}
            className="text-[64px] md:text-[80px] text-white inline-block"
            style={{ transformOrigin: 'center bottom' }}
          >
            A
          </motion.span>

          {/* Diamond — pops in between the two A's */}
          <motion.span
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={
              phase === 'diamond' || phase === 'glow' || phase === 'exit'
                ? { opacity: 1, scale: 1, rotate: 45 }
                : { opacity: 0, scale: 0, rotate: 0 }
            }
            transition={
              phase === 'diamond'
                ? { type: 'spring', stiffness: 500, damping: 15, mass: 0.5 }
                : { duration: 0.3 }
            }
            className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] bg-accent mx-[3px] mt-[8px] inline-block"
            style={{
              boxShadow: phase === 'glow' || phase === 'exit'
                ? '0 0 20px rgba(124,111,247,0.6), 0 0 60px rgba(124,111,247,0.3)'
                : 'none',
              transition: 'box-shadow 0.4s ease',
            }}
          />

          {/* A (second) */}
          <motion.span
            initial={{ opacity: 0, y: 30, rotateY: 40 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.4 }}
            className="text-[64px] md:text-[80px] text-white inline-block"
            style={{ transformOrigin: 'center bottom' }}
          >
            A
          </motion.span>

          {/* D */}
          <motion.span
            initial={{ opacity: 0, y: 30, rotateY: 40 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.55 }}
            className="text-[64px] md:text-[80px] text-white inline-block"
            style={{ transformOrigin: 'center bottom' }}
          >
            D
          </motion.span>
        </div>

        {/* Tagline fades in after diamond */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={
            phase === 'glow' || phase === 'exit'
              ? { opacity: 0.6, y: 0 }
              : { opacity: 0, y: 10 }
          }
          transition={{ duration: 0.4, ease }}
          className="absolute mt-[120px] md:mt-[140px] text-[11px] md:text-[12px] text-text-tertiary tracking-[0.2em] uppercase"
          style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
        >
          {getContentValue('intro_splash', 'tagline', 'Development')}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
}
