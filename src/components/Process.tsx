import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function Process() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('process', 'label', '03 / Process').split(' / ');

  const stepDefaults = [
    { title: 'Scope', description: 'We lock the goals, pages, flows, and timeline before visuals start drifting.' },
    { title: 'Design', description: 'Core screens and layout direction are approved early so implementation moves with fewer surprises.' },
    { title: 'Build', description: 'The app or site is built in production-minded slices with content, analytics, and QA included.' },
    { title: 'Launch', description: 'Deployment, walkthroughs, and next-step recommendations are delivered as part of the release.' },
  ];

  const storedStepCount = Number(getContentValue('process', 'step_count', ''));
  const stepCount = (!isNaN(storedStepCount) && storedStepCount > 0) ? storedStepCount : stepDefaults.length;

  const steps = Array.from({ length: stepCount }, (_, index) => {
    const fallback = stepDefaults[index];
    return {
      number: String(index + 1).padStart(2, '0'),
      title: getContentValue('process', `step_${index + 1}_title`, fallback?.title || ''),
      description: getContentValue('process', `step_${index + 1}_desc`, fallback?.description || ''),
    };
  }).filter(s => s.title);

  return (
    <section className="py-20 md:py-32 relative">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <SectionLabel number={labelParts[0] || '03'} label={labelParts[1] || 'Process'} />
        <SectionTitle>{getContentValue('process', 'title', 'How a project works')}</SectionTitle>

        {/* Timeline */}
        <div
          className={`grid grid-cols-1 ${stepCount === 2 ? 'sm:grid-cols-2' : stepCount === 3 ? 'sm:grid-cols-3' : 'md:grid-cols-4'} gap-px`}
          style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease, delay: index * 0.08 }}
              className="group relative p-8 md:p-10 card-accent-top"
              style={{
                background: '#07070F',
                borderRight: index < steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                transition: 'background 0.3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,180,255,0.025)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#07070F'; }}
            >
              {/* Connector line (right side on desktop) */}
              {index < steps.length - 1 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-px -translate-y-1/2 w-px h-8"
                  style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,180,255,0.5), transparent)' }}
                />
              )}

              {/* Step number */}
              <span
                style={{
                  fontFamily: 'Bebas Neue',
                  fontSize: '72px',
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  display: 'block',
                  marginBottom: '16px',
                  background: 'linear-gradient(180deg, rgba(0,180,255,0.18), rgba(0,180,255,0.02))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {step.number}
              </span>

              <h3
                className="group-hover:text-[#00B4FF] transition-colors duration-300"
                style={{ fontFamily: 'Bebas Neue', fontSize: '28px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F0EDE6', marginBottom: '12px' }}
              >
                {step.title}
              </h3>

              <div style={{ width: '16px', height: '1px', background: 'rgba(255,45,85,0.5)', marginBottom: '12px' }} />

              <p style={{ fontFamily: 'Space Grotesk', fontSize: '13px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.7 }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
