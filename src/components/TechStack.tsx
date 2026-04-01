import { motion } from 'framer-motion';
import { Cloud, Container, Database, GitBranch, Globe, HardDrive, Monitor, Network, Server, Shield, type LucideIcon } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const iconMap = [Monitor, Server, Database, HardDrive, Network, Cloud, GitBranch, Shield, Container, Globe];
const glowColors = [
  'rgba(124,111,247,0.12)',
  'rgba(168,85,249,0.12)',
  'rgba(34,211,238,0.10)',
  'rgba(236,72,153,0.10)',
  'rgba(34,197,94,0.10)',
  'rgba(251,146,60,0.10)',
  'rgba(124,111,247,0.10)',
  'rgba(239,68,68,0.10)',
  'rgba(59,130,246,0.10)',
  'rgba(168,85,249,0.10)',
];
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

  const categories = Array.from({ length: 10 }, (_, index) => {
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
      glow: glowColors[index] || glowColors[0],
    };
  }).filter(Boolean) as { name: string; desc: string; tags: string[]; Icon: LucideIcon; glow: string }[];

  if (categories.length === 0) return null;

  return (
    <section className="py-28 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(124,111,247,0.04), transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(34,211,238,0.03), transparent 50%)' }} />
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionLabel number={labelParts[0] || '09'} label={labelParts[1] || 'Capabilities'} />
        <SectionTitle>{getContentValue('techstack', 'title', 'How we build')}</SectionTitle>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }} className="text-[16px] md:text-[17px] text-text-secondary mb-14 -mt-6 max-w-[600px] leading-[1.7]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
          {getContentValue('techstack', 'subtitle', 'The stack is chosen around delivery speed, maintainability, and how much control your team needs after launch.')}
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category, index) => {
            const Icon = category.Icon;
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={{ duration: 0.7, ease, delay: index * 0.06 }}
                whileHover={{ y: -3, transition: { duration: 0.25 } }}
                className="group relative bg-surface-1 rounded-2xl p-6 md:p-7 border border-[rgba(255,255,255,0.04)] hover:border-[rgba(124,111,247,0.18)] transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 20% 20%, ${category.glow}, transparent 70%)` }} />
                <span className="absolute top-3 right-5 text-[64px] font-[800] pointer-events-none select-none" style={{ fontFamily: 'Syne', color: 'rgba(255,255,255,0.015)' }}>{String(index + 1).padStart(2, '0')}</span>
                <div className="relative z-10">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[rgba(124,111,247,0.08)] group-hover:bg-[rgba(124,111,247,0.14)] flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Icon size={20} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[18px] md:text-[20px] text-text-primary mb-1" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{category.name}</h3>
                      <p className="text-[13px] md:text-[14px] text-text-secondary leading-[1.65]" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{category.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {category.tags.map((tag) => (
                      <span key={tag} className="text-[10px] md:text-[11px] px-2.5 py-1 rounded-lg transition-colors duration-200 group-hover:bg-[rgba(124,111,247,0.08)] group-hover:text-accent-light" style={{ fontFamily: 'JetBrains Mono', background: 'rgba(255,255,255,0.03)', color: '#22D3EE', border: '1px solid rgba(34,211,238,0.08)' }}>
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
