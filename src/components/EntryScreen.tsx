import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { useContent } from '../lib/useContent';
import StarField from './StarField';

export default function EntryScreen({ onComplete }: { onComplete: () => void }) {
  const { getContentValue } = useContent();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const warpRef = useRef(0);
  const [isLaunching, setIsLaunching] = useState(false);
  const hasLaunchedRef = useRef(false);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  }, []);

  const isTouchLike = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const coarsePointer = window.matchMedia?.('(pointer: coarse)')?.matches ?? false;
    return coarsePointer || navigator.maxTouchPoints > 0;
  }, []);

  const brandLabel = getContentValue('entry', 'brand_label', 'VAAD Development');
  const title = getContentValue('entry', 'title', 'Launch into build mode');
  const subtitle = getContentValue(
    'entry',
    'subtitle',
    ''
  );
  const buttonLabel = getContentValue('entry', 'launch_button', 'Launch');
  const launchingLabel = getContentValue('entry', 'launching_label', 'Launching…');
  const hintKeyboard = getContentValue('entry', 'hint_keyboard', 'Press Enter');
  const hintTouch = getContentValue('entry', 'hint_touch', 'Tap to launch');

  const launch = useCallback(() => {
    if (hasLaunchedRef.current) return;
    hasLaunchedRef.current = true;
    setIsLaunching(true);

    const root = rootRef.current;

    if (!root || prefersReducedMotion) {
      onComplete();
      return;
    }

    gsap.killTweensOf(warpRef);
    gsap.killTweensOf(root);

    const tl = gsap.timeline({
      defaults: { ease: 'power3.inOut' },
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(
      warpRef,
      {
        current: 1,
        duration: 0.75,
        ease: 'power3.in',
      },
      0
    );

    tl.to(
      root,
      {
        opacity: 0,
        duration: 0.55,
        ease: 'power2.in',
      },
      0.25
    );
  }, [onComplete, prefersReducedMotion]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        launch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [launch]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] bg-[var(--color-page-bg)]"
      onClick={() => {
        if (!isLaunching) launch();
      }}
    >
      {!prefersReducedMotion && (
        <StarField
          warpRef={warpRef}
          active
          className="absolute inset-0 w-full h-full opacity-80"
        />
      )}
      {prefersReducedMotion && (
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,180,255,0.08)] to-transparent" />
      )}

      <div className="absolute inset-0 hero-gradient-1 opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 hero-gradient-2 opacity-60" aria-hidden="true" />
      <div className="absolute inset-0 grid-pattern opacity-50" aria-hidden="true" />

      <div className="relative h-full w-full flex items-center justify-center px-6">
        <div className="max-w-[760px] w-full text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
            {brandLabel}
          </p>

          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05]">
            {title}
          </h1>

          {subtitle.trim().length > 0 ? (
            <p className="mt-4 text-base sm:text-lg text-white/60">{subtitle}</p>
          ) : null}

          <div className="mt-8 flex items-center justify-center">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                launch();
              }}
              disabled={isLaunching}
              className="shimmer-btn px-5 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] text-sm sm:text-base transition-all disabled:opacity-50"
            >
              {isLaunching ? launchingLabel : buttonLabel}
            </button>
          </div>

          <p className="mt-6 text-[12px] text-white/40">
            {isTouchLike ? hintTouch : hintKeyboard}
          </p>
        </div>
      </div>
    </div>
  );
}
