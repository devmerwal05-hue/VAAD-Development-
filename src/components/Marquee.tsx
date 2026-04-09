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
    <span key={item + index} className="flex items-center gap-6 shrink-0">
      <span
        style={{
          fontFamily: 'JetBrains Mono',
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: '#55556A',
        }}
      >
        {item}
      </span>
      {/* Blue dot separator */}
      <span
        style={{
          display: 'inline-block',
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: 'rgba(0,180,255,0.35)',
          flexShrink: 0,
        }}
      />
    </span>
  ));

  return (
    <div
      className="w-full flex items-center overflow-hidden"
      style={{
        height: '44px',
        background: 'rgba(7,7,15,0.6)',
        borderTop: '1px solid rgba(0,180,255,0.07)',
        borderBottom: '1px solid rgba(0,180,255,0.07)',
      }}
    >
      <div className="marquee-track flex items-center gap-6 whitespace-nowrap">
        {content}
        {content}
      </div>
    </div>
  );
}
