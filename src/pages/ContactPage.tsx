import { motion } from 'framer-motion';
import Contact from '../components/Contact';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ContactPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: 'VAAD Development | Contact',
    description: 'Contact VAAD Development to scope a website, internal tool, or web application build.',
    path: '/contact',
  });

  return (
    <PageWrapper>
      <section className="pt-16 md:pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-[680px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                {getContentValue('contact_page', 'eyebrow', 'Contact')}
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(32px, 10vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {getContentValue('contact_page', 'title_before', 'Bring the requirements. We will bring a')} <span className="gradient-text">{getContentValue('contact_page', 'title_highlight', 'real plan')}</span>
            </h1>
            <p className="text-[15px] md:text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('contact_page', 'description', 'Share what needs to launch, where the current setup is failing, and what kind of timeline you are working against.')}
            </p>
          </motion.div>
        </div>
      </section>
      <Contact />
    </PageWrapper>
  );
}
