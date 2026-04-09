import { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../lib/useContent';
import Logo from './Logo';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

interface FooterItem {
  href?: string;
  label: string;
}

interface FooterColumn {
  items: FooterItem[];
  title: string;
}

export default function Footer() {
  const { getContentValue } = useContent();
  const contactEmail = getContentValue('contact', 'email', 'hello@vaad.dev');

  const legacyFooterCopyMap = useMemo(() => {
    return new Map<string, string>([
      ['Need a site or app that can ship fast?', 'Ready to build?'],
      [
        'Share the scope, timeline, and blockers. We will reply with a clear build path instead of a vague pitch deck.',
        "Let's turn your idea into a live product.",
      ],
      ['Start a project', 'Get In Touch'],
      [
        'VAAD Development builds launch-ready websites and internal tools for small teams that need clarity, speed, and a maintainable handoff.',
        'Building the web for businesses that mean it.',
      ],
      ['Built for teams that want fewer meetings and stronger execution.', 'Made by VAAD — obviously.'],
    ]);
  }, []);

  const normalizeLegacyFooterCopy = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      return legacyFooterCopyMap.get(trimmed) ?? value;
    },
    [legacyFooterCopyMap]
  );

  const ctaTitle = normalizeLegacyFooterCopy(
    getContentValue('footer', 'cta_title', 'Ready to build?')
  );
  const ctaHighlight = getContentValue('footer', 'cta_title_highlight', 'build?');

  const renderCtaTitle = () => {
    const title = ctaTitle.trim();
    const highlight = ctaHighlight.trim();

    if (highlight.length > 0) {
      const idx = title.toLowerCase().indexOf(highlight.toLowerCase());
      if (idx >= 0) {
        const before = title.slice(0, idx);
        const mid = title.slice(idx, idx + highlight.length);
        const after = title.slice(idx + highlight.length);
        return (
          <>
            {before}
            <span className="gradient-text">{mid}</span>
            {after}
          </>
        );
      }
    }

    const parts = title.split(' ');
    if (parts.length <= 1) return <span className="gradient-text">{title}</span>;
    const last = parts.pop();
    return (
      <>
        {parts.join(' ')}{' '}
        <span className="gradient-text">{last}</span>
      </>
    );
  };

  const pageLinks = [
    { label: 'Home', href: '/' },
    { label: getContentValue('nav', 'link_1', 'Work'), href: getContentValue('nav', 'link_1_href', '/work') },
    { label: getContentValue('nav', 'link_2', 'Services'), href: getContentValue('nav', 'link_2_href', '/services') },
    { label: getContentValue('nav', 'link_3', 'Process'), href: getContentValue('nav', 'link_3_href', '/process') },
    { label: getContentValue('nav', 'link_5', 'Pricing'), href: getContentValue('nav', 'link_5_href', '/pricing') },
    { label: getContentValue('nav', 'link_6', 'Contact'), href: getContentValue('nav', 'link_6_href', '/contact') },
  ];

  const serviceLinks = [
    getContentValue('services', 'card_1_title', 'Websites'),
    getContentValue('services', 'card_2_title', 'Web Apps'),
    getContentValue('services', 'card_3_title', 'E-commerce'),
    getContentValue('services', 'card_4_title', 'Maintenance'),
  ];

  const connectLinks = [
    {
      label: getContentValue('footer', 'connect_1_label', 'LinkedIn'),
      href: getContentValue('footer', 'connect_1_href', '#'),
    },
    {
      label: getContentValue('footer', 'connect_2_label', 'Instagram'),
      href: getContentValue('footer', 'connect_2_href', '#'),
    },
    {
      label: getContentValue('footer', 'connect_3_label', 'GitHub'),
      href: getContentValue('footer', 'connect_3_href', '#'),
    },
    { label: contactEmail, href: `mailto:${contactEmail}` },
  ];

  const columns: FooterColumn[] = [
    {
      title: getContentValue('footer', 'pages_title', 'Pages'),
      items: pageLinks,
    },
    {
      title: getContentValue('footer', 'services_title', 'Services'),
      items: serviceLinks.map((label) => ({ label, href: '/services' })),
    },
    {
      title: getContentValue('footer', 'model_title', 'Working Model'),
      items: [
        { label: getContentValue('footer', 'model_1', 'Discovery and scope in 24 hours') },
        { label: getContentValue('footer', 'model_2', 'Design and build handled by one team') },
        { label: getContentValue('footer', 'model_3', 'CMS handoff and launch support included') },
        { label: getContentValue('footer', 'model_4', 'Async-friendly collaboration for remote clients') },
      ],
    },
    {
      title: getContentValue('footer', 'connect_title', 'Connect'),
      items: connectLinks,
    },
  ];

  return (
    <footer className="bg-footer-bg pt-0 pb-8 relative">
      <div className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(124,111,247,0.08)' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(124,111,247,0.06), transparent 60%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
          className="max-w-[1320px] mx-auto px-5 md:px-6 py-16 md:py-20 text-center relative z-10"
        >
          <h2
            className="text-[clamp(32px,6vw,60px)] text-text-primary mb-4"
            style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.02em' }}
          >
            {renderCtaTitle()}
          </h2>
          <p
            className="text-[15px] md:text-[16px] text-text-secondary mb-8 max-w-[400px] mx-auto"
            style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
          >
            {normalizeLegacyFooterCopy(
              getContentValue(
                'footer',
                'cta_description',
                "Let's turn your idea into a live product."
              )
            )}
          </p>
          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2.5 gradient-bg text-white px-8 py-4 rounded-2xl text-[15px] font-medium shadow-[0_4px_40px_rgba(124,111,247,0.3)] hover:shadow-[0_4px_60px_rgba(124,111,247,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
          >
            {normalizeLegacyFooterCopy(getContentValue('footer', 'cta_button', 'Get In Touch'))}
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>

      <div
        className="max-w-[1320px] mx-auto px-5 md:px-6 relative pt-12 md:pt-14"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="mb-12 md:mb-14">
          <div className="mb-3">
            <Logo size="lg" />
          </div>
          <p
            className="text-[14px] text-text-tertiary max-w-[320px]"
            style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
          >
            {normalizeLegacyFooterCopy(
              getContentValue('footer', 'tagline', 'Building the web for businesses that mean it.')
            )}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-14">
          {columns.map((column) => (
            <div key={column.title}>
              <h4
                className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary mb-4"
                style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
              >
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    {item.href?.startsWith('mailto:') || item.href === '#' ? (
                      <a
                        href={item.href}
                        className="text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200"
                        style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
                      >
                        {item.label}
                      </a>
                    ) : item.href && item.href.startsWith('/') ? (
                      <Link
                        to={item.href}
                        className="text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200"
                        style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
                      >
                        {item.label}
                      </Link>
                    ) : item.href ? (
                      <a
                        href={item.href}
                        className="text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200"
                        style={{ fontFamily: 'DM Sans', fontWeight: 300 }}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className="text-[14px] text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span className="text-[12px] text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {getContentValue('footer', 'copyright', 'Copyright 2026 VAAD Development. All rights reserved.')}
          </span>
          <span className="text-[12px] text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {normalizeLegacyFooterCopy(
              getContentValue('footer', 'made_by', 'Made by VAAD — obviously.')
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}
