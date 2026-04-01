import { Link } from 'react-router-dom';
import { useContent } from '../lib/useContent';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  linkTo?: string;
}

const sizes = {
  sm: { text: 'text-[20px]', diamond: 'w-[5px] h-[5px]' },
  md: { text: 'text-[24px]', diamond: 'w-[6px] h-[6px]' },
  lg: { text: 'text-[34px]', diamond: 'w-[8px] h-[8px]' },
};

export default function Logo({ size = 'md', className = '', linkTo = '/' }: LogoProps) {
  const { getContentValue } = useContent();
  const logoText = getContentValue('nav', 'logo_text', 'VAAD');
  const sizeConfig = sizes[size];

  const midpoint = Math.ceil(logoText.length / 2);
  const firstHalf = logoText.slice(0, midpoint);
  const secondHalf = logoText.slice(midpoint);

  const inner = (
    <span className={`flex items-center gap-0 select-none group ${className}`}>
      <span className={`font-[800] ${sizeConfig.text} text-white tracking-tight group-hover:text-accent transition-colors duration-300`} style={{ fontFamily: 'Syne' }}>
        {firstHalf}
      </span>
      <span className={`${sizeConfig.diamond} bg-accent rotate-45 mx-[2px] mt-[2px] inline-block group-hover:scale-125 group-hover:rotate-[225deg] transition-all duration-500`} />
      <span className={`font-[800] ${sizeConfig.text} text-white tracking-tight group-hover:text-accent transition-colors duration-300`} style={{ fontFamily: 'Syne' }}>
        {secondHalf}
      </span>
    </span>
  );

  return linkTo ? <Link to={linkTo}>{inner}</Link> : inner;
}
