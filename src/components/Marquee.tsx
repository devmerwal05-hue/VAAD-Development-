import { useContent } from '../lib/useContent';
import { marqueeDefaults } from '../lib/homeContent';

export default function Marquee() {
  const { getContentValue } = useContent();
  const raw = getContentValue('marquee', 'items', marqueeDefaults.items);
  const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const doubled = [...items, ...items];

  return (
    <div
      className="swiss-section relative overflow-hidden border-b border-white/5 py-3"
      style={{ background: 'rgba(4,19,48,0.95)' }}
      aria-hidden="true"
    >
      <span className="swiss-meta swiss-meta--tl">stream.buffer</span>
      <span className="swiss-meta swiss-meta--tr">seq // 0031</span>

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #060C20, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #060C20, transparent)' }} />

      <div className="marquee-track flex gap-0">
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
            <span
              className="mono-readable whitespace-nowrap text-[10px] uppercase"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 500,
                color: i % 3 === 0 ? 'rgba(255,44,27,0.95)' : 'rgba(156,181,220,0.86)',
              }}
            >
              {item}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,44,27,0.9)', display: 'inline-block', flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
