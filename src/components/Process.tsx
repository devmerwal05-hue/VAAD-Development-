import { m as motion } from 'framer-motion';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

const stepDefaults = [
  { title: 'Scope',  description: 'We lock the goals, pages, flows, and timeline before visuals start drifting.' },
  { title: 'Design', description: 'Core screens and layout direction are approved early so implementation moves with fewer surprises.' },
  { title: 'Build',  description: 'The app or site is built in production-minded slices with content, analytics, and QA included.' },
  { title: 'Launch', description: 'Deployment, walkthroughs, and next-step recommendations are delivered as part of the release.' },
];

export default function Process() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('process', 'label', '03 / Process').split(' / ');
  const storedCount = Number(getContentValue('process', 'step_count', ''));
  const stepCount = !Number.isNaN(storedCount) && storedCount > 0 ? storedCount : stepDefaults.length;

  const steps = Array.from({ length: stepCount }, (_, i) => {
    const fb = stepDefaults[i];
    return {
      number: String(i + 1).padStart(2, '0'),
      title: getContentValue('process', `step_${i + 1}_title`, fb?.title || ''),
      description: getContentValue('process', `step_${i + 1}_desc`, fb?.description || ''),
    };
  }).filter((s) => s.title);

  return (
    <section className="section-pad relative">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />

      <div className="site-container relative z-10">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '03'} / {labelParts[1] || 'Process'}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="mb-16"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
        >
          {getContentValue('process', 'title', 'How a project works')}
        </motion.h2>

        <div className="rule-line-full mb-12" />

        {/* Steps — horizontal timeline */}
        <div className={`grid grid-cols-1 ${stepCount <= 2 ? 'md:grid-cols-2' : stepCount === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-6 md:gap-8`}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease, delay: i * 0.1 }}
              className="group relative border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] px-8 py-8"
            >
              {/* Hover fill */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />

              {/* Animated top rule on hover */}
              <div className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: '#E8132A' }} />

              {/* Step number — giant editorial */}
              <p
                className="mb-8 leading-none"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: 72,
                  color: '#E8132A',
                  opacity: 0.18,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.85,
                  transition: 'opacity 0.3s',
                }}
              >
                {step.number}
              </p>

              {/* Step step label */}
              <p className="annotation-label mb-4">Phase / {step.number}</p>

              <h3
                className="mb-4 group-hover:text-[#E8132A] transition-colors duration-300"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.02em', color: '#EAE6DB', lineHeight: 1.1 }}
              >
                {step.title}
              </h3>

              <div className="h-[1px] mb-4 max-w-[36px]" style={{ background: 'rgba(232,19,42,0.4)' }} />

              <p
                className="text-[13px] leading-[1.8]"
                style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.5)' }}
              >
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
