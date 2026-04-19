import { motion, type Variants } from 'framer-motion';
import { Clock3, Globe2, Mail, TerminalSquare } from 'lucide-react';
import { useMemo, useState } from 'react';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import { useContent } from '../lib/useContent';
import { getErrorMessage } from '../lib/getErrorMessage';
import { BUDGET_RANGE_OPTIONS, PROJECT_TYPE_OPTIONS } from '../lib/contactOptions';

const contactPanelVariants: Variants = {
  hidden: { opacity: 0.2, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const terminalWindowVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.12 },
  },
};

const receiptVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

export interface ContactProps {
  className?: string;
}

interface ContactFormData {
  budget_range: string;
  company: string;
  email: string;
  message: string;
  name: string;
  phone: string;
  project_type: string;
  started_at: number;
  website: string;
}

interface ContactFormErrors {
  budget_range?: string;
  email?: string;
  message?: string;
  name?: string;
  phone?: string;
  project_type?: string;
}

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export default function Contact({ className = '' }: ContactProps) {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('contact', 'label', '08 / Contact').split(' / ');
  const [form, setForm] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_type: '',
    budget_range: '',
    message: '',
    website: '',
    started_at: Date.now(),
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitPhase, setSubmitPhase] = useState<'idle' | 'connecting' | 'sending' | 'success'>('idle');
  const [serverError, setServerError] = useState('');
  const [receiptCode, setReceiptCode] = useState('');
  const availabilityMessage = getContentValue('contact', 'availability_tooltip', '2 project slots open this quarter.');

  const contactEmail = getContentValue('contact', 'email', 'hello@vaad.dev');
  const projectTypeOptions = PROJECT_TYPE_OPTIONS.map((option) => ({
    ...option,
    label: getContentValue('contact_form', `project_type_${option.value}`, option.label),
  }));
  const budgetRangeOptions = BUDGET_RANGE_OPTIONS.map((option) => ({
    ...option,
    label: getContentValue('contact_form', `budget_${option.value}`, option.label),
  }));

  const previewCommand = useMemo(() => {
    const identity = form.name.trim() || 'guest';
    const route = form.project_type || 'brief';
    const payload = form.message.trim() || 'describe-the-mission';
    return `${identity.toLowerCase().replace(/\s+/g, '-')}:${route}$ ${payload}`;
  }, [form.message, form.name, form.project_type]);

  function setField<K extends keyof ContactFormData>(field: K, value: ContactFormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clearFieldError(field: keyof ContactFormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: ContactFormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) nextErrors.name = 'Name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (form.phone) {
      const digits = form.phone.replace(/[^\d]/g, '');
      if (digits.length < 7 || digits.length > 15) nextErrors.phone = 'Phone number must contain 7 to 15 digits.';
      if (!form.phone.startsWith('+')) nextErrors.phone = 'Include a country code, for example +91.';
    }
    if (!form.project_type) nextErrors.project_type = 'Choose the type of project you need.';
    if (!form.budget_range) nextErrors.budget_range = 'Choose a budget range.';
    if (!form.message.trim() || form.message.trim().length < 10) nextErrors.message = 'Message must be at least 10 characters.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;

    setServerError('');
    setSubmitPhase('connecting');

    try {
      await delay(750);
      setSubmitPhase('sending');

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Something went wrong.');

      setReceiptCode(`V${Date.now().toString().slice(-6)}`);
      setSubmitPhase('success');
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        project_type: '',
        budget_range: '',
        message: '',
        website: '',
        started_at: Date.now(),
      });
    } catch (error) {
      setSubmitPhase('idle');
      setServerError(getErrorMessage(error));
    }
  }

  const fieldClassName =
    'w-full rounded-[22px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-3.5 text-[15px] text-text-primary outline-none transition-colors duration-300 placeholder:text-[rgba(232,232,240,0.32)] focus:border-[rgba(108,99,255,0.34)]';

  return (
    <section className={`relative overflow-hidden px-6 py-24 md:px-10 md:py-36 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(108,99,255,0.18),transparent_24%),radial-gradient(circle_at_84%_24%,rgba(0,212,255,0.12),transparent_18%)]" />

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <motion.div
          variants={contactPanelVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mb-12 max-w-[820px]"
        >
          <SectionLabel number={labelParts[0] || '08'} label={labelParts[1] || 'Contact'} />
          <div className="group relative inline-flex items-center gap-2 rounded-full border border-[rgba(34,197,94,0.18)] bg-[rgba(34,197,94,0.08)] px-4 py-2">
            <span className="availability-dot h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
            <span
              className="text-[11px] uppercase tracking-[0.22em] text-[rgba(219,255,230,0.9)]"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            >
              {getContentValue('contact', 'availability_badge', 'Currently accepting')}
            </span>
            <div className="pointer-events-none absolute left-0 top-[calc(100%+12px)] w-[260px] rounded-[20px] border border-[rgba(232,232,240,0.08)] bg-[rgba(8,10,20,0.96)] px-4 py-3 text-[13px] leading-[1.7] text-text-secondary opacity-0 shadow-[0_20px_40px_rgba(0,0,0,0.24)] transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              {availabilityMessage}
            </div>
          </div>
          <SectionTitle>{getContentValue('contact', 'title', 'Tell us what needs to ship')}</SectionTitle>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(320px,0.42fr)_minmax(0,0.58fr)]">
          <motion.aside
            variants={contactPanelVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="rounded-[34px] border border-[rgba(232,232,240,0.08)] bg-[rgba(10,12,25,0.82)] p-8"
          >
            <p className="editorial-kicker text-[rgba(0,212,255,0.82)]">Terminal intake</p>
            <h3 className="mt-5 max-w-[10ch] text-[clamp(2.4rem,4vw,4rem)] font-[800] uppercase leading-[0.9] tracking-[-0.055em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {getContentValue('contact', 'heading', 'Share the scope, timeline, and blockers.')}
            </h3>
            <p className="mt-5 max-w-[42ch] text-[15px] leading-[1.9] text-text-secondary">
              {getContentValue(
                'contact',
                'description',
                'This form is for real project inquiries. Give us the business context, what needs to be built, and what is slowing the team down today.',
              )}
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: Clock3, label: getContentValue('contact', 'response_time', 'Replies within one business day') },
                { icon: Globe2, label: getContentValue('contact', 'timezone', 'Based in India, working with remote teams globally') },
                { icon: Mail, label: contactEmail, href: `mailto:${contactEmail}` },
              ].map(({ icon: Icon, label, href }) => (
                <div key={label} className="flex items-start gap-3 rounded-[22px] border border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(108,99,255,0.22)] bg-[rgba(108,99,255,0.12)]">
                    <Icon size={15} style={{ color: '#00D4FF' }} />
                  </div>
                  {href ? (
                    <a href={href} className="text-[15px] leading-[1.7] text-text-secondary transition-colors hover:text-text-primary">
                      {label}
                    </a>
                  ) : (
                    <p className="text-[15px] leading-[1.7] text-text-secondary">{label}</p>
                  )}
                </div>
              ))}
            </div>
          </motion.aside>

          <motion.div
            variants={terminalWindowVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="overflow-hidden rounded-[36px] border border-[rgba(232,232,240,0.08)] bg-[rgba(7,8,16,0.92)]"
          >
            <div className="flex items-center justify-between border-b border-[rgba(232,232,240,0.08)] px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,107,129,0.95)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[rgba(255,195,113,0.95)]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[rgba(0,212,255,0.95)]" />
              </div>
              <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <TerminalSquare size={14} />
                relay.console
              </div>
            </div>

            <div className="border-b border-[rgba(232,232,240,0.08)] bg-[rgba(255,255,255,0.02)] px-5 py-5">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.78)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Live command preview
              </p>
              <p className="terminal-caret mt-4 text-[14px] leading-[1.85] text-text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {previewCommand}
              </p>

              <div className="mt-5 space-y-2 text-[12px] leading-[1.8] text-[rgba(232,232,240,0.58)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <p>&gt; route: /api/contact</p>
                <p>&gt; project_type: {form.project_type || 'pending'}</p>
                <p>&gt; budget_range: {form.budget_range || 'pending'}</p>
                <p>&gt; relay_status: {submitPhase === 'idle' ? 'awaiting_input' : submitPhase}</p>
              </div>
            </div>

            <div className="p-6 md:p-7">
              {submitPhase === 'success' ? (
                <motion.div variants={receiptVariants} initial="hidden" animate="visible" className="rounded-[28px] border border-[rgba(0,212,255,0.18)] bg-[rgba(0,212,255,0.05)] p-6">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[rgba(0,212,255,0.82)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    Receipt generated
                  </p>
                  <div className="mt-5 space-y-3 text-[13px] leading-[1.8] text-text-primary" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <p>ticket: {receiptCode}</p>
                    <p>route: /api/contact</p>
                    <p>status: delivered</p>
                    <p>reply_window: {getContentValue('contact', 'response_time', 'Replies within one business day')}</p>
                    <p>destination: {contactEmail}</p>
                  </div>
                  <h3 className="mt-7 text-[2rem] font-[800] uppercase leading-[0.92] tracking-[-0.05em] text-text-primary" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {getContentValue('contact', 'success_title', 'Message sent')}
                  </h3>
                  <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.85] text-text-secondary">
                    {getContentValue('contact', 'success_desc', 'Thanks. We will review the scope and reply with next steps.')}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2" noValidate>
                  <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setField('website', event.target.value)} />
                  </div>

                  <div>
                    <label htmlFor="contact-name" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'name_label', 'Name')}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      autoComplete="name"
                      placeholder={getContentValue('contact_form', 'name_placeholder', 'Your name')}
                      onChange={(event) => {
                        setField('name', event.target.value);
                        clearFieldError('name');
                      }}
                      className={fieldClassName}
                    />
                    {errors.name && <p className="mt-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'email_label', 'Email')}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      autoComplete="email"
                      placeholder={getContentValue('contact_form', 'email_placeholder', 'you@company.com')}
                      onChange={(event) => {
                        setField('email', event.target.value);
                        clearFieldError('email');
                      }}
                      className={fieldClassName}
                    />
                    {errors.email && <p className="mt-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'phone_label', 'Phone number')}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      autoComplete="tel"
                      placeholder={getContentValue('contact_form', 'phone_placeholder', '+91 98765 43210')}
                      onChange={(event) => {
                        setField('phone', event.target.value);
                        clearFieldError('phone');
                      }}
                      className={fieldClassName}
                    />
                    <p className="mt-2 text-[12px] leading-[1.7] text-[rgba(232,232,240,0.42)]">{getContentValue('contact_form', 'phone_help', 'Optional. Include the country code so we can reach you on WhatsApp or by phone.')}</p>
                    {errors.phone && <p className="mt-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{errors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-company" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'company_label', 'Company or brand')}
                    </label>
                    <input
                      id="contact-company"
                      type="text"
                      value={form.company}
                      autoComplete="organization"
                      placeholder={getContentValue('contact_form', 'company_placeholder', 'Optional')}
                      onChange={(event) => setField('company', event.target.value)}
                      className={fieldClassName}
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-project-type" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'project_type_label', 'Project type')}
                    </label>
                    <select
                      id="contact-project-type"
                      value={form.project_type}
                      onChange={(event) => {
                        setField('project_type', event.target.value);
                        clearFieldError('project_type');
                      }}
                      className={fieldClassName}
                    >
                      <option value="">{getContentValue('contact_form', 'project_type_placeholder', 'Select one')}</option>
                      {projectTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.project_type && <p className="mt-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{errors.project_type}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-budget-range" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'budget_range_label', 'Budget range')}
                    </label>
                    <select
                      id="contact-budget-range"
                      value={form.budget_range}
                      onChange={(event) => {
                        setField('budget_range', event.target.value);
                        clearFieldError('budget_range');
                      }}
                      className={fieldClassName}
                    >
                      <option value="">{getContentValue('contact_form', 'budget_range_placeholder', 'Select one')}</option>
                      {budgetRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.budget_range && <p className="mt-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{errors.budget_range}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="contact-message" className="mb-2 block text-[11px] uppercase tracking-[0.28em] text-[rgba(232,232,240,0.52)]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {getContentValue('contact_form', 'message_label', 'Project details')}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={6}
                      value={form.message}
                      placeholder={getContentValue('contact_form', 'message_placeholder', 'What are you building, who is it for, and what should happen next?')}
                      onChange={(event) => {
                        setField('message', event.target.value);
                        clearFieldError('message');
                      }}
                      className={`${fieldClassName} resize-none`}
                    />
                    <p className="mt-2 text-[12px] leading-[1.7] text-[rgba(232,232,240,0.42)]">{getContentValue('contact_form', 'message_help', 'Include launch pressure, approvals, integrations, or anything else that affects delivery.')}</p>
                    {errors.message && <p className="mt-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>{errors.message}</p>}
                  </div>

                  {serverError && (
                    <p className="md:col-span-2 text-[11px] text-[#ff6b81]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {serverError}
                    </p>
                  )}

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={submitPhase === 'connecting' || submitPhase === 'sending'}
                      className="w-full rounded-full border border-[rgba(108,99,255,0.34)] bg-[rgba(108,99,255,0.16)] px-7 py-4 text-[12px] uppercase tracking-[0.28em] text-text-primary transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                      style={{ fontFamily: 'JetBrains Mono, monospace' }}
                      data-cursor-label="send"
                    >
                      {submitPhase === 'connecting'
                        ? 'connecting to server...'
                        : submitPhase === 'sending'
                          ? 'printing receipt...'
                          : getContentValue('contact', 'submit_button', 'Send project brief')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
