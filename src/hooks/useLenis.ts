import { useEffect } from 'react';
import Lenis from 'lenis';

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: false,
      wheelMultiplier: 0.5,
      touchMultiplier: 1,
      infinite: false,
      lerp: 0.08,
    });

    let rafId: number;
    let lastTime = 0;
    
    const raf = (time: number) => {
      const delta = time - lastTime;
      if (delta > 24) {
        lenis.raf(time);
        lastTime = time;
      }
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}