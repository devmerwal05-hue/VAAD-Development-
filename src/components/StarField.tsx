import { motion, type MotionValue, type Variants } from 'framer-motion';
import { startTransition, useEffect, useRef, useState } from 'react';

const starfieldRevealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

interface StarNode {
  depth: number;
  size: number;
  velocity: number;
  x: number;
  y: number;
}

export interface StarfieldProps {
  active?: boolean;
  className?: string;
  warpRef?: React.MutableRefObject<number>;
  warpStrength?: MotionValue<number>;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function createStar(width: number, height: number): StarNode {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth: Math.random(),
    size: 0.8 + Math.random() * 2.4,
    velocity: 0.08 + Math.random() * 0.22,
  };
}

export default function StarField({ className = '', active = true, warpRef, warpStrength }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const starsRef = useRef<StarNode[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothedRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const idleWindow = window as Window & {
      cancelIdleCallback?: (handle: number) => void;
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    };

    let cancelled = false;
    const enable = () => {
      if (cancelled) return;
      startTransition(() => setReady(true));
    };

    let idleHandle: number | null = null;
    let timeoutHandle: number | null = null;

    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleHandle = idleWindow.requestIdleCallback(enable, { timeout: 1400 });
    } else {
      timeoutHandle = window.setTimeout(enable, 180);
    }

    return () => {
      cancelled = true;
      if (typeof idleWindow.cancelIdleCallback === 'function' && idleHandle !== null) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle !== null) {
        window.clearTimeout(timeoutHandle);
      }
    };
  }, [isMobile]);

  useEffect(() => {
    if (!ready || isMobile || !active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const setCanvasSize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.max(1, Math.floor(bounds.width * dpr));
      canvas.height = Math.max(1, Math.floor(bounds.height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (starsRef.current.length === 0) {
        const starCount = Math.floor((bounds.width * bounds.height) / 9800);
        starsRef.current = Array.from({ length: clamp(starCount, 120, 220) }, () => createStar(bounds.width, bounds.height));
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      mouseRef.current.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const render = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      const warp = clamp(warpStrength?.get() ?? warpRef?.current ?? 0.32, 0.15, 1);

      smoothedRef.current.x += (mouseRef.current.x - smoothedRef.current.x) * 0.035;
      smoothedRef.current.y += (mouseRef.current.y - smoothedRef.current.y) * 0.035;

      context.clearRect(0, 0, width, height);
      context.fillStyle = '#030308';
      context.fillRect(0, 0, width, height);

      // Clip to canvas bounds - prevents off-screen drawing
      context.save();
      context.beginPath();
      context.rect(0, 0, width, height);
      context.clip();

      for (const star of starsRef.current) {
        const depthShiftX = smoothedRef.current.x * star.depth * 32;
        const depthShiftY = smoothedRef.current.y * star.depth * 24;
        const drift = 0.2 + star.velocity * (1 + warp * 3.5);

        star.y += drift * (0.7 + star.depth * 1.2);
        star.x += smoothedRef.current.x * 0.18 * (0.2 + star.depth);

        // Reset with tighter threshold to prevent clustering
        if (star.y > height + 2 || star.x < -2 || star.x > width + 2) {
          star.x = Math.random() * width;
          star.y = -2 - Math.random() * 120;
          star.depth = Math.random();
          star.size = 0.8 + Math.random() * 2.4;
          star.velocity = 0.08 + Math.random() * 0.22;
        }

        const currentX = star.x + depthShiftX;
        const currentY = star.y + depthShiftY;

        // Skip drawing if off canvas
        if (currentX < 0 || currentX > width || currentY < 0 || currentY > height) continue;

        const trail = 10 + warp * 46 * (0.35 + star.depth);
        const tailX = currentX - smoothedRef.current.x * 18;
        const tailY = currentY - trail;

        const gradient = context.createLinearGradient(currentX, currentY, tailX, tailY);
        gradient.addColorStop(0, star.depth > 0.64 ? 'rgba(0,212,255,0.95)' : 'rgba(232,232,240,0.9)');
        gradient.addColorStop(1, 'rgba(3,3,8,0)');

        context.strokeStyle = gradient;
        context.lineWidth = star.size * (0.35 + warp * 0.75);
        context.beginPath();
        context.moveTo(currentX, currentY);
        context.lineTo(tailX, tailY);
        context.stroke();

        context.fillStyle = star.depth > 0.64 ? '#00D4FF' : '#E8E8F0';
        context.beginPath();
        context.arc(currentX, currentY, star.size * (0.4 + warp * 0.45), 0, Math.PI * 2);
        context.fill();
      }
      
      // Restore clipping after star loop
      context.restore();

      frameRef.current = window.requestAnimationFrame(render);
    };

    setCanvasSize();
    render();

    window.addEventListener('resize', setCanvasSize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [active, isMobile, ready, warpRef, warpStrength]);

  return (
    <motion.div
      variants={starfieldRevealVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {isMobile || !ready ? (
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 76% 22%, rgba(0,212,255,0.18), transparent 28%), linear-gradient(180deg, rgba(9,10,22,0.6), rgba(3,3,8,0))',
          }}
        />
      ) : (
        <canvas ref={canvasRef} className="h-full w-full will-change-transform" aria-hidden="true" />
      )}
    </motion.div>
  );
}
