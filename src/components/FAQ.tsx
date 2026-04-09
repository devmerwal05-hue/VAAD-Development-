import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const { getContentValue } = useContent();
  const labelParts = getContentValue('faq', 'label', '07 / FAQ').split(' / ');

  const faqDefaults = [
    { q: 'How fast can a project start?', a: 'Once scope is agreed, work can usually start within a few days instead of waiting through a long intake cycle.' },
    { q: 'Do you also handle content updates?', a: 'Yes. We can structure the CMS, migrate content, or hand your team a workflow for ongoing edits.' },
    { q: 'Will the site be editable after launch?', a: 'That is a default expectation. Content models and admin editing should not depend on a developer for routine changes.' },
    { q: 'Can you work with an existing brand?', a: 'Yes. The design direction can extend an existing system or sharpen a rough one without forcing a full rebrand.' },
  ];

  const storedFaqCount = Number(getContentValue('faq', 'faq_count', ''));
  const faqCount = (!isNaN(storedFaqCount) && storedFaqCount > 0) ? storedFaqCount : faqDefaults.length;

  const faqs = Array.from({ length: faqCount }, (_, index) => ({
    q: getContentValue('faq', `q_${index + 1}`, faqDefaults[index]?.q || ''),
    a: getContentValue('faq', `a_${index + 1}`, faqDefaults[index]?.a || ''),
  })).filter(faq => faq.q);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[860px] mx-auto px-6 md:px-10">
        <SectionLabel number={labelParts[0] || '07'} label={labelParts[1] || 'FAQ'} />
        <SectionTitle>{getContentValue('faq', 'title', 'Common questions')}</SectionTitle>

        <div
          className="flex flex-col gap-px"
          style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, ease, delay: index * 0.04 }}
              style={{
                background: open === index ? 'rgba(0,180,255,0.03)' : '#07070F',
                borderBottom: index < faqs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                transition: 'background 0.3s',
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className="w-full flex items-center justify-between text-left px-6 md:px-8 py-6"
              >
                <span
                  style={{ fontFamily: 'Space Grotesk', fontSize: '15px', fontWeight: 500, color: open === index ? '#F0EDE6' : '#8A8AA0', paddingRight: '16px', transition: 'color 0.2s' }}
                >
                  {faq.q}
                </span>
                <span
                  className="shrink-0 w-7 h-7 flex items-center justify-center transition-all duration-200"
                  style={{
                    border: `1px solid ${open === index ? 'rgba(0,180,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '2px',
                    background: open === index ? 'rgba(0,180,255,0.08)' : 'transparent',
                  }}
                >
                  {open === index
                    ? <Minus size={13} style={{ color: '#00B4FF' }} />
                    : <Plus size={13} style={{ color: '#55556A' }} />
                  }
                </span>
              </button>

              <AnimatePresence>
                {open === index && (
                  <motion.div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-6" style={{ borderTop: '1px solid rgba(0,180,255,0.08)' }}>
                      <div style={{ width: '20px', height: '1px', background: 'rgba(255,45,85,0.4)', margin: '16px 0 14px' }} />
                      <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.78 }}>
                        {faq.a}
                      </p>
                    </div>
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
