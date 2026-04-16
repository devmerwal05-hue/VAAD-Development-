import { useEffect, useState, useRef } from 'react';

export default function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isHoverCapable = window.matchMedia('(hover: hover)').matches;
    if (!isFinePointer || !isHoverCapable) return;

    let ticking = false;
    
    const updateScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
          setScrollProgress(scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', updateScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const isHoverCapable = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  if (!isFinePointer || !isHoverCapable) return null;

  return (
    <div
      className="fixed top-0 left-0 h-0.5 w-full bg-accent/70"
      style={{ transform: `scaleX(${scrollProgress / 100})`, transition: 'transform 0.1s ease-out' }}
    />
  );
}