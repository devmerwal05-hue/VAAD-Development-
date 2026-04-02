import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense, useState, useCallback } from 'react';
import { ContentProvider } from './lib/ContentContext';
import ErrorBoundary from './components/ErrorBoundary';
import IntroSplash from './components/IntroSplash';
import HomePage from './pages/HomePage';
import RouteEffects from './components/RouteEffects';

const WorkPage = lazy(() => import('./pages/WorkPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProcessPage = lazy(() => import('./pages/ProcessPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const NotFound = lazy(() => import('./components/NotFound'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-page-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-[11px] text-text-tertiary uppercase tracking-[0.1em]" style={{ fontFamily: 'DM Sans' }}>Loading</span>
      </div>
    </div>
  );
}

export default function App() {
  // Show intro only on first visit per session
  const [introComplete, setIntroComplete] = useState(() => {
    return sessionStorage.getItem('vaad_intro_seen') === '1';
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('vaad_intro_seen', '1');
    setIntroComplete(true);
  }, []);

  return (
    <ErrorBoundary>
      <ContentProvider>
        {!introComplete && <IntroSplash onComplete={handleIntroComplete} />}
        <BrowserRouter>
          <RouteEffects />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/process" element={<ProcessPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ContentProvider>
    </ErrorBoundary>
  );
}
