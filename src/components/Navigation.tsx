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
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center"
        style={{
          background: scrolled ? 'rgba(4,4,8,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,180,255,0.1)' : '1px solid transparent',
          transition: 'background 0.35s, border-color 0.35s, backdrop-filter 0.35s',
        }}
      >
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between gap-4">
          <Logo size="md" />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-[12px] uppercase tracking-[0.12em] transition-colors duration-200 ${
                    isActive
                      ? 'text-[#00B4FF]'
                      : 'text-[#55556A] hover:text-[#F0EDE6]'
                  }`
                }
                style={{ fontFamily: 'JetBrains Mono', fontWeight: 400 }}
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px]"
                        style={{ background: '#00B4FF' }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* CTA */}
          <NavLink
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 shimmer-btn"
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#040408',
              background: '#00B4FF',
              padding: '8px 18px',
              borderRadius: '2px',
            }}
          >
            Get a Quote
          </NavLink>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-text-primary p-2 rounded-sm transition-colors"
            style={{ background: mobileOpen ? 'rgba(0,180,255,0.1)' : 'transparent' }}
            onClick={() => setMobileOpen((current) => !current)}
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.16, 0.77, 0.47, 0.97] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: 'rgba(4,4,8,0.98)', backdropFilter: 'blur(24px)' }}
          >
            {/* Top rule */}
            <div className="h-[64px] shrink-0 border-b border-[rgba(0,180,255,0.1)]" />
            <div
              className="flex-1 overflow-y-auto flex flex-col items-start justify-center px-8 py-8 gap-1"
              role="dialog"
              aria-modal="true"
            >
              {/* Section label */}
              <p style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.45)', marginBottom: '24px' }}>
                — Navigation
              </p>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * index, duration: 0.3 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `block py-3 transition-colors ${
                        isActive ? 'text-[#00B4FF]' : 'text-[#F0EDE6] hover:text-[#00B4FF]'
                      }`
                    }
                    style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(36px,12vw,56px)', letterSpacing: '0.04em' }}
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <div className="mt-8 h-px w-12" style={{ background: 'rgba(0,180,255,0.3)' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
