import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { ContentContext, type ContentContextType } from '../lib/content-context';
import { logClientEvent, printDebugTipsOnce } from '../lib/clientLogger';

interface Props {
  children: ReactNode;
  scope?: 'app' | 'route';
}
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  static contextType = ContentContext;

  declare context: ContentContextType;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logClientEvent('error', 'react.error_boundary', {
      scope: this.props.scope || 'app',
      message: error.message,
      stack: error.stack || null,
      componentStack: errorInfo.componentStack,
    });
    printDebugTipsOnce();
  }

  render() {
    if (this.state.hasError) {
      const isRouteBoundary = this.props.scope === 'route';
      const getContentValue = this.context?.getContentValue || ((_section: string, _key: string, fallback = '') => fallback);
      return (
        <div className={`${isRouteBoundary ? 'min-h-[70vh]' : 'min-h-screen'} bg-page-bg flex items-center justify-center px-6`}>
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.1)] flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
            <h1 className="text-[24px] text-text-primary mb-3" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
              {getContentValue('error_boundary', 'title', 'Something went wrong')}
            </h1>
            <p className="text-[15px] text-text-secondary mb-6" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {isRouteBoundary
                ? getContentValue('error_boundary', 'route_description', 'This section failed to render. You can retry or continue browsing.')
                : getContentValue('error_boundary', 'app_description', 'An unexpected error occurred. Please refresh the page.')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="gradient-bg text-white px-6 py-3 rounded-xl text-[14px] font-medium"
                style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
              >
                {getContentValue('error_boundary', 'refresh_button', 'Refresh Page')}
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="px-6 py-3 rounded-xl text-[14px] font-medium border border-white/20 text-white/80 hover:text-white hover:border-white/35 transition-all"
                style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
              >
                {getContentValue('error_boundary', 'home_button', 'Go Home')}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
