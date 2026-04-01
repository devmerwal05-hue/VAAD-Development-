import { useContent } from '../lib/useContent';

export default function Marquee() {
  const { getContentValue } = useContent();
  const raw = getContentValue(
    'marquee',
    'items',
    'Scoped delivery,Operations dashboards,Marketing sites with real CMS,Fast launch cycles,Conversion-focused landing pages,React and TypeScript,Node and Supabase,Vercel deployment,Admin tooling'
  );
  const items = raw.split(',').map((entry) => entry.trim()).filter(Boolean);

  const content = items.map((item, index) => (
    <span key={item + index} className="flex items-center gap-5 shrink-0">
      <span className="text-text-secondary hover:text-text-primary transition-colors" style={{ fontFamily: 'JetBrains Mono', fontSize: '12px', letterSpacing: '0.06em' }}>{item}</span>
      <span className="w-1 h-1 rounded-full bg-accent/40" />
    </span>
  ));

  return (
    <div className="w-full h-[52px] bg-surface-1/50 flex items-center overflow-hidden" style={{ borderTop: '1px solid rgba(124,111,247,0.06)', borderBottom: '1px solid rgba(124,111,247,0.06)' }}>
      <div className="marquee-track flex items-center gap-5 whitespace-nowrap">
        {content}
        {content}
      </div>
    </div>
  );
}
