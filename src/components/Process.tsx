import { motion } from 'framer-motion';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

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
    <section className="py-24 md:py-32 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        <SectionLabel number={labelParts[0] || '03'} label={labelParts[1] || 'Process'} />
        <SectionTitle>{getContentValue('process', 'title', 'How a project works')}</SectionTitle>
        <div className={`grid grid-cols-1 ${stepCount === 2 ? 'sm:grid-cols-2' : stepCount === 3 ? 'sm:grid-cols-3 lg:grid-cols-3' : 'lg:grid-cols-4'} gap-0`}>
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative p-6 lg:p-8 glass card-hover rounded-2xl"
              style={{ borderLeft: index > 0 ? '1px solid rgba(124,111,247,0.1)' : 'none' }}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(124,111,247,0.08), transparent 70%)' }} />
              <span className="text-[64px] leading-none font-[800] block mb-4 gradient-text-enhanced" style={{ fontFamily: 'Syne' }}>{step.number}</span>
              <h3 className="text-[20px] text-text-primary mb-3 group-hover:text-accent-light transition-colors duration-300 break-words [text-wrap:balance]" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{step.title}</h3>
              <p className="text-[14px] text-text-secondary leading-[1.7] break-words" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
