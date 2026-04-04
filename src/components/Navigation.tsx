import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useContent } from '../lib/useContent';

interface NavLinkItem { href: string; label: string; }

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
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
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { setScrolled(window.scrollY > 48); ticking = false; });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 h-[64px] flex items-center"
        style={{
          background: scrolled ? 'rgba(6, 12, 32, 0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(232, 19, 42, 0.12)' : '1px solid transparent',
          transition: 'background 0.4s, border-color 0.4s',
        }}
      >
        <div className="flex w-full items-center justify-between gap-4 px-6 md:px-8">

          {/* Logo */}
          <NavLink to="/" className="group flex items-center gap-2" aria-label="VAAD Development home">
            <div className="flex items-center gap-1">
              <span
                className="text-[20px] text-[#EAE6DB] tracking-[0.12em]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: '0.14em' }}
              >
                VAAD
              </span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block', marginBottom: 1 }} />
            </div>
            <span
              className="hidden border-l border-[rgba(232,19,42,0.3)] pl-2 text-[9px] uppercase tracking-[0.28em] sm:block"
              style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(234,230,219,0.35)', marginTop: 1 }}
            >
              Dev
            </span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `relative border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-200 ${
                    isActive
                      ? 'text-[#EAE6DB] border-[rgba(232,19,42,0.45)] bg-[rgba(232,19,42,0.12)]'
                      : 'text-[rgba(234,230,219,0.52)] border-[rgba(232,19,42,0.15)] hover:text-[#EAE6DB] hover:border-[rgba(232,19,42,0.42)] hover:bg-[rgba(232,19,42,0.06)]'
                  }`
                }
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500 }}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Contact CTA */}
          <NavLink
            to="/contact"
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-[rgba(232,19,42,0.35)] text-[11px] tracking-[0.18em] uppercase text-[rgba(234,230,219,0.7)] hover:text-[#EAE6DB] hover:border-[rgba(232,19,42,0.7)] transition-all duration-300"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 500 }}
          >
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
            Start Project
          </NavLink>

          {/* Hamburger */}
          <button
            type="button"
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMobileOpen((s) => !s)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span
              className="block h-[1px] bg-[#EAE6DB] transition-all duration-300"
              style={{ width: 22, transformOrigin: 'left', transform: mobileOpen ? 'rotate(45deg) translateY(-1px)' : 'none' }}
            />
            <span
              className="block h-[1px] bg-[#EAE6DB] transition-all duration-300"
              style={{ width: 16, opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block h-[1px] bg-[#EAE6DB] transition-all duration-300"
              style={{ width: 22, transformOrigin: 'left', transform: mobileOpen ? 'rotate(-45deg) translateY(1px)' : 'none' }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.4, ease: [0.16, 0.77, 0.47, 0.97] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{ background: '#060C20' }}
            role="dialog"
            aria-modal="true"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

            <div className="h-[64px] shrink-0 border-b border-[rgba(232,19,42,0.12)]" />

            <div className="flex-1 flex flex-col justify-center px-8 gap-1">
              {/* Annotation */}
              <p className="annotation-label mb-8">Navigation / Menu</p>

              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.35 }}
                >
                  <NavLink
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center gap-4 border-b border-[rgba(232,19,42,0.08)] py-4 ${
                        isActive ? 'text-[#EAE6DB]' : 'text-[rgba(234,230,219,0.5)]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className="text-[9px] tracking-[0.2em] w-6 shrink-0"
                          style={{ fontFamily: "'JetBrains Mono', monospace", color: isActive ? '#E8132A' : 'rgba(234,230,219,0.25)' }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className="text-[40px] leading-none group-hover:text-[#EAE6DB] transition-colors"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: '-0.03em' }}
                        >
                          {link.label}
                        </span>
                        {isActive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block', marginLeft: 'auto' }} />}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <div className="px-8 py-6 border-t border-[rgba(232,19,42,0.1)]">
              <p className="annotation-label">vaad-development.vercel.app</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
