import { type ReactNode, lazy, Suspense } from 'react';
import { useMotionValue } from 'framer-motion';
import Navigation from './Navigation';
import Footer from './Footer';

const StarField = lazy(() => import('./StarField'));

export default function PageWrapper({ children }: { children: ReactNode }) {
  const warpStrength = useMotionValue(0.28);

  return (
    <>
      <Suspense fallback={null}>
        <StarField
          className="fixed inset-0 h-full w-full pointer-events-none"
          warpStrength={warpStrength}
        />
      </Suspense>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-page-bg focus:px-4 focus:py-2 focus:text-text-primary focus:shadow-[0_0_0_2px_rgba(124,111,247,0.35)]"
      >
        Skip to content
      </a>
      <Navigation />
      <div id="page-content" className="pt-[68px] md:pt-[72px]">
        {children}
      </div>
      <Footer />
    </>
  );
}
