import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { ContentContext } from '../lib/content-context';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ContentContext.Consumer>
          {({ getContentValue }) => (
            <div className="relative flex min-h-screen items-center justify-center bg-page-bg px-6">
              <div className="absolute inset-0 grid-pattern opacity-18 pointer-events-none" />

              <div className="corner-marks relative z-10 w-full max-w-[760px] border border-[rgba(232,19,42,0.22)] bg-[rgba(9,22,40,0.78)] px-8 py-12 text-center md:px-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-[rgba(232,19,42,0.45)] bg-[rgba(232,19,42,0.14)]">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8132A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                </div>

                <h1
                  className="mb-4 text-text-primary"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 'clamp(30px, 4vw, 52px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}
                >
                  {getContentValue('error_boundary', 'title', 'Something went wrong')}
                </h1>

                <p className="mx-auto mb-8 max-w-[52ch] text-[15px] leading-[1.8] text-[rgba(234,230,219,0.58)]" style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {getContentValue('error_boundary', 'description', 'An unexpected error occurred. Please refresh the page.')}
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="shimmer-btn inline-flex items-center gap-2 border border-accent bg-accent px-8 py-4 text-[11px] uppercase tracking-[0.18em] text-text-primary transition-all duration-300 hover:shadow-[0_0_36px_rgba(232,19,42,0.26)]"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
                >
                  {getContentValue('error_boundary', 'button', 'Refresh Page')}
                </button>
              </div>
            </div>
          )}
        </ContentContext.Consumer>
      );
    }
    return this.props.children;
  }
}
