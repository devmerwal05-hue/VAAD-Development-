import { motion } from 'framer-motion';
import Contact from '../components/Contact';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ContactPage() {
  usePageMetadata({
    title: 'VAAD Development | Contact',
    description: 'Contact VAAD Development to scope a website, internal tool, or web application build.',
    path: '/contact',
  });

  return (
    <PageWrapper>
      <section className="pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-[680px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                Contact
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: '-0.03em' }}>
              Bring the requirements. We will bring a <span className="gradient-text">real plan</span>
            </h1>
            <p className="text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              Share what needs to launch, where the current setup is failing, and what kind of timeline you are working against.
            </p>
          </motion.div>
        </div>
      </section>
      <Contact />
    </PageWrapper>
  );
}
