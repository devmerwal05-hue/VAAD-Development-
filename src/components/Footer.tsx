import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

interface FooterItem { href?: string; label: string; }
interface FooterColumn { items: FooterItem[]; title: string; }

export default function Footer() {
  const { getContentValue } = useContent();
  const contactEmail = getContentValue('contact', 'email', 'hello@vaad.dev');

  const columns: FooterColumn[] = [
    {
      title: getContentValue('footer', 'explore_title', 'Explore'),
      items: [
        { label: getContentValue('nav', 'home_label', 'Home'), href: '/' },
        { label: getContentValue('nav', 'link_1', 'Work'),     href: getContentValue('nav', 'link_1_href', '/work') },
        { label: getContentValue('nav', 'link_2', 'Services'), href: getContentValue('nav', 'link_2_href', '/services') },
        { label: getContentValue('nav', 'link_6', 'Contact'),  href: getContentValue('nav', 'link_6_href', '/contact') },
      ],
    },
    {
      title: getContentValue('footer', 'work_title', 'What We Ship'),
      items: [
        { label: getContentValue('services', 'card_1_title', 'High-conviction websites'), href: '/services' },
        { label: getContentValue('services', 'card_2_title', 'Operational web apps'),     href: '/services' },
        { label: getContentValue('services', 'card_3_title', 'Commerce builds'),          href: '/services' },
        { label: getContentValue('process', 'title', 'A fast, visible process'),          href: '/process' },
      ],
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
      title: getContentValue('footer', 'contact_title', 'Contact'),
      items: [
        { label: contactEmail,                                                              href: `mailto:${contactEmail}` },
        { label: getContentValue('contact', 'response_time', 'Replies within one business day') },
        { label: getContentValue('contact', 'timezone', 'Based in India, working globally') },
      ],
    },
  ];

  return (
    <footer style={{ background: '#040A18' }}>
      {/* CTA section */}
      <div
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid rgba(232,19,42,0.15)' }}
      >
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 0%, rgba(232,19,42,0.06), transparent 60%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="site-container relative z-10 py-20 text-center"
        >
          {/* Annotation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-[1px] w-12" style={{ background: 'rgba(232,19,42,0.4)' }} />
            <span className="section-ref">{getContentValue('footer', 'ready_label', 'Ready to build')}</span>
            <div className="h-[1px] w-12" style={{ background: 'rgba(232,19,42,0.4)' }} />
          </div>

          <h2
            className="mb-6 break-words"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(32px, 6vw, 72px)',
              letterSpacing: '-0.03em',
              lineHeight: 0.88,
              color: '#EAE6DB',
            }}
          >
            {getContentValue('footer', 'cta_title', 'Need a site or app that can ship fast?')}
          </h2>

          <p
            className="reading-track mx-auto mb-12 max-w-[520px] text-[15px] leading-[1.8]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
          >
            {getContentValue('footer', 'cta_description', 'Share the scope, timeline, and blockers. We will reply with a clear build path instead of a vague pitch deck.')}
          </p>

          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2.5 px-8 py-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-300 hover:shadow-[0_0_50px_rgba(232,19,42,0.3)]"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              background: '#E8132A',
              color: '#EAE6DB',
              border: '1px solid #E8132A',
            }}
          >
            {getContentValue('footer', 'cta_button', 'Start a project')}
            <ArrowUpRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Footer grid */}
      <div
        className="site-container pb-8 pt-16"
        style={{ borderTop: '1px solid rgba(232,19,42,0.1)' }}
      >
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '0.14em', color: '#EAE6DB' }}
              >
                {getContentValue('nav', 'logo_text', 'VAAD')}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
            </div>
            <p
              className="text-[13px] max-w-[360px] leading-[1.8]"
              style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.35)' }}
            >
              {getContentValue('footer', 'tagline', 'VAAD Development builds launch-ready websites and internal tools for small teams that need clarity, speed, and a maintainable handoff.')}
            </p>
          </div>
          <p className="annotation-label" style={{ color: 'rgba(234,230,219,0.25)' }}>
            {getContentValue('footer', 'eyebrow', 'Design, build, deploy, maintain')}
          </p>
        </div>

        <div className="rule-line-full mb-12" />

        <div className="mb-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="annotation-label mb-6">{col.title}</h4>
              <ul className="flex flex-col gap-4">
                {col.items.map((item) => (
                  <li key={`${col.title}-${item.label}`}>
                    {item.href?.startsWith('mailto:') ? (
                      <a href={item.href} className="text-[13px] transition-colors duration-200 hover:text-[#EAE6DB]"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.4)' }}>
                        {item.label}
                      </a>
                    ) : item.href ? (
                      <Link to={item.href} className="text-[13px] transition-colors duration-200 hover:text-[#EAE6DB]"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.4)' }}>
                        {item.label}
                      </Link>
                    ) : (
                      <span className="text-[13px]"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.3)' }}>
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="rule-line-full mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <span className="annotation-label">{getContentValue('footer', 'copyright', 'Copyright 2026 VAAD Development. All rights reserved.')}</span>
          <span className="annotation-label">{getContentValue('footer', 'made_by', 'Built for teams that want fewer meetings and stronger execution.')}</span>
        </div>
      </div>
    </footer>
  );
}
