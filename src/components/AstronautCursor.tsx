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
        left: '-100px',
        top: '-100px',
        width: '40px',
        height: '40px',
        zIndex: 999999,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        background: 'red',
        boxShadow: '0 0 10px red'
      }} />
    </div>
  );
}