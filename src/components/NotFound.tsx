import { Link } from 'react-router-dom';
import { m as motion } from 'framer-motion';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';
import Footer from './Footer';
import Navigation from './Navigation';

export default function NotFound() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'not_found_title', 'VAAD Development | Page not found'),
    description: getContentValue('seo', 'not_found_description', 'The page you requested could not be found.'),
    path: '/404',
    noIndex: true,
  });

  return (
    <>
      <Navigation />
      <main id="page-content" className="relative flex min-h-[88svh] items-center justify-center px-6 pt-[72px]">
        <div className="absolute inset-0 grid-pattern opacity-18 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_65%_50%_at_50%_45%,rgba(232,19,42,0.1),transparent_68%)]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="corner-marks w-full max-w-[760px] border border-[rgba(232,19,42,0.22)] bg-[rgba(9,22,40,0.78)] px-8 py-12 text-center md:px-12"
        >
          <p className="section-ref mb-5">404 / ARCHIVE</p>

          <span
            className="mb-4 block leading-none text-accent"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(90px, 14vw, 180px)', letterSpacing: '-0.05em' }}
          >
            404
          </span>

          <h1
            className="mb-4 text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
          >
            {getContentValue('not_found', 'heading', 'Page not found')}
          </h1>

          <p className="mx-auto mb-9 max-w-[52ch] text-[15px] leading-[1.8] text-[rgba(234,230,219,0.58)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {getContentValue(
              'not_found',
              'description',
              'The route does not exist, or the page was removed while the site structure changed.'
            )}
          </p>

          <Link
            to="/"
            className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-7 py-3 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_36px_rgba(232,19,42,0.26)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            {getContentValue('not_found', 'button', 'Return home')}
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
