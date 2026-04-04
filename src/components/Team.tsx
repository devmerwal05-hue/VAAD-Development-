import { m } from 'framer-motion';
import { teamDefaults } from '../lib/homeContent';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

function fallbackInitials(name: string) {
  return name.split(' ').map((p) => p[0] || '').join('').slice(0, 2).toUpperCase();
}

export default function Team() {
  const { content, getContentValue, teamCount } = useContent();
  const labelParts = getContentValue('team', 'label', '05 / Team').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'team' && item.key === 'member_count');
  const totalMembers = hasStoredCount ? teamCount : Math.max(teamCount, teamDefaults.length);

  const members = Array.from({ length: totalMembers }, (_, i) => {
    const n = i + 1;
    const fb = teamDefaults[i];
    const name = getContentValue('team', `member_${n}_name`, fb?.name || '');
    return {
      name,
      initials: getContentValue('team', `member_${n}_initials`, fb?.initials || fallbackInitials(name)),
      role:        getContentValue('team', `member_${n}_role`,    fb?.role || ''),
      description: getContentValue('team', `member_${n}_desc`,   fb?.description || ''),
      image:       getContentValue('team', `member_${n}_image`,  fb?.image || ''),
    };
  }).filter((m) => m.name);

  if (members.length === 0) return null;

  const memberSpanClass = members.length <= 2 ? 'lg:col-span-6' : members.length === 3 ? 'lg:col-span-4' : 'lg:col-span-3';

  return (
    <section className="section-pad swiss-section relative overflow-hidden py-20 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">team.directory</span>
      <span className="swiss-meta swiss-meta--tr">rev // 05.04</span>

      <div className="site-container swiss-grid relative z-10 max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        {/* Section header */}
        <div className="swiss-full-col mb-4 flex items-center gap-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '05'} / {labelParts[1] || 'Team'}</span>
        </div>

        <div className="swiss-full-col mb-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <m.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, ease }}
            className="lg:col-span-7"
            style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
          >
            {getContentValue('team', 'title', 'The people behind the work')}
          </m.h2>
          <m.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1 }}
            className="reading-track lg:col-span-5 text-[14px] leading-[1.85]"
            style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
          >
            {getContentValue('team', 'subtitle', 'A compact team that scopes, designs, builds, and launches without handoff fog.')}
          </m.p>
        </div>

        <div className="swiss-full-col rule-line-full mb-4" />

        {/* Member grid */}
        <div className="swiss-full-col grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {members.map((member, i) => (
            <m.article
              key={`${member.name}-${i}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease, delay: i * 0.07 }}
              className={`group relative flex h-full flex-col border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] ${memberSpanClass}`}
            >
              {/* Hover fill */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />
              <div className="absolute top-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: '#E8132A' }} />

              {/* Avatar */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: 'rgba(9,22,40,0.9)', border: '1px solid rgba(232,19,42,0.1)' }}
                  >
                    <span
                      className="text-[#EAE6DB] opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                      style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 64, letterSpacing: '-0.04em', lineHeight: 1 }}
                    >
                      {member.initials}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,12,32,0.95)] via-[rgba(6,12,32,0.1)] to-transparent" />

                {/* Annotation */}
                <div className="absolute left-4 bottom-4">
                  <span className="annotation-label">Member / {String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-8 md:p-10" style={{ borderTop: '1px solid rgba(232,19,42,0.1)' }}>
                <p
                  className="mb-3 text-[10px] uppercase tracking-[0.22em] transition-colors duration-300 group-hover:text-[#E8132A]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(232,19,42,0.6)' }}
                >
                  {member.role}
                </p>
                <h3
                  className="mb-4"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: '#EAE6DB', lineHeight: 1.1 }}
                >
                  {member.name}
                </h3>
                <p
                  className="mt-1 text-[14px] leading-[1.9]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
                >
                  {member.description}
                </p>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
