import { m } from 'framer-motion';
import { teamDefaults } from '../lib/homeContent';
import { useContent } from '../lib/useContent';
import SectionLabel from './SectionLabel';

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
      <span className="swiss-meta swiss-meta--tl">{getContentValue('team', 'meta_left', 'team.directory')}</span>
      <span className="swiss-meta swiss-meta--tr">{getContentValue('team', 'meta_right', 'rev // 05.04')}</span>

      <div className="site-container swiss-grid relative z-10 max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        {/* Section header */}
        <div className="swiss-full-col mb-4 flex items-center gap-4">
          <SectionLabel number={labelParts[0] || '05'} label={labelParts[1] || 'Team'} />
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
              className={`group bento-card scanline-hover relative flex h-full flex-col border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] ${memberSpanClass}`}
            >
              {i < members.length - 1 && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[-18px] top-[64px] hidden h-px w-9 bg-[rgba(95,178,255,0.2)] transition-colors duration-300 lg:block group-hover:bg-[rgba(95,178,255,0.65)]"
                />
              )}

              {/* Hover fill */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />
              <div className="absolute top-0 left-0 right-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: '#E8132A' }} />

              <div className="px-8 pb-2 pt-9 md:px-10 md:pt-10">
                <div className="flex items-center justify-between">
                  <span className="annotation-label">
                    {getContentValue('team', 'member_prefix', 'Member')} / {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="team-avatar-shell">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: 'rgba(9,22,40,0.9)' }}
                      >
                        <span
                          className="text-[#EAE6DB] opacity-35 transition-opacity duration-300"
                          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 42, letterSpacing: '-0.04em', lineHeight: 1 }}
                        >
                          {member.initials}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-8 md:p-10" style={{ borderTop: '1px solid rgba(232,19,42,0.1)' }}>
                <p
                  className="mb-3 translate-y-0 text-[10px] uppercase tracking-[0.22em] transition-all duration-300 group-hover:-translate-y-1 group-hover:text-[#E8132A]"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(232,19,42,0.6)' }}
                >
                  {member.role}
                </p>
                <h3
                  className="mb-2 translate-y-0 transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em', color: '#EAE6DB', lineHeight: 1.1 }}
                >
                  {member.name}
                </h3>
                <p
                  className="team-bio-reveal mt-2 text-[14px] leading-[1.9]"
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
