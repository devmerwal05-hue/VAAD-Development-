import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useContent } from '../lib/useContent';
import Logo from './Logo';

interface NavLinkItem {
  href: string;
  label: string;
}

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const { getContentValue } = useContent();
  const lastScrollY = useRef(0);

  const navLinks: NavLinkItem[] = [
    { label: getContentValue('nav', 'link_1', 'Work'), href: getContentValue('nav', 'link_1_href', '/work') },
    { label: getContentValue('nav', 'link_2', 'Services'), href: getContentValue('nav', 'link_2_href', '/services') },
    { label: getContentValue('nav', 'link_3', 'Process'), href: getContentValue('nav', 'link_3_href', '/process') },
    { label: getContentValue('nav', 'link_5', 'Pricing'), href: getContentValue('nav', 'link_5_href', '/pricing') },
    { label: getContentValue('nav', 'link_6', 'Contact'), href: getContentValue('nav', 'link_6_href', '/contact') },
  ];

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  useEffect(() => {
    let frame = 0;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY < 72;
      const scrollingUp = currentScrollY < lastScrollY.current;

      setNavVisible(menuOpen || (!atTop && scrollingUp));
      lastScrollY.current = currentScrollY;
      frame = 0;
    };

    updateVisibility();

    const handleScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        aria-label="Primary"
        animate={{ opacity: navVisible ? 1 : 0, y: navVisible ? 0 : -32 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed left-0 right-0 top-0 z-50 pt-4"
      >
        <div className="pointer-events-auto mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 md:px-10">
          <div className="flex h-[64px] w-full items-center justify-between gap-4 rounded-full border border-[rgba(232,232,240,0.08)] bg-[rgba(4,4,8,0.82)] px-4 shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            <Logo size="md" />

            <div className="ml-auto flex items-center gap-2">
              <NavLink
                to="/contact"
                className="hidden items-center gap-2 rounded-full border border-[rgba(0,212,255,0.18)] bg-[rgba(0,212,255,0.1)] px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-transform duration-300 hover:-translate-y-0.5 md:inline-flex"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                data-cursor-label="send"
              >
                {getContentValue('nav', 'cta', 'Start a project')}
                <ArrowUpRight size={14} />
              </NavLink>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,232,240,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-[11px] uppercase tracking-[0.24em] text-text-primary transition-colors hover:border-[rgba(0,212,255,0.2)] hover:text-[rgba(0,212,255,0.92)]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
                onClick={() => setMenuOpen((current) => !current)}
                aria-controls="site-navigation-panel"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                data-cursor-label={menuOpen ? 'close' : 'menu'}
              >
                <span className="hidden sm:inline">{menuOpen ? 'Close' : 'Menu'}</span>
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="site-navigation-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(4,4,8,0.94)', backdropFilter: 'blur(28px)' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(124,111,247,0.18),transparent_20%),radial-gradient(circle_at_82%_26%,rgba(0,212,255,0.14),transparent_18%)]" />
            <div
              role="dialog"
              aria-modal="true"
              className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-6 pb-10 pt-24 md:px-10"
            >
              <div className="flex items-center justify-between">
                <Logo size="md" />
                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,232,240,0.1)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 text-[11px] uppercase tracking-[0.24em] text-text-primary"
                  style={{ fontFamily: 'JetBrains Mono, monospace' }}
                >
                  Close
                  <X size={16} />
                </button>
              </div>

              <div className="mt-12 flex flex-1 flex-col justify-between gap-10 lg:flex-row lg:items-end">
                <div className="max-w-[760px]">
                  <p
                    className="text-[11px] uppercase tracking-[0.34em] text-[rgba(0,212,255,0.72)]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    Navigation
                  </p>
                  <div className="mt-8 space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.04 * index, duration: 0.3 }}
                      >
                        <NavLink
                          to={link.href}
                          onClick={closeMenu}
                          className={({ isActive }) => (
                            `group flex items-center justify-between gap-4 border-b border-[rgba(232,232,240,0.08)] py-4 text-[clamp(2.8rem,7vw,5.8rem)] uppercase tracking-[-0.05em] transition-colors ${
                              isActive ? 'text-[rgba(0,212,255,0.92)]' : 'text-text-primary hover:text-[rgba(0,212,255,0.92)]'
                            }`
                          )}
                          style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}
                          data-cursor-label="view"
                        >
                          <span>{link.label}</span>
                          <span
                            className="hidden text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.42)] md:inline-flex"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </NavLink>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="max-w-[360px] rounded-[32px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.04)] p-6">
                  <p
                    className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.72)]"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    One clear next step
                  </p>
                  <p className="mt-4 text-[15px] leading-[1.85] text-text-secondary">
                    {getContentValue('nav', 'menu_copy', 'If the project has a real deadline, send the scope and we will tell you what belongs in the first release.')}
                  </p>
                  <NavLink
                    to="/contact"
                    onClick={closeMenu}
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,212,255,0.18)] bg-[rgba(0,212,255,0.12)] px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-text-primary transition-transform duration-300 hover:-translate-y-0.5"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    data-cursor-label="send"
                  >
                    {getContentValue('nav', 'cta', 'Start a project')}
                    <ArrowUpRight size={14} />
                  </NavLink>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
