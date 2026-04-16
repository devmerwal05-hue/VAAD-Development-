import { useEffect, useRef } from 'react';

interface StaggeredTextProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export default function StaggeredText({ 
  text, 
  className = '',
  delay = 0,
  staggerDelay = 50 
}: StaggeredTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const letters = element.querySelectorAll('.stagger-letter');
    letters.forEach((letter) => {
      (letter as HTMLElement).style.opacity = '0';
      (letter as HTMLElement).style.transform = 'translateY(20px)';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            letters.forEach((letter, idx) => {
              setTimeout(() => {
                (letter as HTMLElement).style.opacity = '1';
                (letter as HTMLElement).style.transform = 'translateY(0)';
              }, delay + idx * staggerDelay);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay, staggerDelay]);

  const renderLetter = (char: string, index: number) => {
    if (char === ' ') {
      return <span key={index} className="stagger-letter" style={{ width: '0.35em' }}>&nbsp;</span>;
    }
    return (
      <span
        key={index}
        className="stagger-letter"
        style={{
          display: 'inline-block',
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      >
        {char}
      </span>
    );
  };

  return (
    <span ref={elementRef} className={className}>
      {text.split('').map((char, index) => renderLetter(char, index))}
    </span>
  );
}