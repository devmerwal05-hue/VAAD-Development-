import Contact from '../components/Contact';
import PageHero from '../components/PageHero';
import PageWrapper from '../components/PageWrapper';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { useContent } from '../lib/useContent';

export default function ContactPage() {
  const { getContentValue } = useContent();

  usePageMetadata({
    title: getContentValue('seo', 'contact_title', 'VAAD Development | Contact'),
    description: getContentValue(
      'seo',
      'contact_description',
      'Contact VAAD Development to scope a website, internal tool, or web application build.'
    ),
    path: '/contact',
  });

  return (
    <PageWrapper>
      <PageHero
        eyebrow={getContentValue('contact_page', 'eyebrow', 'Contact')}
        titleBefore={getContentValue('contact_page', 'title_before', 'Bring the requirements. We will bring a')}
        titleHighlight={getContentValue('contact_page', 'title_highlight', 'real plan')}
        description={getContentValue('contact_page', 'description', 'Share what needs to launch, where the current setup is failing, and what kind of timeline you are working against.')}
      />

      <Contact />
    </PageWrapper>
  );
}
