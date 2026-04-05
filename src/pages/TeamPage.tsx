import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import Team from '../components/Team';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function TeamPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: 'VAAD Development | Team',
    description: 'Meet the small delivery team behind VAAD Development and how the work is split across design, engineering, and project delivery.',
    path: '/team',
  });

  return (
    <PageWrapper>
      <section className="pt-16 md:pt-20 pb-8">
        <div className="max-w-[1280px] mx-auto px-5 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-[680px]">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-[6px] h-[6px] rounded-full bg-accent" />
              <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-text-tertiary" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                {getContentValue('team_page', 'eyebrow', 'The Team')}
              </span>
            </div>
            <h1 className="text-text-primary mb-5" style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(32px, 10vw, 72px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              {getContentValue('team_page', 'title_before', 'Small crew, direct accountability,')} <span className="gradient-text">{getContentValue('team_page', 'title_highlight', 'no relay race')}</span>
            </h1>
            <p className="text-[15px] md:text-[18px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue('team_page', 'description', 'The same people who scope the work stay close to implementation. That cuts down handoff loss, surprises, and vague ownership.')}
            </p>
          </motion.div>
        </div>
      </section>
      <Team />
      <section className="py-20">
        <div className="max-w-[640px] mx-auto px-5 md:px-6 text-center">
          <h2 className="text-[28px] md:text-[32px] text-text-primary mb-4" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
            {getContentValue('team_page', 'cta_title', 'Need the right mix of design and engineering?')}
          </h2>
          <p className="text-[14px] md:text-[16px] text-text-secondary mb-8" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {getContentValue('team_page', 'cta_description', 'Tell us the shape of the project and we will pull in the people who should own it.')}
          </p>
          <Link to="/contact" className="shimmer-btn gradient-bg text-white px-8 py-[14px] rounded-lg text-[15px] font-medium inline-block" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
            {getContentValue('team_page', 'cta_button', 'Talk to the team')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
