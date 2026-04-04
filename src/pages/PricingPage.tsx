import FAQ from '../components/FAQ';
import PageHero from '../components/PageHero';
import PageWrapper from '../components/PageWrapper';
import Pricing from '../components/Pricing';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function PricingPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'pricing_title', 'VAAD Development | Pricing'),
    description: getContentValue(
      'seo',
      'pricing_description',
      'Project pricing, delivery ranges, and what is included in a typical VAAD Development engagement.'
    ),
    path: '/pricing',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('pricing_page', 'eyebrow', 'Pricing')}
        titleBefore={getContentValue('pricing_page', 'title_before', 'Pricing framed around delivery, not')}
        titleHighlight={getContentValue('pricing_page', 'title_highlight', 'billable drift')}
        description={getContentValue('pricing_page', 'description', 'We scope around the release, the complexity, and the support needed after launch. That gives you a clearer budget before execution starts.')}
      />

      <Pricing />
      <FAQ />
    </PageWrapper>
  );
}
