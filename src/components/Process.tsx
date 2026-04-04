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

  const stepSpanClass = stepCount <= 2 ? 'lg:col-span-6' : stepCount === 3 ? 'lg:col-span-4' : 'lg:col-span-3';

  return (
    <section className="section-pad swiss-section relative py-20 md:py-24">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">{getContentValue('process', 'meta_left', 'process.timeline')}</span>
      <span className="swiss-meta swiss-meta--tr">{getContentValue('process', 'meta_right', 'coord // 19.07N')}</span>

      <div className="site-container swiss-grid relative z-10 max-w-[1320px] gap-8 px-5 md:px-8 lg:gap-12 xl:px-10">
        {/* Section header */}
        <div className="swiss-full-col mb-4 flex items-center gap-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '03'} / {labelParts[1] || 'Process'}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="swiss-text-col mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
        >
          {getContentValue('process', 'title', 'How a project works')}
        </motion.h2>

        <div className="swiss-full-col rule-line-full mb-4" />

        {/* Steps — horizontal timeline */}
        <div className="swiss-full-col relative">
          <div className="pointer-events-none absolute left-0 right-0 top-[38px] hidden h-px bg-[rgba(232,19,42,0.22)] lg:block" />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease, delay: i * 0.1 }}
                className={`group relative border border-[rgba(232,19,42,0.18)] bg-[rgba(9,22,40,0.62)] p-8 md:p-10 lg:pt-12 ${stepSpanClass}`}
              >
                {/* Hover fill */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'rgba(232,19,42,0.03)' }} />

                {/* Timeline marker */}
                <span className="absolute left-7 top-0 hidden h-3.5 w-3.5 -translate-y-1/2 rounded-full border border-[rgba(232,19,42,0.7)] bg-[rgba(9,22,40,0.95)] lg:block" />

                {/* Animated top rule on hover */}
                <div className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500" style={{ background: '#E8132A' }} />

                {/* Step number — giant editorial */}
                <p
                  className="mb-7 leading-none"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: 64,
                    color: '#E8132A',
                    opacity: 0.16,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.85,
                    transition: 'opacity 0.3s',
                  }}
                >
                  {step.number}
                </p>

                <p className="annotation-label mb-5">
                  {getContentValue('process', 'phase_prefix', 'Phase')} / {step.number}
                </p>

                <h3
                  className="mb-5 group-hover:text-[#E8132A] transition-colors duration-300"
                  style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 'clamp(20px, 2vw, 26px)', letterSpacing: '-0.02em', color: '#EAE6DB', lineHeight: 1.12 }}
                >
                  {step.title}
                </h3>

                <div className="mb-5 h-[1px] max-w-[52px]" style={{ background: 'rgba(232,19,42,0.4)' }} />

                <p
                  className="text-[14px] leading-[1.9]"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.54)' }}
                >
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
