import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useState, useCallback, useEffect, type ReactNode } from 'react';
import { ContentProvider } from './lib/ContentProvider';
import ErrorBoundary from './components/ErrorBoundary';
import IntroSplash from './components/IntroSplash';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import RouteEffects from './components/RouteEffects';
import PublicSiteGuard from './components/PublicSiteGuard';
import { useContent } from './lib/useContent';

const WorkPage = lazy(() => import('./pages/WorkPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFound = lazy(() => import('./components/NotFound'));

function PageLoader() {
  const { getContentValue } = useContent();

  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] text-text-tertiary uppercase tracking-[0.1em]">
          {getContentValue('ui', 'route_loading_label', 'Loading')}
        </span>
      </div>
    </div>
  );
}

function withRouteBoundary(element: ReactNode) {
  return <ErrorBoundary scope="route">{element}</ErrorBoundary>;
}

function PublicSite({ skipEntry = false }: { skipEntry?: boolean }) {
  const [isMobile, setIsMobile] = useState(true);
  const [introComplete, setIntroComplete] = useState(() => {
    try {
      return sessionStorage.getItem('vaad_intro_seen') === '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem('vaad_intro_seen', '1');
    } catch {
      // Ignore
    }
    setIntroComplete(true);
  }, []);

  const shouldSkipEntry = skipEntry || isMobile;

  return (
    <ContentProvider>
      {!introComplete && <IntroSplash onComplete={handleIntroComplete} skipEntry={shouldSkipEntry} />}
      <BrowserRouter>
        <RouteEffects />
        <PublicSiteGuard>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={withRouteBoundary(<HomePage />)} />
              <Route path="/work" element={withRouteBoundary(<WorkPage />)} />
              <Route path="/services" element={withRouteBoundary(<ServicesPage />)} />
              <Route path="/process" element={withRouteBoundary(<ProcessPage />)} />
              <Route path="/pricing" element={withRouteBoundary(<PricingPage />)} />
              <Route path="/contact" element={withRouteBoundary(<ContactPage />)} />
              <Route path="/admin/*" element={withRouteBoundary(<AdminDashboard />)} />
              <Route path="*" element={withRouteBoundary(<NotFound />)} />
            </Routes>
          </Suspense>
        </PublicSiteGuard>
      </BrowserRouter>
    </ContentProvider>
  );
}

export default function App() {
  const normalizedPath = typeof window !== 'undefined'
    ? window.location.pathname.toLowerCase()
    : '';
  const isAdminPath = normalizedPath.startsWith('/admin');

  if (isAdminPath) {
    if (typeof window !== 'undefined' && normalizedPath !== '/admin' && !normalizedPath.startsWith('/admin/')) {
      window.location.replace('/admin');
      return null;
    }

    return (
      <ErrorBoundary>
        {withRouteBoundary(<AdminDashboard />)}
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <PublicSite skipEntry={true} />
    </ErrorBoundary>
  );
}