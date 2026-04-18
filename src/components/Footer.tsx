import { Link } from 'react-router-dom';
import { useContent } from '../lib/ContentContext';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from './Logo';

const ease: [number,number,number,number] = [0.16, 0.77, 0.47, 0.97];

export default function Footer() {
  const { c } = useContent();
  const pageLinks = [
    { label: 'Home', href: '/' },
    { label: c('nav', 'link_1', 'Work'), href: c('nav', 'link_1_href', '/work') },
    { label: c('nav', 'link_2', 'Services'), href: c('nav', 'link_2_href', '/services') },
    { label: c('nav', 'link_3', 'Process'), href: c('nav', 'link_3_href', '/process') },
    { label: c('nav', 'link_5', 'Pricing'), href: c('nav', 'link_5_href', '/pricing') },
    { label: c('nav', 'link_6', 'Contact'), href: c('nav', 'link_6_href', '/contact') },
  ];
  const serviceLinks = [
    c('services', 'card_1_title', 'Websites'),
    c('services', 'card_2_title', 'Web Apps'),
    c('services', 'card_3_title', 'E-commerce'),
    c('services', 'card_4_title', 'Maintenance'),
  ];
  const connectLinks = [
    { label: 'LinkedIn', href: '#' },
    { label: 'Instagram', href: '#' },
    { label: 'GitHub', href: '#' },
    { label: c('contact', 'email', 'vaaddevelopment@gmail.com'), href: `mailto:${c('contact', 'email', 'vaaddevelopment@gmail.com')}` },
  ];

  const columns = [
    { title: 'Pages', items: pageLinks },
    { title: 'Services', items: serviceLinks.map(l => ({ label: l, href: '/services' })) },
    { title: 'Connect', items: connectLinks },
  ];

  return (
    <footer className="relative" style={{ background: '#020205', borderTop: '1px solid rgba(108,99,255,0.08)' }}>

      {/* CTA band */}
      <div className="relative overflow-hidden">
        {/* Background electric mesh */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, var(--color-accent-glow), transparent 60%)' }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(108,99,255,0.3) 40%, rgba(108,99,255,0.3) 60%, transparent)' }} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease }}
          className="max-w-[1440px] mx-auto px-6 md:px-10 py-20 md:py-28 relative z-10"
        >
          {/* Catalog label */}
          <p className="mb-6" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-accent)', opacity: 0.5 }}>
            — Begin a project
          </p>

          <h2
            className="text-text-primary mb-5"
            style={{
              fontFamily: 'Bebas Neue',
              fontSize: 'clamp(56px, 9vw, 120px)',
              letterSpacing: '0.03em',
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}
          >
            {c('footer', 'cta_headline', 'Ready to')}{' '}
            <span style={{ color: 'var(--color-accent)' }}>
              {c('footer', 'cta_highlight', 'Build?')}
            </span>
          </h2>

          <p
            className="mb-10 max-w-[380px]"
            style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.7 }}
          >
            {c('footer', 'cta_sub', "Turn your idea into a live product — scoped, built, and shipped by a team that means it.")}
          </p>

          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-3 text-text-inverse font-medium transition-all duration-300"
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: 'var(--color-accent)',
              padding: '14px 28px',
              borderRadius: '2px',
              boxShadow: '0 0 40px var(--color-accent-glow)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 60px var(--color-accent-glow)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 40px var(--color-accent-glow)'; }}
          >
            Get In Touch <ArrowUpRight size={15} />
          </Link>
        </motion.div>
      </div>

      {/* Link columns */}
      <div
        className="max-w-[1440px] mx-auto px-6 md:px-10 pt-14 pb-10 relative"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 mb-14">
          {/* Brand */}
          <div>
            <div className="mb-4"><Logo size="lg" /></div>
            <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#55556A', maxWidth: '240px', lineHeight: 1.7 }}>
              {c('footer', 'tagline', 'Building the web for businesses that mean it.')}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent)', boxShadow: '0 0 8px var(--color-accent-glow)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent)', opacity: 0.7 }}>
                Available for projects
              </span>
            </div>
          </div>

          {/* Link columns */}
          {columns.map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '20px' }}>
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3">
                {col.items.map(item => (
                  <li key={item.label}>
                    {('href' in item) && (item.href.startsWith('mailto:') || item.href === '#') ? (
                      <a
                        href={(item as { label: string; href: string }).href}
                        className="transition-colors duration-200 hover:text-accent"
                        style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0' }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={('href' in item) ? (item as { label: string; href: string }).href : '/'}
                        className="transition-colors duration-200 hover:text-accent"
                        style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0' }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '24px' }}
        >
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#55556A' }}>
            {c('footer', 'copyright', '© 2025 VAAD Development')}
          </span>
          <span style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#55556A' }}>
            {c('footer', 'made_by', 'Made by VAAD — obviously.')}
          </span>
        </div>
      </div>
    </footer>
  );
}
