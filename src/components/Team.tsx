import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const gradients = [
  'linear-gradient(135deg, #7C6FF7, #5548D9)',
  'linear-gradient(135deg, #A855F7, #7C6FF7)',
  'linear-gradient(135deg, #EC4899, #A855F7)',
  'linear-gradient(225deg, #7C6FF7, #22D3EE)',
];

const fallbackMembers = [
  { name: 'Aarav', initials: 'AA', role: 'Strategy + Product', description: 'Keeps scope, priorities, and delivery decisions grounded in the client goal rather than feature drift.' },
  { name: 'Mira', initials: 'MI', role: 'Design Systems', description: 'Shapes visual systems that stay distinctive without becoming difficult to maintain.' },
  { name: 'Kabir', initials: 'KA', role: 'Frontend Engineering', description: 'Builds the interfaces, state flow, and client behavior that users actually interact with.' },
  { name: 'Anya', initials: 'AN', role: 'Launch Ops', description: 'Owns deployment hygiene, QA passes, and the details that turn a build into a reliable release.' },
];

export default function Team() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('team', 'label', '05 / Team').split(' / ');
  const members = [1, 2, 3, 4].map((memberNumber, index) => ({
    name: getContentValue('team', `member_${memberNumber}_name`, fallbackMembers[index].name),
    initials: getContentValue('team', `member_${memberNumber}_initials`, fallbackMembers[index].initials),
    role: getContentValue('team', `member_${memberNumber}_role`, fallbackMembers[index].role),
    description: getContentValue('team', `member_${memberNumber}_desc`, fallbackMembers[index].description),
    image: getContentValue('team', `member_${memberNumber}_image`, ''),
    gradient: gradients[index],
  }));

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionLabel number={labelParts[0] || '05'} label={labelParts[1] || 'Team'} />
        <SectionTitle>{getContentValue('team', 'title', 'The people behind the work')}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <div className="group bg-surface-1 rounded-2xl p-8 text-center border border-[rgba(255,255,255,0.04)] hover:border-[rgba(124,111,247,0.2)] transition-all duration-300">
                {member.image ? (
                  <div className="w-[88px] h-[88px] rounded-2xl mx-auto mb-6 overflow-hidden" style={{ transform: 'rotate(3deg)', transition: 'transform 0.3s' }}>
                    <img src={member.image} alt={member.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(event) => { (event.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                ) : (
                  <div className="w-[88px] h-[88px] rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:rotate-0 transition-transform duration-300" style={{ background: member.gradient, transform: 'rotate(3deg)' }}>
                    <span className="text-white text-[24px]" style={{ fontFamily: 'Syne', fontWeight: 700, transform: 'rotate(-3deg)' }}>{member.initials}</span>
                  </div>
                )}
                <h3 className="text-[18px] text-text-primary" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{member.name}</h3>
                <p className="text-[11px] uppercase tracking-[0.1em] text-accent-light mt-1 mb-4" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{member.role}</p>
                <p className="text-[14px] text-text-secondary leading-[1.6]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
