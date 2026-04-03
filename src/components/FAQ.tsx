import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
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
    <section className="py-24 md:py-32 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C6FF7] to-[#EC4899] rounded-full blur-[100px]" />
      </div>
      
      <div className="max-w-[820px] mx-auto px-6 relative z-10">
        <SectionLabel number={labelParts[0] || '07'} label={labelParts[1] || 'FAQ'} />
        <SectionTitle>{getContentValue('faq', 'title', 'Common questions')}</SectionTitle>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <motion.div 
              key={faq.q} 
              initial={{ opacity: 0, y: 16 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className={`rounded-xl border transition-all duration-300 glass ${open === index ? 'bg-surface-1 border-[rgba(124,111,247,0.3)] shadow-[0_0_40px_rgba(124,111,247,0.08)]' : 'border-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.02)]'}`}
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                aria-expanded={open === index}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className="w-full flex items-center justify-between text-left px-6 py-5 group min-w-0"
              >
                <span className="text-[16px] text-text-primary pr-4 group-hover:text-accent-light transition-colors min-w-0 break-words [text-wrap:balance]" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{faq.q}</span>
                <motion.span 
                  animate={{ rotate: open === index ? 180 : 0, scale: open === index ? 1.1 : 1 }} 
                  transition={{ duration: 0.2 }}
                  className="shrink-0 w-8 h-8 rounded-lg bg-[rgba(124,111,247,0.08)] flex items-center justify-center group-hover:bg-[rgba(124,111,247,0.15)] transition-colors"
                >
                  {open === index ? <Minus size={15} className="text-accent" /> : <Plus size={15} className="text-accent" />}
                </motion.span>
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
                    transition={{ duration: 0.35, ease }}
                    className="overflow-hidden"
                  >
                    <p className="text-[15px] text-text-secondary leading-[1.75] px-6 pb-6 break-words" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>{faq.a}</p>
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
