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
      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-200 motion-reduce:transition-none group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
        {item.icon}
      </span>
      <span
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-surface-1 px-2.5 py-1 text-[11px] tracking-[0.12em] uppercase text-text-primary opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
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
        className="group relative flex items-center justify-center rounded-2xl p-1 text-text-secondary transition-colors duration-200 motion-reduce:transition-none hover:text-text-primary focus-visible:text-text-primary"
        aria-label={item.title}
        title={item.title}
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
        `group relative flex items-center justify-center rounded-2xl p-1 transition-colors duration-200 motion-reduce:transition-none ${
          isActive
            ? 'text-text-primary bg-accent/10'
            : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
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
      className={
        `relative inline-flex items-center gap-1 rounded-full border border-white/10 bg-surface-1/70 px-2 py-1 backdrop-blur ${className || ''}`
      }
      style={{ WebkitBackdropFilter: 'blur(18px)' }}
    >
      {items.map((item) => (
        <DockLink key={`${item.title}-${item.href}`} item={item} />
      ))}
    </div>
  );
}

const FloatingDock = memo(FloatingDockImpl);
export default FloatingDock;
