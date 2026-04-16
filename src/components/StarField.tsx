import { useEffect, useMemo, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  depth: number;
  size: number;
  tint: 'primary' | 'accent';
  isShooting: boolean;
  shootAngle: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
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
  const animationFrameRef = useRef<number | undefined>(undefined);
  const starsRef = useRef<Star[]>([]);
  const lastTimeRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const shootingRef = useRef<Star | null>(null);

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

    const primaryColor = 'rgba(240, 237, 230, 0.7)';
    const accentColor = '#00B4FF';

    const starCount = isTouchLike ? 120 : 180;
    const maxDPR = 1.5;

    function createStar(nearCenter: boolean): Star {
      const spread = nearCenter ? 0.12 : 1;
      return {
        x: (Math.random() * 2 - 1) * spread,
        y: (Math.random() * 2 - 1) * spread,
        prevX: 0,
        prevY: 0,
        depth: Math.random(),
        size: 0.5 + (1 - Math.random()) * 1.2,
        tint: Math.random() < 0.1 ? 'accent' : 'primary',
        isShooting: false,
        shootAngle: 0,
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
      star.isShooting = false;
    }

    function resize() {
      const dpr = Math.max(1, Math.min(maxDPR, window.devicePixelRatio || 1));
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
      const dt = clamp(time - last, 0, 1 / 30);
      lastTimeRef.current = time;

      mouseRef.current.x = lerp(mouseRef.current.x, mouseRef.current.targetX, 0.05);
      mouseRef.current.y = lerp(mouseRef.current.y, mouseRef.current.targetY, 0.05);

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const parallaxStrength = 0.04;

      safeCtx.clearRect(0, 0, width, height);
      safeCtx.lineCap = 'round';

      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const accel = 0.45 + currentWarp * 5;

      if (!shootingRef.current && Math.random() < 0.003) {
        const randomStar = starsRef.current[Math.floor(Math.random() * starsRef.current.length)];
        if (randomStar) {
          shootingRef.current = randomStar;
          randomStar.isShooting = true;
          randomStar.shootAngle = Math.random() * Math.PI * 2;
        }
      }

      for (const star of starsRef.current) {
        const prevX = star.x;
        const prevY = star.y;
        const prevDepth = star.depth;

        const depthFactor = 0.5 + (1 - star.depth) * 1;
        const growth = 1 + dt * accel * depthFactor;
        star.x *= growth;
        star.y *= growth;

        const bound = 1.3;
        if (Math.abs(star.x) > bound || Math.abs(star.y) > bound) {
          if (shootingRef.current === star) {
            shootingRef.current = null;
          }
          resetStar(star);
          continue;
        }

        const px = star.x + mouseX * star.depth * parallaxStrength;
        const py = star.y + mouseY * star.depth * parallaxStrength;
        const ppx = prevX + mouseX * prevDepth * parallaxStrength;
        const ppy = prevY + mouseY * prevDepth * parallaxStrength;

        const screenX = centerX + px * centerX;
        const screenY = centerY + py * centerY;
        const prevScreenX = centerX + ppx * centerX;
        const prevScreenY = centerY + ppy * centerY;

        const baseAlpha = 0.2 + (1 - star.depth) * 0.6;
        const alpha = clamp(baseAlpha * (0.7 + currentWarp * 0.7), 0, 1);

        safeCtx.globalAlpha = alpha;
        safeCtx.strokeStyle = star.tint === 'accent' ? accentColor : primaryColor;
        safeCtx.fillStyle = star.tint === 'accent' ? accentColor : primaryColor;

        const lineWidth = star.size * (0.4 + currentWarp * 0.8);
        safeCtx.lineWidth = lineWidth;

        if (star.isShooting && shootingRef.current === star) {
          const tailLength = 80;
          const tailX = screenX - Math.cos(star.shootAngle) * tailLength;
          const tailY = screenY - Math.sin(star.shootAngle) * tailLength;
          
          safeCtx.beginPath();
          safeCtx.moveTo(tailX, tailY);
          safeCtx.lineTo(screenX, screenY);
          safeCtx.globalAlpha = 0.9;
          safeCtx.stroke();
          
          safeCtx.globalAlpha = alpha * 1.5;
          safeCtx.beginPath();
          safeCtx.arc(screenX, screenY, star.size * 1.2, 0, Math.PI * 2);
          safeCtx.fill();
        } else if (currentWarp > 0.15) {
          safeCtx.beginPath();
          safeCtx.moveTo(prevScreenX, prevScreenY);
          safeCtx.lineTo(screenX, screenY);
          safeCtx.stroke();
        } else {
          safeCtx.beginPath();
          safeCtx.arc(screenX, screenY, star.size * 0.4, 0, Math.PI * 2);
          safeCtx.fill();
        }
      }

      safeCtx.globalAlpha = 1;

      if (!active || prefersReducedMotion) return;
      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = safeCanvas.getBoundingClientRect();
      mouseRef.current.targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseRef.current.targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    resize();
    drawFrame(0);

    const onResize = () => {
      resize();
      drawFrame(performance.now());
    };

    window.addEventListener('resize', onResize, { passive: true });
    safeCanvas.addEventListener('mousemove', onMouseMove, { passive: true });

    if (active && !prefersReducedMotion) {
      animationFrameRef.current = window.requestAnimationFrame(drawFrame);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      safeCanvas.removeEventListener('mousemove', onMouseMove);
      if (animationFrameRef.current) {
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