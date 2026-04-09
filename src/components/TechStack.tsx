import { motion } from 'framer-motion';
import { Cloud, Container, Database, GitBranch, Globe, HardDrive, Monitor, Network, Server, Shield, type LucideIcon } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const iconMap = [Monitor, Server, Database, HardDrive, Network, Cloud, GitBranch, Shield, Container, Globe];
const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

const fallbackCategories = [
  { name: 'Frontend systems', desc: 'React interfaces with durable component patterns and content-aware layouts.', tags: ['React', 'TypeScript', 'Routing'] },
  { name: 'Backend workflows', desc: 'Serverless endpoints and operational logic built for forms, content, and admin tooling.', tags: ['Node', 'Vercel Functions', 'Validation'] },
  { name: 'Data models', desc: 'Supabase tables and policies shaped around actual editing, intake, and reporting needs.', tags: ['Supabase', 'Postgres', 'RLS'] },
  { name: 'Media delivery', desc: 'Storage-backed image workflows so content editors are not blocked by manual asset handling.', tags: ['Storage', 'Caching', 'Optimization'] },
  { name: 'Integrations', desc: 'Analytics, email, CRM, and ops touchpoints connected where they support the workflow.', tags: ['Webhooks', 'Forms', 'Automation'] },
  { name: 'Deployment', desc: 'Preview-to-production delivery on infrastructure that is simple to hand off and maintain.', tags: ['Vercel', 'CDN', 'Rollbacks'] },
];

export default function TechStack() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('techstack', 'label', '09 / Capabilities').split(' / ');

  const storedCategoryCount = Number(getContentValue('techstack', 'cat_count', ''));
  const maxCategories = (!isNaN(storedCategoryCount) && storedCategoryCount > 0) ? storedCategoryCount : 10;

  const categories = Array.from({ length: maxCategories }, (_, index) => {
    const categoryNumber = index + 1;
    const fallback = fallbackCategories[index];
    const name = getContentValue('techstack', `cat_${categoryNumber}_name`, fallback?.name || '');
    if (!name) return null;

    return {
      name,
      desc: getContentValue('techstack', `cat_${categoryNumber}_desc`, fallback?.desc || ''),
      tags: getContentValue('techstack', `cat_${categoryNumber}_tags`, fallback?.tags.join(', ') || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      Icon: (iconMap[index] || Globe) as LucideIcon,
      index,
    };
  }).filter(Boolean) as { name: string; desc: string; tags: string[]; Icon: LucideIcon; index: number }[];

  if (categories.length === 0) return null;

  return (
    <section className="py-20 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(0,180,255,0.03), transparent 50%)' }} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 relative z-10">
        <SectionLabel number={labelParts[0] || '09'} label={labelParts[1] || 'Capabilities'} />
        <SectionTitle>{getContentValue('techstack', 'title', 'How we build')}</SectionTitle>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="-mt-4 md:-mt-6 mb-12 md:mb-16 max-w-[580px]"
          style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(14px,1.1vw,16px)', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75 }}
        >
          {getContentValue('techstack', 'subtitle', 'The stack is chosen around delivery speed, maintainability, and how much control your team needs after launch.')}
        </motion.p>

        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-px"
          style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}
        >
          {categories.map((category, i) => {
            const Icon = category.Icon;
            const isRightCol = i % 2 !== 0;
            const totalRows = Math.ceil(categories.length / 2);
            const currentRow = Math.floor(i / 2);
            const isLastRow = currentRow === totalRows - 1;

            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.6, ease, delay: i * 0.05 }}
                className="group relative p-7 md:p-9 card-accent-top"
                style={{
                  background: '#07070F',
                  borderRight: !isRightCol ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  borderBottom: !isLastRow ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  transition: 'background 0.3s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,180,255,0.02)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#07070F'; }}
              >
                {/* Ghost number */}
                <span
                  className="absolute top-4 right-5 pointer-events-none select-none"
                  style={{ fontFamily: 'Bebas Neue', fontSize: '64px', letterSpacing: '0.02em', color: 'rgba(0,180,255,0.025)', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-5">
                    {/* Icon box */}
                    <div
                      className="w-10 h-10 flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        background: 'rgba(0,180,255,0.06)',
                        border: '1px solid rgba(0,180,255,0.12)',
                        borderRadius: '2px',
                      }}
                    >
                      <Icon size={18} style={{ color: '#00B4FF' }} />
                    </div>

                    <div>
                      <h3
                        style={{ fontFamily: 'Bebas Neue', fontSize: '24px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 1, marginBottom: '6px' }}
                      >
                        {category.name}
                      </h3>
                      <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.7 }}>
                        {category.desc}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {category.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontFamily: 'JetBrains Mono',
                          fontSize: '9px',
                          fontWeight: 500,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: '#00B4FF',
                          background: 'rgba(0,180,255,0.06)',
                          border: '1px solid rgba(0,180,255,0.12)',
                          padding: '3px 8px',
                          borderRadius: '2px',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
