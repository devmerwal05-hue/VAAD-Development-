import type { ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { useContent } from '../lib/useContent';

export default function PageWrapper({ children }: { children: ReactNode }) {
  const { getContentValue } = useContent();

  return (
    <>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-page-bg focus:px-4 focus:py-2 focus:text-text-primary focus:shadow-[0_0_0_2px_rgba(232,19,42,0.4)]"
      >
        {getContentValue('ui', 'skip_to_content', 'Skip to content')}
      </a>
      <Navigation />
      <div id="page-content" className="relative pt-[72px]">
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] hidden lg:block">
          <div className="absolute inset-y-0 left-0 w-[16.666%] border-r border-[rgba(234,230,219,0.05)]" />
          <div className="absolute inset-y-0 right-0 w-[16.666%] border-l border-[rgba(234,230,219,0.05)]" />
          <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-[rgba(234,230,219,0.05)]" />

          <div className="absolute left-6 top-[120px]">
            <span className="frame-meta-text">VAAD // DEV_2026</span>
          </div>
          <div className="absolute right-6 top-[120px]">
            <span className="frame-meta-text rotate-180">SYSTEM // ACTIVE</span>
          </div>

          <span className="absolute left-4 top-4 h-4 w-4 border-l border-t border-[rgba(234,230,219,0.28)]" />
          <span className="absolute right-4 top-4 h-4 w-4 border-r border-t border-[rgba(234,230,219,0.28)]" />
          <span className="absolute bottom-4 left-4 h-4 w-4 border-b border-l border-[rgba(234,230,219,0.28)]" />
          <span className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-[rgba(234,230,219,0.28)]" />
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
