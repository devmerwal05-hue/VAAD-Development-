import { useEffect, useMemo, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  depth: number;
  size: number;
  tint: 'primary' | 'accent';
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function readCssVar(name: string) {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export default function StarField({
  className = '',
  active = true,
  warpRef,
}: {
  className?: string;
  active?: boolean;
  warpRef?: React.MutableRefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const starsRef = useRef<Star[]>([]);
  const lastTimeRef = useRef<number>(0);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const isTouchLike = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
    return coarsePointer || navigator.maxTouchPoints > 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const safeCanvas: HTMLCanvasElement = canvas;
    const safeCtx: CanvasRenderingContext2D = ctx;

    const primaryColor = getComputedStyle(document.body).color;
    const accentColor = readCssVar('--color-accent') || primaryColor;

    const starCount = isTouchLike ? 140 : 240;

    function createStar(nearCenter: boolean): Star {
      const spread = nearCenter ? 0.15 : 1;
      const x = (Math.random() * 2 - 1) * spread;
      const y = (Math.random() * 2 - 1) * spread;
      const depth = Math.random();
      const size = 0.6 + (1 - depth) * 1.6;
      const tint = Math.random() < 0.08 ? 'accent' : 'primary';
      return {
        x,
        y,
        prevX: x,
        prevY: y,
        depth,
        size,
        tint,
      };
    }

    function resetStar(star: Star) {
      const next = createStar(true);
      star.x = next.x;
      star.y = next.y;
      star.prevX = next.prevX;
      star.prevY = next.prevY;
      star.depth = next.depth;
      star.size = next.size;
      star.tint = next.tint;
    }

    function resize() {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const rect = safeCanvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.floor(rect.width * dpr));
      const nextHeight = Math.max(1, Math.floor(rect.height * dpr));

      if (safeCanvas.width !== nextWidth) safeCanvas.width = nextWidth;
      if (safeCanvas.height !== nextHeight) safeCanvas.height = nextHeight;

      safeCtx.setTransform(1, 0, 0, 1, 0, 0);
      safeCtx.scale(dpr, dpr);

      if (starsRef.current.length === 0) {
        starsRef.current = Array.from({ length: starCount }, () => createStar(false));
      }
    }

    function drawFrame(timeMs: number) {
      const rect = safeCanvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width <= 1 || height <= 1) return;

      const currentWarp = clamp(warpRef?.current ?? 0, 0, 1);

      const time = timeMs / 1000;
      const last = lastTimeRef.current || time;
      const dt = clamp(time - last, 0, 1 / 24);
      lastTimeRef.current = time;

      safeCtx.clearRect(0, 0, width, height);
      safeCtx.lineCap = 'round';

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const accel = 0.55 + currentWarp * 6.5;

      for (const star of starsRef.current) {
        star.prevX = star.x;
        star.prevY = star.y;

        const depthFactor = 0.6 + (1 - star.depth) * 1.2;
        const growth = 1 + dt * accel * depthFactor;
        star.x *= growth;
        star.y *= growth;

        if (Math.abs(star.x) > 1.35 || Math.abs(star.y) > 1.35) {
          resetStar(star);
          continue;
        }

        const x1 = centerX + star.prevX * centerX;
        const y1 = centerY + star.prevY * centerY;
        const x2 = centerX + star.x * centerX;
        const y2 = centerY + star.y * centerY;

        const baseAlpha = 0.25 + (1 - star.depth) * 0.65;
        const alpha = clamp(baseAlpha * (0.75 + currentWarp * 0.8), 0, 1);

        safeCtx.globalAlpha = alpha;
        safeCtx.strokeStyle = star.tint === 'accent' ? accentColor : primaryColor;
        safeCtx.fillStyle = star.tint === 'accent' ? accentColor : primaryColor;

        const lineWidth = star.size * (0.55 + currentWarp * 1.2);
        safeCtx.lineWidth = lineWidth;

        if (currentWarp > 0.18) {
          safeCtx.beginPath();
          safeCtx.moveTo(x1, y1);
          safeCtx.lineTo(x2, y2);
          safeCtx.stroke();
        } else {
          safeCtx.beginPath();
          safeCtx.arc(x2, y2, star.size * 0.5, 0, Math.PI * 2);
          safeCtx.fill();
        }
      }

      safeCtx.globalAlpha = 1;

      if (!active || prefersReducedMotion) return;
      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    }

    resize();
    drawFrame(0);

    const onResize = () => {
      resize();
      drawFrame(performance.now());
    };

    window.addEventListener('resize', onResize, { passive: true });

    if (active && !prefersReducedMotion) {
      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (animationFrameRef.current != null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [active, prefersReducedMotion, isTouchLike, warpRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
