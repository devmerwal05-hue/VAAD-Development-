import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageWrapper from '../components/PageWrapper';
import Team from '../components/Team';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function TeamPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'team_title', 'VAAD Development | Team'),
    description: getContentValue(
      'seo',
      'team_description',
      'Meet the small delivery team behind VAAD Development and how the work is split across design, engineering, and project delivery.'
    ),
    path: '/team',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('team_page', 'eyebrow', 'The Team')}
        titleBefore={getContentValue('team_page', 'title_before', 'Small crew, direct accountability,')}
        titleHighlight={getContentValue('team_page', 'title_highlight', 'no relay race')}
        description={getContentValue('team_page', 'description', 'The same people who scope the work stay close to implementation. That cuts down handoff loss, surprises, and vague ownership.')}
      />

      <Team />

      <section className="section-pad swiss-section relative">
        <span className="swiss-meta swiss-meta--tl">team.cta</span>
        <span className="swiss-meta swiss-meta--tr">prompt // 04</span>
        <div className="site-container swiss-grid">
          <div className="corner-marks swiss-full-col border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.76)] px-8 py-8 text-center md:px-12 md:py-12 lg:col-span-6 lg:col-start-4">
          <h2
            className="mb-4 text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(30px, 4vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
          >
            {getContentValue('team_page', 'cta_title', 'Need the right mix of design and engineering?')}
          </h2>
          <p className="reading-track mx-auto mb-8 text-[15px] leading-[1.8] text-[rgba(234,230,219,0.56)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {getContentValue('team_page', 'cta_description', 'Tell us the shape of the project and we will pull in the people who should own it.')}
          </p>

          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(232,19,42,0.28)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            {getContentValue('team_page', 'cta_button', 'Talk to the team')}
          </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
