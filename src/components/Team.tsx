import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { teamDefaults } from '../lib/homeContent';
import { useContent } from '../lib/useContent';

const gradients = [
  'linear-gradient(135deg, #7C6FF7, #5548D9)',
  'linear-gradient(135deg, #A855F7, #7C6FF7)',
  'linear-gradient(135deg, #EC4899, #A855F7)',
  'linear-gradient(135deg, #22D3EE, #7C6FF7)',
  'linear-gradient(135deg, #FB923C, #EC4899)',
  'linear-gradient(135deg, #34D399, #22D3EE)',
];

function fallbackInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function Team() {
  const { content, getContentValue, teamCount } = useContent();
  const labelParts = getContentValue('team', 'label', '05 / Team').split(' / ');
  const hasStoredCount = content.some((item) => item.section === 'team' && item.key === 'member_count');
  const totalMembers = hasStoredCount ? teamCount : Math.max(teamCount, teamDefaults.length);

  const members = Array.from({ length: totalMembers }, (_, index) => {
    const memberNumber = index + 1;
    const fallback = teamDefaults[index];
    const name = getContentValue('team', `member_${memberNumber}_name`, fallback?.name || '');

    return {
      name,
      initials: getContentValue('team', `member_${memberNumber}_initials`, fallback?.initials || fallbackInitials(name)),
      role: getContentValue('team', `member_${memberNumber}_role`, fallback?.role || ''),
      description: getContentValue('team', `member_${memberNumber}_desc`, fallback?.description || ''),
      image: getContentValue('team', `member_${memberNumber}_image`, fallback?.image || ''),
      gradient: gradients[index % gradients.length],
    };
  }).filter((member) => member.name);

  if (members.length === 0) return null;

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(124,111,247,0.06), transparent 55%), radial-gradient(ellipse at 80% 10%, rgba(34,211,238,0.05), transparent 45%)' }} />
      <div className="max-w-[1320px] mx-auto px-6 relative z-10">
        <div className="max-w-[720px] mb-12">
          <SectionLabel number={labelParts[0] || '05'} label={labelParts[1] || 'Team'} />
          <SectionTitle>{getContentValue('team', 'title', 'The people behind the work')}</SectionTitle>
          <p className="text-[15px] md:text-[17px] text-text-secondary -mt-6 max-w-[620px] leading-[1.75]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
            {getContentValue('team', 'subtitle', 'A compact team that scopes, designs, builds, and launches without handoff fog.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {members.map((member, index) => {
            const featured = index === 0;

            return (
              <motion.article
                key={`${member.name}-${index}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className={`group rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-surface-1 overflow-hidden ${featured ? 'lg:col-span-7' : 'lg:col-span-5'}`}
              >
                <div className={`grid ${featured ? 'md:grid-cols-[280px_1fr]' : 'md:grid-cols-[220px_1fr]'}`}>
                  <div className="relative min-h-[280px] md:min-h-full">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: member.gradient }}>
                        <span className="text-white text-[72px] md:text-[92px]" style={{ fontFamily: 'Syne', fontWeight: 800 }}>
                          {member.initials}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,9,0.82)] via-[rgba(5,5,9,0.12)] to-transparent" />
                    <span className="absolute left-5 bottom-5 text-[11px] uppercase tracking-[0.18em] text-white/80" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                      {featured ? 'Lead owner' : 'Delivery team'}
                    </span>
                  </div>

                  <div className="p-6 md:p-8 flex flex-col gap-4 justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-accent-light mb-3" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                        {member.role}
                      </p>
                      <h3 className="text-[28px] md:text-[36px] text-text-primary mb-4" style={{ fontFamily: 'Syne', fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.04em' }}>
                        {member.name}
                      </h3>
                      <p className="text-[15px] text-text-secondary leading-[1.8]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                        {member.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                      <span className="text-[12px] text-text-tertiary uppercase tracking-[0.12em]">
                        {featured ? 'Scope to launch' : 'Execution detail'}
                      </span>
                      <span className="text-[12px] text-text-primary" style={{ fontFamily: 'JetBrains Mono' }}>
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
