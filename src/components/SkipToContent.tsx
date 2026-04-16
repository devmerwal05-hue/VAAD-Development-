import { useEffect, useState } from 'react';

export default function SkipToContent() {
  const [focused, setFocused] = useState(false);
  
  useEffect(() => {
    const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;
    
    const handleFocus = () => setFocused(true);
    const handleBlur = () => setFocused(false);
    
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
  
  const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  if (!isFinePointer) return null;
  
  return (
    <a
      href="#main-content"
      className="fixed top-0 left-0 z-[99999] px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-200"
      style={{
        background: focused ? '#00B4FF' : 'rgba(0,180,255,0.9)',
        color: '#040408',
        transform: focused ? 'translateY(0)' : 'translateY(-100%)',
        opacity: focused ? 1 : 0,
        pointerEvents: focused ? 'auto' : 'none',
      }}
    >
      Skip to main content
    </a>
  );
}