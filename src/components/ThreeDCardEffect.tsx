import { useReducedMotion, useMotionValue, useSpring, type MotionStyle } from 'framer-motion';
import { useCallback, useMemo, useRef, type PointerEvent as ReactPointerEvent } from 'react';

export interface ThreeDCardEffectOptions {
  enabled: boolean;
  maxRotateX?: number;
  maxRotateY?: number;
  perspective?: number;
}

function supportsHoverFinePointer() {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function useThreeDCardEffect(options: ThreeDCardEffectOptions) {
  const { enabled, maxRotateX = 9, maxRotateY = 10, perspective = 900 } = options;

  const prefersReducedMotion = useReducedMotion();
  const finePointer = useMemo(() => supportsHoverFinePointer(), []);

  const allowEffect = enabled && !prefersReducedMotion && finePointer;

  const cardRef = useRef<HTMLElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRotationRef = useRef<{ rotateX: number; rotateY: number } | null>(null);

  const rotateXBase = useMotionValue(0);
  const rotateYBase = useMotionValue(0);

  const rotateX = useSpring(rotateXBase, { stiffness: 220, damping: 26, mass: 0.6 });
  const rotateY = useSpring(rotateYBase, { stiffness: 220, damping: 26, mass: 0.6 });

  const commitRotation = useCallback(() => {
    rafRef.current = null;
    const next = pendingRotationRef.current;
    pendingRotationRef.current = null;

    if (!next) return;
    rotateXBase.set(next.rotateX);
    rotateYBase.set(next.rotateY);
  }, [rotateXBase, rotateYBase]);

  const setRotation = useCallback(
    (nextRotateX: number, nextRotateY: number) => {
      pendingRotationRef.current = { rotateX: nextRotateX, rotateY: nextRotateY };
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(commitRotation);
    },
    [commitRotation]
  );

  const resetRotation = useCallback(() => {
    rectRef.current = null;
    pendingRotationRef.current = null;
    if (rafRef.current != null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rotateXBase.set(0);
    rotateYBase.set(0);
  }, [rotateXBase, rotateYBase]);

  const onPointerEnter = useCallback(() => {
    if (!allowEffect) return;
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
  }, [allowEffect]);

  const onPointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (!allowEffect) return;
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;

      const element = cardRef.current;
      if (!element) return;

      const rect = rectRef.current ?? element.getBoundingClientRect();
      rectRef.current = rect;

      if (!rect.width || !rect.height) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const percentX = (x - rect.width / 2) / (rect.width / 2);
      const percentY = (y - rect.height / 2) / (rect.height / 2);

      const nextRotateY = percentX * maxRotateY;
      const nextRotateX = -percentY * maxRotateX;

      setRotation(nextRotateX, nextRotateY);
    },
    [allowEffect, maxRotateX, maxRotateY, setRotation]
  );

  const onPointerLeave = useCallback(() => {
    if (!allowEffect) return;
    resetRotation();
  }, [allowEffect, resetRotation]);

  const tiltStyle = useMemo(
    () =>
      ({
        rotateX: allowEffect ? rotateX : 0,
        rotateY: allowEffect ? rotateY : 0,
        transformPerspective: perspective,
        transformStyle: 'preserve-3d',
        willChange: allowEffect ? 'transform' : undefined,
      }) satisfies MotionStyle,
    [allowEffect, perspective, rotateX, rotateY]
  );

  return {
    cardRef,
    tiltStyle,
    onPointerEnter,
    onPointerMove,
    onPointerLeave,
  };
}
