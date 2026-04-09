import { Link } from 'react-router-dom';
import { useContent } from '../lib/useContent';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkTo?: string;
}

const sizes = {
  sm: { fontSize: '18px' },
  md: { fontSize: '22px' },
  lg: { fontSize: '30px' },
};

export default function Logo({ size = 'md', className = '', linkTo = '/' }: LogoProps) {
  const { getContentValue } = useContent();
  const logoText = getContentValue('nav', 'logo_text', 'VAAD');
  const { fontSize } = sizes[size];

  const midpoint = Math.ceil(logoText.length / 2);
  const firstHalf = logoText.slice(0, midpoint);
  const secondHalf = logoText.slice(midpoint);

  const inner = (
    <span
      className={`flex items-center gap-0 select-none group ${className}`}
      style={{ fontFamily: 'Bebas Neue', letterSpacing: '0.06em', fontSize }}
    >
      <span
        className="transition-colors duration-300"
        style={{ color: '#F0EDE6' }}
        onMouseEnter={e => { (e.currentTarget.closest('a') as HTMLElement | null)?.querySelectorAll('span').forEach(s => { if (s.tagName !== 'SPAN' || !s.style.background) s.style.color = '#00B4FF'; }); }}
      >
        {firstHalf}
      </span>
      {/* Separator dot */}
      <span
        className="inline-block mx-[3px] shrink-0"
        style={{
          width: size === 'lg' ? '7px' : size === 'md' ? '5px' : '4px',
          height: size === 'lg' ? '7px' : size === 'md' ? '5px' : '4px',
          background: '#00B4FF',
          borderRadius: '50%',
          boxShadow: '0 0 8px rgba(0,180,255,0.7)',
          marginTop: '2px',
          flexShrink: 0,
        }}
      />
      <span
        className="transition-colors duration-300"
        style={{ color: '#F0EDE6' }}
      >
        {secondHalf}
      </span>
    </span>
  );

  return linkTo ? (
    <Link
      to={linkTo}
      className="group hover:opacity-90 transition-opacity duration-200"
    >
      {inner}
    </Link>
  ) : inner;
}
