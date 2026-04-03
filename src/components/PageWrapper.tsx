import type { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import ContentStatusBanner from './ContentStatusBanner';
import { useContent } from '../lib/useContent';

export default function PageWrapper({ children }: { children: ReactNode }) {
  const { getContentValue } = useContent();

  return (
    <>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-page-bg focus:px-4 focus:py-2 focus:text-text-primary focus:shadow-[0_0_0_2px_rgba(124,111,247,0.35)]"
      >
        {getContentValue('ui', 'skip_to_content', 'Skip to content')}
      </a>
      <Navigation />
      <ContentStatusBanner />
      <div id="page-content" className="pt-[72px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
