import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePageMetadata } from '../hooks/usePageMetadata';
import Footer from './Footer';
import Navigation from './Navigation';

export default function NotFound() {
  usePageMetadata({
    title: 'VAAD Development | Page not found',
    description: 'The page you requested could not be found.',
    path: '/404',
    noIndex: true,
  });

  return (
    <>
      <Navigation />
      <main id="page-content" className="min-h-[80vh] flex items-center justify-center px-6 pt-[72px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-md">
          <span className="text-[120px] font-[800] gradient-text leading-none block mb-4" style={{ fontFamily: 'Syne' }}>
            404
          </span>
          <h1 className="text-[24px] text-text-primary mb-3" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
            Page not found
          </h1>
          <p className="text-[15px] text-text-secondary mb-8" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            The route does not exist, or the page was removed while the site structure changed.
          </p>
          <Link to="/" className="gradient-bg text-white px-6 py-3 rounded-xl text-[14px] font-medium inline-block" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            Return home
          </Link>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
