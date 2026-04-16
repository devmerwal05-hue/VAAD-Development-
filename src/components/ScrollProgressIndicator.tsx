import { useEffect, useState } from 'react';

export default function ScrollProgressIndicator() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  // Only show on devices with fine pointer and hover capability
  const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const isHoverCapable = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  if (!isFinePointer || !isHoverCapable) return null;

  return (
    <div
      className="fixed top-0 left-0 h-0.5 w-full bg-accent/70 origin-left transform scale-x-0 transition-transform duration-200"
      style={{ transformOrigin: 'left', transform: `scaleX(${scrollProgress / 100})` }}
    ></div>
  );
}