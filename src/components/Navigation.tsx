import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useContent } from '../lib/useContent';
import Logo from './Logo';

interface NavLinkItem {
  href: string;
  label: string;
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { getContentValue } = useContent();

  const navLinks: NavLinkItem[] = [
    { label: getContentValue('nav', 'link_1', 'Work'), href: getContentValue('nav', 'link_1_href', '/work') },
    { label: getContentValue('nav', 'link_2', 'Services'), href: getContentValue('nav', 'link_2_href', '/services') },
    { label: getContentValue('nav', 'link_3', 'Process'), href: getContentValue('nav', 'link_3_href', '/process') },
    { label: getContentValue('nav', 'link_5', 'Pricing'), href: getContentValue('nav', 'link_5_href', '/pricing') },
    { label: getContentValue('nav', 'link_6', 'Contact'), href: getContentValue('nav', 'link_6_href', '/contact') },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 60);
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 h-[68px] md:h-[72px] flex items-center"
        style={{
          background: scrolled ? 'rgba(6, 6, 12, 0.88)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(124,111,247,0.08)' : '1px solid transparent',
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        }}
      >
        <div className="w-full max-w-[1320px] mx-auto px-5 md:px-6 flex items-center justify-between gap-4">
          <Logo size="md" />

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-[13px] transition-colors duration-200 ${
                    isActive
                      ? 'text-text-primary bg-[rgba(124,111,247,0.08)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.03)]'
                  }`
                }
                style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full bg-accent"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden text-text-primary p-2 rounded-xl hover:bg-[rgba(255,255,255,0.03)] transition-colors"
            onClick={() => setMobileOpen((current) => !current)}
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: 'rgba(6, 6, 12, 0.97)' }}
          >
            <div className="h-[68px] shrink-0" />
            <div className="flex-1 overflow-y-auto flex flex-col items-start justify-center px-6 sm:px-8 py-8 gap-2.5" role="dialog" aria-modal="true">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.03 * index, duration: 0.3 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `text-[clamp(30px,10vw,40px)] font-[800] leading-[1.14] transition-colors block py-1 ${
                        isActive ? 'gradient-text' : 'text-text-primary'
                      }`
                    }
                    style={{ fontFamily: 'Syne' }}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
