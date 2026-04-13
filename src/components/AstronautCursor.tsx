import { useEffect, useRef, useState } from 'react';

export default function AstronautCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('[Cursor] Component mounted');

    let mouseX = -100;
    let mouseY = -100;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    document.addEventListener('mousemove', handleMouseMove);

    let prevTime = performance.now();
    
    const animate = (time: number) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouseX - 16}px, ${mouseY - 18}px)`;
        cursorRef.current.style.opacity = '1';
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '32px',
        height: '36px',
        pointerEvents: 'none',
        zIndex: 99999,
        opacity: 0,
        transition: 'opacity 0.2s',
      }}
    >
      <svg
        width="32"
        height="36"
        viewBox="0 0 32 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="16" cy="12" r="10" fill="#E8E8EC" />
        <rect x="4" y="14" width="6" height="16" rx="2" fill="#B8B8C4" opacity="0.6" />
        <ellipse cx="16" cy="26" rx="10" ry="10" fill="#D0D0D8" />
        <ellipse cx="17" cy="12" rx="7" ry="5" fill="#1a1a2e" />
        <line x1="24" y1="8" x2="26" y2="4" stroke="#B8B8C4" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="26" cy="4" r="2" fill="#00B4FF" />
      </svg>
    </div>
  );
}