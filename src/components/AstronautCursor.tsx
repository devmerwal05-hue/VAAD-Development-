import { useEffect, useRef } from 'react';

export default function AstronautCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const updateCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener('mousemove', updateCursor);
    return () => document.removeEventListener('mousemove', updateCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        left: '-20px',
        top: '-20px',
        width: '40px',
        height: '44px',
        zIndex: 999999,
        pointerEvents: 'none',
      }}
    >
      <svg
        width="40"
        height="44"
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Backpack */}
        <rect x="4" y="14" width="8" height="18" rx="3" fill="#D0D0D8" opacity="0.7"/>
        
        {/* Body */}
        <ellipse cx="20" cy="28" rx="12" ry="12" fill="#E0E0E8"/>
        
        {/* Helmet */}
        <circle cx="20" cy="12" r="12" fill="#E8E8EC"/>
        
        {/* Visor */}
        <ellipse cx="21" cy="12" rx="8" ry="6" fill="#1a1a2e"/>
        
        {/* Visor shine */}
        <ellipse cx="18" cy="10" rx="2.5" ry="2" fill="white" opacity="0.5"/>
        
        {/* Antenna */}
        <line x1="30" y1="6" x2="33" y2="2" stroke="#B0B0B8" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="33" cy="2" r="2.5" fill="#00B4FF"/>
        
        {/* Glow effect on antenna */}
        <circle cx="33" cy="2" r="4" fill="#00B4FF" opacity="0.3"/>
      </svg>
    </div>
  );
}