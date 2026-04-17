import { motion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

const cursorPresenceVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
};

const cursorLabelVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
  },
};

export interface CustomCursorProps {
  enabled?: boolean;
}

function deriveLabel(target: HTMLElement | null) {
  if (!target) return '';
  if (target.dataset.cursorLabel) return target.dataset.cursorLabel;
  if (target instanceof HTMLButtonElement && target.type === 'submit') return 'send';
  if (target instanceof HTMLAnchorElement) return target.target === '_blank' ? 'open' : 'view';
  if (target.closest('form')) return 'edit';
  return 'view';
}

export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');
  const [hidden, setHidden] = useState(true);
  const [isTouch, setIsTouch] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const ringX = useSpring(pointerX, { damping: 28, stiffness: 320, mass: 0.45 });
  const ringY = useSpring(pointerY, { damping: 28, stiffness: 320, mass: 0.45 });
  const dotX = useSpring(pointerX, { damping: 44, stiffness: 800, mass: 0.2 });
  const dotY = useSpring(pointerY, { damping: 44, stiffness: 800, mass: 0.2 });

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouch(media.matches || window.innerWidth < 768);
    update();
    media.addEventListener('change', update);
    window.addEventListener('resize', update, { passive: true });
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled || isTouch) return;

    const handlePointerMove = (event: PointerEvent) => {
      setHidden(false);

      const candidate = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        '[data-cursor-label], a, button, input, textarea, select, [role="button"]',
      );

      if (candidate) {
        const bounds = candidate.getBoundingClientRect();
        const magneticX = bounds.left + bounds.width / 2;
        const magneticY = bounds.top + bounds.height / 2;
        pointerX.set(event.clientX * 0.62 + magneticX * 0.38);
        pointerY.set(event.clientY * 0.62 + magneticY * 0.38);
        setLabel(deriveLabel(candidate));
        setActive(true);
      } else {
        pointerX.set(event.clientX);
        pointerY.set(event.clientY);
        setLabel('');
        setActive(false);
      }
    };

    const handlePointerLeave = () => {
      setHidden(true);
      setActive(false);
      setLabel('');
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      document.body.style.cursor = '';
    };
  }, [enabled, isTouch, pointerX, pointerY]);

  if (!enabled || isTouch) return null;

  return (
    <>
      <motion.div
        variants={cursorPresenceVariants}
        animate={hidden ? 'hidden' : 'visible'}
        className="pointer-events-none fixed left-0 top-0 z-[140]"
        style={{ x: dotX, y: dotY }}
      >
        <div
          className="h-2.5 w-2.5 rounded-full bg-[#E8E8F0]"
          style={{ transform: 'translate(-50%, -50%)', boxShadow: active ? '0 0 18px rgba(108,99,255,0.45)' : '0 0 10px rgba(232,232,240,0.35)' }}
        />
      </motion.div>

      <motion.div
        variants={cursorPresenceVariants}
        animate={hidden ? 'hidden' : 'visible'}
        className="pointer-events-none fixed left-0 top-0 z-[139]"
        style={{ x: ringX, y: ringY }}
      >
        <div
          className="custom-cursor-ring flex items-center justify-center rounded-full border border-[rgba(232,232,240,0.22)] bg-[rgba(108,99,255,0.08)] text-[10px] uppercase tracking-[0.28em] text-text-primary"
          style={{
            transform: 'translate(-50%, -50%)',
            width: active ? 96 : 34,
            height: active ? 96 : 34,
            fontFamily: 'JetBrains Mono, monospace',
            transition: 'width 180ms ease, height 180ms ease, border-color 180ms ease, background 180ms ease',
            borderColor: active ? 'rgba(108,99,255,0.42)' : 'rgba(232,232,240,0.16)',
            background: active ? 'rgba(108,99,255,0.14)' : 'rgba(108,99,255,0.06)',
          }}
        >
          <motion.span
            variants={cursorLabelVariants}
            animate={active && label ? 'visible' : 'hidden'}
            className="whitespace-nowrap pl-[0.28em]"
          >
            {label}
          </motion.span>
        </div>
      </motion.div>
    </>
  );
}
