import { memo } from 'react';
import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

export type FloatingDockItem = {
  title: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

function DockLink({ item }: { item: FloatingDockItem }) {
  const content = (
    <>
      <span className="relative z-10 flex h-9 w-9 items-center justify-center transition-transform duration-200 group-hover:scale-[1.05]">
        {item.icon}
      </span>
      <span
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '9px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-accent)',
          background: 'rgba(4,4,8,0.92)',
          border: '1px solid rgba(108,99,255,0.2)',
          padding: '3px 8px',
          borderRadius: '2px',
        }}
        role="tooltip"
      >
        {item.title}
      </span>
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-center p-1 transition-colors duration-200"
        style={{ color: '#55556A' }}
        aria-label={item.title}
        title={item.title}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#55556A'; }}
      >
        {content}
      </a>
    );
  }

  return (
    <NavLink
      to={item.href}
      aria-label={item.title}
      title={item.title}
      className={({ isActive }) =>
        `group relative flex items-center justify-center p-1 transition-colors duration-200 ${
          isActive ? 'text-[var(--color-accent)]' : 'text-[#55556A] hover:text-[var(--color-accent)]'
        }`
      }
    >
      {content}
    </NavLink>
  );
}

function FloatingDockImpl({ items, className }: { items: FloatingDockItem[]; className?: string }) {
  return (
    <div
      className={`relative inline-flex items-center gap-1 px-2 py-1.5 ${className || ''}`}
      style={{
        background: 'rgba(4,4,8,0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(108,99,255,0.1)',
        borderRadius: '2px',
      }}
    >
      {items.map((item) => (
        <DockLink key={`${item.title}-${item.href}`} item={item} />
      ))}
    </div>
  );
}

const FloatingDock = memo(FloatingDockImpl);
export default FloatingDock;
