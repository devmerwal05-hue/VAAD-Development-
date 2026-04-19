import { motion, useMotionValueEvent, useScroll, useTransform, type Variants } from 'framer-motion';
import { Fragment, useMemo, useRef, useState } from 'react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const processIntroVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const processCardVariants: Variants = {
  hidden: { opacity: 0, x: 80 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const processMobileVariants: Variants = {
  hidden: { opacity: 0.2, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export interface ProcessProps {
  className?: string;
}

interface ProcessStep {
  description: string;
  title: string;
}

export default function Process({ className = '' }: ProcessProps) {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('process', 'label', '03 / Process').split(' / ');
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const steps = useMemo<ProcessStep[]>(() => {
    const defaults = [
      { title: 'Scope', description: 'We lock the goals, pages, flows, and timeline before visuals start drifting.' },
      { title: 'Design', description: 'Core screens and layout direction are approved early so implementation moves with fewer surprises.' },
      { title: 'Build', description: 'The app or site is built in production-minded slices with content, analytics, and QA included.' },
      { title: 'Launch', description: 'Deployment, walkthroughs, and next-step recommendations are delivered as part of the release.' },
    ];

    return [1, 2, 3, 4].map((index) => ({
      title: getContentValue('process', `step_${index}_title`, defaults[index - 1].title),
      description: getContentValue('process', `step_${index}_desc`, defaults[index - 1].description),
    }));
  }, [getContentValue]);

  const cardWidth = 418;
  const cardGap = 28;
  const desktopOffset = (steps.length - 1) * (cardWidth + cardGap);
  const desktopX = useTransform(scrollYProgress, [0, 1], [0, -desktopOffset]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0.08, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextIndex = Math.min(steps.length - 1, Math.max(0, Math.round(latest * (steps.length - 1))));
    setActiveStep(nextIndex);
  });

  return (
    <section ref={sectionRef} className={`relative overflow-hidden px-6 py-24 md:px-10 md:py-36 ${className}`} style={{ minHeight: `${steps.length * 72}vh` }}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(108,99,255,0.14),transparent_20%),radial-gradient(circle_at_12%_72%,rgba(0,212,255,0.12),transparent_18%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div
          variants={processIntroVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mb-12 max-w-[780px]"
        >
          <SectionLabel number={labelParts[0] || '03'} label={labelParts[1] || 'Process'} />
          <SectionTitle>{getContentValue('process', 'title', 'How a project works')}</SectionTitle>
        </motion.div>

        <div className="hidden xl:block">
          <div className="sticky top-[12vh] overflow-hidden rounded-[36px] border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.82)] px-8 py-8">
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <p className="editorial-kicker text-[rgba(232,232,240,0.52)]">Countdown timeline</p>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.82)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {`Ch. ${String(activeStep + 1).padStart(2, '0')}`}
                </p>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                <motion.div className="h-full origin-left gradient-bg" style={{ scaleX: progressScale }} />
              </div>
              <div className="mt-5 flex items-center gap-3">
                {steps.map((step, index) => (
                  <Fragment key={step.title}>
                    <motion.span
                      animate={{
                        opacity: index <= activeStep ? 1 : 0.36,
                        scale: index === activeStep ? 1.2 : 1,
                        backgroundColor: index <= activeStep ? '#00D4FF' : 'rgba(232,232,240,0.16)',
                      }}
                      transition={{ duration: 0.24, ease: 'easeOut' }}
                      className="h-2.5 w-2.5 rounded-full"
                    />
                    {index < steps.length - 1 ? (
                      <motion.span
                        animate={{ opacity: index < activeStep ? 1 : 0.24 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        className="h-px flex-1 bg-[rgba(0,212,255,0.42)]"
                      />
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </div>

            <motion.div style={{ x: desktopX }} className="flex gap-7">
              {steps.map((step, index) => (
                <motion.article
                  key={step.title}
                  variants={processCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.18 }}
                  className="relative h-[460px] w-[418px] shrink-0 overflow-hidden rounded-[34px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.88)] p-7"
                  style={{
                    boxShadow: index === activeStep ? '0 0 0 1px rgba(0,212,255,0.12)' : 'none',
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(108,99,255,0.2),transparent_24%),radial-gradient(circle_at_82%_78%,rgba(0,212,255,0.12),transparent_22%)]" />
                  <div className="relative z-10 flex h-full flex-col">
                    <p className="editorial-kicker text-[rgba(232,232,240,0.46)]">T minus {String(steps.length - index - 1).padStart(2, '0')}</p>
                    <p className="mt-10 text-[clamp(4rem,7vw,6rem)] font-[800] leading-none tracking-[-0.08em] text-[rgba(232,232,240,0.16)]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-6 max-w-[8ch] text-[3rem] font-[800] uppercase leading-[0.92] tracking-[-0.06em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {step.title}
                    </h3>
                    <div className="mt-auto">
                      <div className="mb-4 h-px w-16 bg-[rgba(0,212,255,0.42)]" />
                      <p className="text-[16px] leading-[1.9] text-text-secondary">{step.description}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:hidden">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              variants={processMobileVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="rounded-[30px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.84)] p-6"
            >
              <p className="editorial-kicker text-[rgba(232,232,240,0.46)]">Step {String(index + 1).padStart(2, '0')}</p>
              <h3 className="mt-4 text-[2.2rem] font-[800] uppercase leading-[0.92] tracking-[-0.05em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {step.title}
              </h3>
              <p className="mt-4 text-[15px] leading-[1.85] text-text-secondary">{step.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
