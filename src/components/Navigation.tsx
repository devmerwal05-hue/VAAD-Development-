import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Archive, BarChart3, CircleUserRound, LayoutGrid, Menu, X } from 'lucide-react';
import { useContent } from '../lib/useContent';

interface NavLinkItem { href: string; label: string; }

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getContentValue } = useContent();

  const navLinks: NavLinkItem[] = [
    { label: getContentValue('nav', 'link_1', 'Work'),     href: getContentValue('nav', 'link_1_href', '/work') },
    { label: getContentValue('nav', 'link_2', 'Services'), href: getContentValue('nav', 'link_2_href', '/services') },
    { label: getContentValue('nav', 'link_3', 'Process'),  href: getContentValue('nav', 'link_3_href', '/process') },
    { label: getContentValue('nav', 'link_4', 'Team'),     href: getContentValue('nav', 'link_4_href', '/team') },
    { label: getContentValue('nav', 'link_5', 'Pricing'),  href: getContentValue('nav', 'link_5_href', '/pricing') },
    { label: getContentValue('nav', 'link_6', 'Contact'),  href: getContentValue('nav', 'link_6_href', '/contact') },
  ];

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const dockItems = [
    { href: '/', icon: LayoutGrid, label: getContentValue('nav', 'home_label', 'Home') },
    { href: '/work', icon: Archive, label: getContentValue('nav', 'link_1', 'Work') },
    { href: '/services', icon: BarChart3, label: getContentValue('nav', 'link_2', 'Services') },
    { href: '/contact', icon: CircleUserRound, label: getContentValue('nav', 'link_6', 'Contact') },
  ];

  return (
    <>
      <nav
        aria-label={getContentValue('nav', 'primary_aria_label', 'Primary navigation')}
        className="fixed left-0 right-0 top-0 z-50 h-[84px] border-b border-white/10 bg-black/80 backdrop-blur-xl"
      >
        <div className="relative mx-auto flex h-full w-full max-w-screen-xl items-center justify-between px-5 md:px-8">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-white/20 bg-black/50 text-[rgba(255,44,27,0.95)] md:hidden"
            onClick={() => setMobileOpen((s) => !s)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={
              mobileOpen
                ? getContentValue('nav', 'mobile_close_aria', 'Close navigation menu')
                : getContentValue('nav', 'mobile_open_aria', 'Open navigation menu')
            }
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          <NavLink
            to="/"
            className="absolute left-1/2 -translate-x-1/2 text-[#e8ecf8] md:static md:translate-x-0"
            aria-label={getContentValue('nav', 'home_aria_label', 'VAAD Development home')}
          >
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: 'clamp(24px, 3vw, 44px)',
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {getContentValue('nav', 'logo_text', 'VAAD')}
            </span>
          </NavLink>

          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `archive-tag border px-3 py-2 transition-all duration-200 ${
                    isActive
                      ? 'border-[rgba(255,44,27,0.75)] bg-[rgba(255,44,27,0.12)] text-[rgba(255,44,27,0.95)]'
                      : 'border-[rgba(126,164,224,0.24)] text-[rgba(158,182,219,0.75)] hover:border-[rgba(255,44,27,0.5)] hover:text-[rgba(236,242,255,0.95)]'
                  }`
                }
                style={{ minWidth: 88, textAlign: 'center' }}
              >
                {String(index + 1).padStart(2, '0')} {link.label}
              </NavLink>
            ))}
          </div>
          <div className="h-10 w-10 md:hidden" aria-hidden />
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: [0.16, 0.77, 0.47, 0.97] }}
            className="fixed inset-0 z-40 flex flex-col bg-black/95 pt-[84px]"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

            <div className="flex-1 px-6 py-8">
              <div className="archive-panel p-5">
                <p className="archive-tag mb-6">{getContentValue('nav', 'mobile_overlay_title', 'System Navigation')}</p>

                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * index, duration: 0.28 }}
                  >
                    <NavLink
                      to={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between border-b border-[rgba(120,158,220,0.22)] py-4 ${
                          isActive ? 'text-[#e8ecf8]' : 'text-[rgba(160,184,220,0.76)]'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="archive-tag" style={{ color: isActive ? 'rgba(255,44,27,0.95)' : 'rgba(122,151,200,0.9)' }}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span
                            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 30, fontStyle: 'italic', lineHeight: 1 }}
                          >
                            {link.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="px-6 pb-8">
              <p className="annotation-label" style={{ color: 'rgba(142,168,209,0.6)' }}>
                {getContentValue('nav', 'mobile_overlay_hint', 'swipe to navigate')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(126,164,224,0.24)] bg-[rgba(2,18,52,0.95)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-[480px] grid-cols-4 px-5 py-3">
          {dockItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `relative flex flex-col items-center gap-1 text-[rgba(130,156,197,0.85)] ${isActive ? 'text-[rgba(255,44,27,0.98)]' : ''}`
                }
                title={item.label}
                aria-label={item.label}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} />
                    <span className={`h-[2px] w-7 transition-opacity ${isActive ? 'bg-[rgba(255,44,27,0.98)] opacity-100' : 'bg-transparent opacity-0'}`} />
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </>
  );
}
