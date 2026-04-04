import { useContent } from '../lib/useContent';
import { marqueeDefaults } from '../lib/homeContent';

export default function Marquee() {
  const { getContentValue } = useContent();
  const raw = getContentValue('marquee', 'items', marqueeDefaults.items);
  const items = raw.split(',').map((s) => s.trim()).filter(Boolean);
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-4 border-y border-[rgba(232,19,42,0.14)]"
      style={{ background: 'rgba(6,12,32,0.9)' }}
      aria-hidden="true"
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, #060C20, transparent)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(270deg, #060C20, transparent)' }} />

      <div className="marquee-track flex gap-0">
        {doubled.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6 pr-6">
            <span
              className="text-[10px] tracking-[0.22em] uppercase whitespace-nowrap"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500,
                color: i % 3 === 0 ? 'rgba(232,19,42,0.8)' : 'rgba(234,230,219,0.35)',
              }}
            >
              {item}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(232,19,42,0.5)', display: 'inline-block', flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  );
}
