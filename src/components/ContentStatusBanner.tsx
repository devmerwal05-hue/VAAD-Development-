import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useContent } from '../lib/useContent';

export default function ContentStatusBanner() {
  const { loading, error, getContentValue } = useContent();

  if (!loading && !error) return null;

  return (
    <div className="px-5 md:px-6 pt-3">
      <div
        className={`mx-auto flex max-w-[1320px] items-center gap-2 rounded-xl border px-4 py-3 text-[13px] ${
          error
            ? 'border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] text-red-200'
            : 'border-[rgba(124,111,247,0.16)] bg-[rgba(124,111,247,0.08)] text-text-secondary'
        }`}
        style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
      >
        {error ? <AlertCircle size={15} className="shrink-0 text-red-300" /> : <LoaderCircle size={15} className="shrink-0 animate-spin text-accent" />}
        <span>
          {error
            ? getContentValue('ui', 'content_error_banner', 'Live content is unavailable right now. Showing fallback content until Supabase is configured.')
            : getContentValue('ui', 'content_loading_banner', 'Loading live content from Supabase.')}
        </span>
      </div>
    </div>
  );
}
