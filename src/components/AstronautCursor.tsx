import { useEffect, useRef, useState } from 'react';

interface CursorPosition {
  x: number;
  y: number;
}

export default function AstronautCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef<CursorPosition>({ x: -1000, y: -1000 });
  const currentPos = useRef<CursorPosition>({ x: -1000, y: -1000 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Use CSS media query - more accurate than JS detection
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mediaQuery.matches);
    
    if (mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX - 14, y: e.clientY - 16 };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea');
      setIsHovering(Boolean(isInteractive));
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isVisible]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (mediaQuery.matches) return;

    const animate = () => {
      const dx = targetPos.current.x - currentPos.current.x;
      const dy = targetPos.current.y - currentPos.current.y;
      
      currentPos.current.x += dx * 0.12;
      currentPos.current.y += dy * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  if (isTouch) return null;

  return (
    <div
      ref={cursorRef}
      className={`astronaut-cursor ${isHovering ? 'hovering' : ''}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <svg
        width="28"
        height="32"
        viewBox="0 0 28 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="astronaut-svg"
      >
        <defs>
          <linearGradient id="helmet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E8EC" />
            <stop offset="100%" stopColor="#B8B8C4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Backpack */}
        <rect x="2" y="12" width="6" height="14" rx="2" fill="url(#helmet-gradient)" opacity="0.6" />
        
        {/* Body */}
        <ellipse cx="14" cy="22" rx="8" ry="9" fill="url(#helmet-gradient)" opacity="0.85" />
        
        {/* Helmet */}
        <circle cx="14" cy="10" r="9" fill="url(#helmet-gradient)" />
        
        {/* Visor */}
        <ellipse cx="15" cy="10" rx="6" ry="5" fill="#1a1a2e" />
        <ellipse cx="15" cy="10" rx="6" ry="5" fill="url(#helmet-gradient)" opacity="0.15" />
        
        {/* Visor shine */}
        <ellipse cx="12.5" cy="8" rx="2" ry="1.5" fill="white" opacity="0.4" />
        
        {/* Antenna */}
        <line x1="22" y1="6" x2="24" y2="2" stroke="#B8B8C4" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="2" r="1.5" fill="#00B4FF" filter="url(#glow)" />
      </svg>
      
      <div className="cursor-ring" />
    </div>
  );
}