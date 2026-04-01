import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];
const fallbackFaqs = [
  { q: 'How fast can a project start?', a: 'Once scope is agreed, work can usually start within a few days instead of waiting through a long intake cycle.' },
  { q: 'Do you also handle content updates?', a: 'Yes. We can structure the CMS, migrate content, or hand your team a workflow for ongoing edits.' },
  { q: 'Will the site be editable after launch?', a: 'That is a default expectation. Content models and admin editing should not depend on a developer for routine changes.' },
  { q: 'Can you work with an existing brand?', a: 'Yes. The design direction can extend an existing system or sharpen a rough one without forcing a full rebrand.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { getContentValue } = useContent();
  const labelParts = getContentValue('faq', 'label', '07 / FAQ').split(' / ');
  const faqs = [1, 2, 3, 4, 5, 6]
    .map((index) => ({
      q: getContentValue('faq', `q_${index}`, fallbackFaqs[index - 1]?.q || ''),
      a: getContentValue('faq', `a_${index}`, fallbackFaqs[index - 1]?.a || ''),
    }))
    .filter((faq) => faq.q);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[820px] mx-auto px-6">
        <SectionLabel number={labelParts[0] || '07'} label={labelParts[1] || 'FAQ'} />
        <SectionTitle>{getContentValue('faq', 'title', 'Common questions')}</SectionTitle>
        <div className="flex flex-col gap-2">
          {faqs.map((faq, index) => (
            <motion.div key={faq.q} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.4, delay: index * 0.04 }} className={`rounded-xl border transition-all duration-300 ${open === index ? 'bg-surface-1 border-[rgba(124,111,247,0.15)] shadow-[0_0_30px_rgba(124,111,247,0.04)]' : 'border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.08)]'}`}>
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className="w-full flex items-center justify-between text-left px-6 py-5"
              >
                <span className="text-[16px] text-text-primary pr-4" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{faq.q}</span>
                <motion.span animate={{ rotate: open === index ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0 w-8 h-8 rounded-lg bg-[rgba(124,111,247,0.08)] flex items-center justify-center">
                  {open === index ? <Minus size={15} className="text-accent" /> : <Plus size={15} className="text-accent" />}
                </motion.span>
              </button>
              <AnimatePresence>
                {open === index && (
                  <motion.div id={`faq-panel-${index}`} role="region" aria-labelledby={`faq-trigger-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease }} className="overflow-hidden">
                    <p className="text-[15px] text-text-secondary leading-[1.75] px-6 pb-6" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{faq.a}</p>
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
