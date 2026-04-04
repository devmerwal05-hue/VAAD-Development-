import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ';
import PageHero from '../components/PageHero';
import PageWrapper from '../components/PageWrapper';
import Process from '../components/Process';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function ProcessPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'process_title', 'VAAD Development | Process'),
    description: getContentValue(
      'seo',
      'process_description',
      'How VAAD Development scopes, designs, builds, and launches projects without losing visibility or momentum.'
    ),
    path: '/process',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('process_page', 'eyebrow', 'How Delivery Works')}
        titleBefore={getContentValue('process_page', 'title_before', 'Clear checkpoints from brief to')}
        titleHighlight={getContentValue('process_page', 'title_highlight', 'launch day')}
        description={getContentValue('process_page', 'description', 'The process is designed for speed without hidden surprises: scope first, build against decisions, then launch with a handoff that is actually usable.')}
      />

      <Process />
      <FAQ />

      <section className="px-6 section-pad">
        <div className="corner-marks mx-auto max-w-[900px] border border-[rgba(232,19,42,0.2)] bg-[rgba(9,22,40,0.76)] px-8 py-10 text-center md:px-12 md:py-14">
          <h2
            className="mb-4 text-text-primary"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(30px, 4vw, 56px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
          >
            {getContentValue('process_page', 'cta_title', 'Want this process on your project?')}
          </h2>
          <p className="mx-auto mb-8 max-w-[58ch] text-[15px] leading-[1.8] text-[rgba(234,230,219,0.56)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {getContentValue('process_page', 'cta_description', 'We can start with scope, risks, and a release plan before touching design or code.')}
          </p>

          <Link
            to="/contact"
            className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-8 py-3.5 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_40px_rgba(232,19,42,0.28)]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
          >
            {getContentValue('process_page', 'cta_button', 'Request a project plan')}
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
