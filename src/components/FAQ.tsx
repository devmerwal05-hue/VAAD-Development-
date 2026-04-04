import { useState } from 'react';
import { AnimatePresence, m as motion } from 'framer-motion';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

const faqDefaults = [
  { q: 'How fast can a project start?',      a: 'Once scope is agreed, work can usually start within a few days instead of waiting through a long intake cycle.' },
  { q: 'Do you also handle content updates?', a: 'Yes. We can structure the CMS, migrate content, or hand your team a workflow for ongoing edits.' },
  { q: 'Will the site be editable after launch?', a: 'That is a default expectation. Content models and admin editing should not depend on a developer for routine changes.' },
  { q: 'Can you work with an existing brand?', a: 'Yes. The design direction can extend an existing system or sharpen a rough one without forcing a full rebrand.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { getContentValue } = useContent();
  const labelParts = getContentValue('faq', 'label', '07 / FAQ').split(' / ');
  const storedCount = Number(getContentValue('faq', 'faq_count', ''));
  const faqCount = !Number.isNaN(storedCount) && storedCount > 0 ? storedCount : faqDefaults.length;

  const faqs = Array.from({ length: faqCount }, (_, i) => ({
    q: getContentValue('faq', `q_${i + 1}`, faqDefaults[i]?.q || ''),
    a: getContentValue('faq', `a_${i + 1}`, faqDefaults[i]?.a || ''),
  })).filter((f) => f.q);

  return (
    <section className="section-pad swiss-section relative">
      <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none" />
      <span className="swiss-meta swiss-meta--tl">faq.module</span>
      <span className="swiss-meta swiss-meta--tr">cache // on</span>

      <div className="site-container swiss-grid relative z-10">
        {/* Header */}
        <div className="swiss-full-col mb-4 flex items-center gap-4">
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#E8132A', display: 'inline-block' }} />
          <span className="section-ref">{labelParts[0] || '07'} / {labelParts[1] || 'FAQ'}</span>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6, ease }}
          className="swiss-text-col mb-4"
          style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(36px, 5vw, 68px)', letterSpacing: '-0.03em', lineHeight: 0.9, color: '#EAE6DB' }}
        >
          {getContentValue('faq', 'title', 'Common questions')}
        </motion.h2>

        <div className="swiss-full-col rule-line-full mb-4" />

        <div className="swiss-text-col flex flex-col gap-5">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease, delay: i * 0.07 }}
              className="border border-[rgba(232,19,42,0.24)] bg-[rgba(9,22,40,0.62)]"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                id={`faq-trigger-${i}`}
                className="group flex w-full items-center justify-between px-6 py-7 text-left md:px-7 md:py-8"
              >
                <div className="flex min-w-0 flex-1 items-start gap-6">
                  <span
                    className="shrink-0 mt-1"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: open === i ? '#E8132A' : 'rgba(234,230,219,0.2)', textTransform: 'uppercase' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="pr-4 text-[16px] leading-[1.5] transition-colors duration-200 md:text-[18px]"
                    style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 400, color: open === i ? '#EAE6DB' : 'rgba(234,230,219,0.65)' }}
                  >
                    {faq.q}
                  </span>
                </div>
                {/* Plus / minus indicator */}
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center border border-[rgba(232,19,42,0.35)] transition-all duration-300"
                  style={{ color: '#E8132A', background: 'rgba(232,19,42,0.06)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.5"
                      style={{ transform: open === i ? 'scaleY(0)' : 'scaleY(1)', transformOrigin: 'center', transition: 'transform 0.25s ease' }} />
                    <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <p
                      className="pb-7 pl-14 pr-6 text-[15px] leading-[1.9] md:pl-16 md:pr-7"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: 'rgba(234,230,219,0.55)' }}
                    >
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
