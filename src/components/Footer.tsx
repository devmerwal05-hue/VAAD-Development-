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
    { label: c('nav', 'link_4', 'Team'), href: c('nav', 'link_4_href', '/team') },
    { label: c('nav', 'link_5', 'Pricing'), href: c('nav', 'link_5_href', '/pricing') },
    { label: c('nav', 'link_6', 'Contact'), href: c('nav', 'link_6_href', '/contact') },
  ];
  const serviceLinks = [c('services', 'card_1_title', 'Websites'), c('services', 'card_2_title', 'Web Apps'), c('services', 'card_3_title', 'E-commerce'), c('services', 'card_4_title', 'Maintenance')];
  const teamLinks = [c('team', 'member_1_name', ''), c('team', 'member_2_name', ''), c('team', 'member_3_name', ''), c('team', 'member_4_name', '')];
  const connectLinks = ['LinkedIn', 'Instagram', 'GitHub', c('contact', 'email', 'vaaddevelopment@gmail.com')];
  const columns = [
    { title: 'Pages', items: pageLinks.map(l => ({ label: l.label, href: l.href })) },
    { title: 'Services', items: serviceLinks.map(l => ({ label: l, href: '/services' })) },
    { title: 'Team', items: teamLinks.map(l => ({ label: l, href: '/team' })) },
    { title: 'Connect', items: connectLinks.map(l => ({ label: l, href: l.includes('@') ? `mailto:${l}` : '#' })) },
  ];

  return (
    <footer className="bg-footer-bg pt-0 pb-8 relative">
      {/* CTA band */}
      <div className="relative overflow-hidden" style={{ borderTop: '1px solid rgba(124,111,247,0.08)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(124,111,247,0.06), transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease }}
          className="max-w-[1320px] mx-auto px-5 md:px-6 py-16 md:py-20 text-center relative z-10">
          <h2 className="text-[clamp(32px,6vw,60px)] text-text-primary mb-4" style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em' }}>Ready to <span className="gradient-text">build?</span></h2>
          <p className="text-[15px] md:text-[16px] text-text-secondary mb-8 max-w-[400px] mx-auto" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>Let's turn your idea into a live product.</p>
          <Link to="/contact" className="shimmer-btn inline-flex items-center gap-2.5 gradient-bg text-white px-8 py-4 rounded-2xl text-[15px] font-medium shadow-[0_4px_40px_rgba(124,111,247,0.3)] hover:shadow-[0_4px_60px_rgba(124,111,247,0.45)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>Get In Touch <ArrowUpRight size={16} /></Link>
        </motion.div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 md:px-6 relative pt-12 md:pt-14" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="mb-12 md:mb-14">
          <div className="mb-3"><Logo size="lg" /></div>
          <p className="text-[14px] text-text-tertiary max-w-[320px]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{c('footer', 'tagline', 'Building the web for businesses that mean it.')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-14">
          {columns.map(col => (
            <div key={col.title}>
              <h4 className="text-[11px] uppercase tracking-[0.12em] text-text-tertiary mb-4" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{col.title}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.items.map(item => (
                  <li key={item.label}>
                    {item.href.startsWith('mailto:') || item.href === '#' ? (
                      <a href={item.href} className="text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{item.label}</a>
                    ) : (
                      <Link to={item.href} className="text-[14px] text-text-secondary hover:text-text-primary transition-colors duration-200" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <span className="text-[12px] text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{c('footer', 'copyright', '\u00a9 2025 VAAD Development. All rights reserved.')}</span>
          <span className="text-[12px] text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{c('footer', 'made_by', 'Made by VAAD \u2014 obviously.')}</span>
        </div>
      </div>
    </footer>
  );
}
