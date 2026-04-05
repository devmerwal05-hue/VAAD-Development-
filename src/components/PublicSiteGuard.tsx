import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../lib/useContent';
import { logClientEvent, printDebugTipsOnce } from '../lib/clientLogger';
import PublicSiteSkeleton from './PublicSiteSkeleton';

export default function PublicSiteGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const {
    content,
    loading,
    error,
    isFallbackMode,
    lastLoadedAt,
    retryContentLoad,
  } = useContent();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const showInitialSkeleton = !isAdminRoute && loading && content.length === 0;
  const showStatusCard = !isAdminRoute && (Boolean(error) || isFallbackMode || loading);

  useEffect(() => {
    if (isAdminRoute) return;
    if (!error && !isFallbackMode) return;

    logClientEvent('warn', 'content.fallback.active', {
      pathname: location.pathname,
      error,
      isFallbackMode,
    });
    printDebugTipsOnce();
  }, [error, isFallbackMode, isAdminRoute, location.pathname]);

  if (showInitialSkeleton) {
    return (
      <>
        <PublicSiteSkeleton />
        {showStatusCard && (
          <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:w-[420px] rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md p-4">
            <p className="text-[11px] text-white/60 uppercase tracking-[0.12em] mb-1" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
              Loading Content
            </p>
            <p className="text-[13px] text-white/80" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
              Pulling the latest CMS values. If this takes too long, retry.
            </p>
            <div className="mt-3">
              <button
                type="button"
                onClick={retryContentLoad}
                className="px-3 py-1.5 rounded-lg border border-white/20 text-[12px] text-white/90 hover:border-white/35 transition-all"
              >
                Retry now
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {children}
      {showStatusCard && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:left-auto sm:w-[420px] rounded-2xl border border-white/15 bg-black/70 backdrop-blur-md p-4">
          <p className="text-[11px] text-white/60 uppercase tracking-[0.12em] mb-1" style={{ fontFamily: 'DM Sans', fontWeight: 600 }}>
            {loading ? 'Syncing CMS Data' : 'Fallback Content Active'}
          </p>
          <p className="text-[13px] text-white/80" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
            {error
              ? `Live content is unavailable: ${error}`
              : 'Showing the latest safe content while reconnecting to the CMS.'}
          </p>
          {lastLoadedAt && (
            <p className="text-[11px] text-white/45 mt-1" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
              Last successful sync: {new Date(lastLoadedAt).toLocaleString()}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={retryContentLoad}
              className="px-3 py-1.5 rounded-lg border border-white/20 text-[12px] text-white/90 hover:border-white/35 transition-all"
            >
              Retry now
            </button>
            <span className="text-[11px] text-white/40" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
              Site remains available with defaults.
            </span>
          </div>
        </div>
      )}
    </>
  );
}
