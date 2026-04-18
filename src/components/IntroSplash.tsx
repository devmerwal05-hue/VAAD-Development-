import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const { getContentValue } = useContent();
  const [phase, setPhase] = useState<'boot' | 'dot' | 'glow' | 'exit'>('boot');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('dot'), 700);
    const t2 = setTimeout(() => setPhase('glow'), 1100);
    const t3 = setTimeout(() => setPhase('exit'), 1800);
    const t4 = setTimeout(() => onComplete(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={phase === 'exit' ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
        style={{ background: '#040408' }}
      >
        {/* Scan-line grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(108,99,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.025) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Ambient glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            phase === 'glow' || phase === 'exit'
              ? { opacity: 1, scale: 1.3 }
              : phase === 'dot'
              ? { opacity: 0.4, scale: 0.8 }
              : { opacity: 0, scale: 0.5 }
          }
          transition={{ duration: 0.9, ease }}
          style={{
            width: '320px',
            height: '320px',
            background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, rgba(108,99,255,0.06) 40%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center">
          {/* V */}
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.08 }}
            style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(64px,12vw,88px)', letterSpacing: '0.05em', color: '#F0EDE6', lineHeight: 1 }}
          >
            VA
          </motion.span>

          {/* Electric dot */}
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={
              phase === 'dot' || phase === 'glow' || phase === 'exit'
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0 }
            }
            transition={
              phase === 'dot'
                ? { type: 'spring', stiffness: 600, damping: 14, mass: 0.4 }
                : { duration: 0.2 }
            }
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--color-accent)',
              margin: '0 4px',
              marginTop: '6px',
              flexShrink: 0,
              boxShadow:
                phase === 'glow' || phase === 'exit'
                  ? '0 0 16px rgba(108,99,255,0.9), 0 0 48px rgba(108,99,255,0.45)'
                  : 'none',
              transition: 'box-shadow 0.4s ease',
            }}
          />

          {/* AD */}
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.25 }}
            style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(64px,12vw,88px)', letterSpacing: '0.05em', color: '#F0EDE6', lineHeight: 1 }}
          >
            AD
          </motion.span>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={
            phase === 'glow' || phase === 'exit'
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 8 }
          }
          transition={{ duration: 0.4, ease }}
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '10px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(108,99,255,0.55)',
            marginTop: '16px',
          }}
        >
          {getContentValue('intro_splash', 'tagline', 'Development')}
        </motion.p>

        {/* Loading bar */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          style={{ width: '120px', height: '1px', background: 'rgba(255,255,255,0.06)' }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 0.77, 0.47, 0.97] }}
            style={{
              height: '100%',
              background: 'var(--color-accent)',
              transformOrigin: 'left',
              boxShadow: '0 0 8px rgba(108,99,255,0.6)',
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
