import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useContent } from '../lib/useContent';

interface Props { onComplete: () => void; }

export default function IntroSplash({ onComplete }: Props) {
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const { getContentValue } = useContent();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('hold'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 2200);
    const t3 = setTimeout(() => onComplete(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#060C20' }}
        >
          {/* Grid overlay */}
          <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

          {/* Top annotation bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute top-8 left-0 right-0 flex items-center justify-between px-8"
          >
            <span className="annotation-label">{getContentValue('intro_splash', 'top_left', 'SPECIMEN / 001')}</span>
            <span className="annotation-label">{getContentValue('intro_splash', 'top_center', 'EST. 2024')}</span>
            <span className="annotation-label">{getContentValue('intro_splash', 'top_right', 'VAA-DEV-X')}</span>
          </motion.div>

          {/* Horizontal scan line — animates across */}
          <motion.div
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: phase === 'hold' ? 1 : 0, transformOrigin: phase === 'hold' ? 'left' : 'right' }}
            transition={{ duration: 0.55, ease: [0.16, 0.77, 0.47, 0.97] }}
            className="absolute left-0 right-0 h-[1px]"
            style={{ top: '50%', background: 'rgba(232, 19, 42, 0.4)' }}
          />

          {/* Main VAAD text */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 40, scaleX: 0.92 }}
              animate={{ opacity: 1, y: 0, scaleX: 1 }}
              transition={{ duration: 0.55, ease: [0.16, 0.77, 0.47, 0.97], delay: 0.1 }}
              className="relative"
            >
              <h1
                className="text-[#EAE6DB] text-center leading-none select-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: 'clamp(80px, 20vw, 200px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 0.85,
                }}
              >
                {getContentValue('nav', 'logo_text', 'VAAD')}
              </h1>

              {/* Red overlay accent — partial text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'hold' ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
                style={{ clipPath: 'inset(0 60% 0 0)' }}
              >
                <h1
                  className="text-[#E8132A] text-center leading-none select-none"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: 'clamp(80px, 20vw, 200px)',
                    letterSpacing: '-0.04em',
                    lineHeight: 0.85,
                  }}
                >
                  {getContentValue('nav', 'logo_text', 'VAAD')}
                </h1>
              </motion.div>

              {/* Corner marks */}
              <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[rgba(232,19,42,0.6)]" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[rgba(232,19,42,0.6)]" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[rgba(232,19,42,0.6)]" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[rgba(232,19,42,0.6)]" />
            </motion.div>

            {/* Sub-label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'hold' ? 1 : 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex items-center gap-4 mt-6"
            >
              <div className="h-[1px] w-12" style={{ background: 'rgba(232,19,42,0.4)' }} />
              <span
                className="text-[9px] tracking-[0.35em] uppercase"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(234,230,219,0.4)' }}
              >
                {getContentValue('intro_splash', 'tagline', 'Development')}
              </span>
              <div className="h-[1px] w-12" style={{ background: 'rgba(232,19,42,0.4)' }} />
            </motion.div>
          </div>

          {/* Bottom annotation bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8"
          >
            <span className="annotation-label">{getContentValue('intro_splash', 'bottom_left', 'SYSTEM / INIT')}</span>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }}
              />
              <span className="annotation-label">{getContentValue('intro_splash', 'loading_label', 'Loading')}</span>
            </div>
            <span className="annotation-label">{getContentValue('intro_splash', 'bottom_right', 'VX / 2026')}</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
