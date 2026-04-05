import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe, Mail } from 'lucide-react';
import { useContent } from '../lib/useContent';
import { getErrorMessage } from '../lib/getErrorMessage';
import { BUDGET_RANGE_OPTIONS, PROJECT_TYPE_OPTIONS } from '../lib/contactOptions';
import SectionLabel from './SectionLabel';
import SectionTitle from './SectionTitle';
import PhoneInput from './PhoneInput';

const ease: [number, number, number, number] = [0.16, 0.77, 0.47, 0.97];

interface FormData {
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

interface FormErrors {
  budget_range?: string;
  email?: string;
  message?: string;
  name?: string;
  phone?: string;
  project_type?: string;
}

const baseInputClass =
  'w-full bg-surface-1 text-text-primary text-[15px] px-4 py-[14px] rounded-xl border outline-none transition-all duration-200 placeholder:text-text-tertiary';

export default function Contact() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('contact', 'label', '08 / Contact').split(' / ');
  const [form, setForm] = useState<FormData>({
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const contactEmail = getContentValue('contact', 'email', 'hello@vaad.dev');

  function setField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function clearFieldError(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function inputClass(field: keyof FormErrors) {
    return `${baseInputClass} ${
      errors[field]
        ? 'border-[rgba(239,68,68,0.5)] focus:border-[rgba(239,68,68,0.7)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
        : 'border-[rgba(255,255,255,0.06)] focus:border-[rgba(124,111,247,0.4)] focus:shadow-[0_0_0_3px_rgba(124,111,247,0.08)]'
    }`;
  }

  function validate() {
    const nextErrors: FormErrors = {};

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

    setSubmitting(true);
    setServerError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error || 'Something went wrong.');

      setSubmitted(true);
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
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-6">
        <SectionLabel number={labelParts[0] || '08'} label={labelParts[1] || 'Contact'} />
        <SectionTitle>{getContentValue('contact', 'title', 'Tell us what needs to ship')}</SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-[42%_58%] gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease }}
          >
            <h3
              className="text-[28px] md:text-[32px] text-text-primary mb-5"
              style={{ fontFamily: 'Syne', fontWeight: 700, lineHeight: 1.1 }}
            >
              {getContentValue('contact', 'heading', 'Share the scope, timeline, and blockers.')}
            </h3>
            <p className="text-[15px] text-text-secondary leading-[1.7] mb-10" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
              {getContentValue(
                'contact',
                'description',
                'This form is for real project inquiries. Give us the business context, what needs to be built, and what is slowing the team down today.'
              )}
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Clock size={15} className="text-accent" />
                <span className="text-[14px] text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
                  {getContentValue('contact', 'response_time', 'Replies within one business day')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={15} className="text-accent" />
                <span className="text-[14px] text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
                  {getContentValue('contact', 'timezone', 'Based in India, working with remote teams globally')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-accent" />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-[14px] text-accent hover:text-accent-light transition-colors"
                  style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
                >
                  {contactEmail}
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
          >
            {submitted ? (
              <div className="bg-surface-1 rounded-2xl p-12 text-center border border-[rgba(124,111,247,0.2)]">
                <div className="w-16 h-16 rounded-full gradient-bg mx-auto mb-6 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-[24px] text-text-primary mb-3" style={{ fontFamily: 'Syne', fontWeight: 700 }}>
                  {getContentValue('contact', 'success_title', 'Message sent')}
                </h3>
                <p className="text-[15px] text-text-secondary" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                  {getContentValue('contact', 'success_desc', 'Thanks. We will review the scope and reply with next steps.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" style={{ fontFamily: 'DM Sans' }} noValidate>
                <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(event) => setField('website', event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[13px] text-text-secondary mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(event) => {
                        setField('name', event.target.value);
                        clearFieldError('name');
                      }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={inputClass('name')}
                      style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
                    />
                    {errors.name && <p id="contact-name-error" className="text-[12px] text-red-400 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-[13px] text-text-secondary mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={(event) => {
                        setField('email', event.target.value);
                        clearFieldError('email');
                      }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={inputClass('email')}
                      style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
                    />
                    {errors.email && <p id="contact-email-error" className="text-[12px] text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <PhoneInput
                  id="contact-phone"
                  value={form.phone}
                  onChange={(value) => setField('phone', value)}
                  error={errors.phone}
                  onClearError={() => clearFieldError('phone')}
                  descriptionId="contact-phone-help"
                  errorId="contact-phone-error"
                />

                <div>
                  <label htmlFor="contact-company" className="block text-[13px] text-text-secondary mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                    Company or brand
                  </label>
                  <input
                    id="contact-company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Optional"
                    value={form.company}
                    onChange={(event) => setField('company', event.target.value)}
                    className={`${baseInputClass} border-[rgba(255,255,255,0.06)] focus:border-[rgba(124,111,247,0.4)] focus:shadow-[0_0_0_3px_rgba(124,111,247,0.08)]`}
                    style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-project-type" className="block text-[13px] text-text-secondary mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                      Project type
                    </label>
                    <select
                      id="contact-project-type"
                      name="project_type"
                      value={form.project_type}
                      onChange={(event) => {
                        setField('project_type', event.target.value);
                        clearFieldError('project_type');
                      }}
                      aria-invalid={Boolean(errors.project_type)}
                      aria-describedby={errors.project_type ? 'contact-project-type-error' : undefined}
                      className={inputClass('project_type')}
                      style={{ fontFamily: 'DM Sans', fontWeight: 400, color: form.project_type ? '#F0EDE6' : '#706C86' }}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {PROJECT_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.project_type && <p id="contact-project-type-error" className="text-[12px] text-red-400 mt-1">{errors.project_type}</p>}
                  </div>

                  <div>
                    <label htmlFor="contact-budget-range" className="block text-[13px] text-text-secondary mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                      Budget range
                    </label>
                    <select
                      id="contact-budget-range"
                      name="budget_range"
                      value={form.budget_range}
                      onChange={(event) => {
                        setField('budget_range', event.target.value);
                        clearFieldError('budget_range');
                      }}
                      aria-invalid={Boolean(errors.budget_range)}
                      aria-describedby={errors.budget_range ? 'contact-budget-range-error' : undefined}
                      className={inputClass('budget_range')}
                      style={{ fontFamily: 'DM Sans', fontWeight: 400, color: form.budget_range ? '#F0EDE6' : '#706C86' }}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {BUDGET_RANGE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.budget_range && <p id="contact-budget-range-error" className="text-[12px] text-red-400 mt-1">{errors.budget_range}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[13px] text-text-secondary mb-2" style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>
                    Project details
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    placeholder="What are you building, who is it for, and what should happen next?"
                    value={form.message}
                    onChange={(event) => {
                      setField('message', event.target.value);
                      clearFieldError('message');
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-help'}
                    className={`${inputClass('message')} resize-none`}
                    style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
                  />
                  <p id="contact-message-help" className="text-[12px] text-text-tertiary mt-2" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
                    Include launch pressure, approvals, integrations, or anything else that affects delivery.
                  </p>
                  {errors.message && <p id="contact-message-error" className="text-[12px] text-red-400 mt-1">{errors.message}</p>}
                </div>

                {serverError && (
                  <p className="text-[13px] text-red-400" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="shimmer-btn w-full gradient-bg text-white py-4 rounded-xl text-[15px] font-medium shadow-[0_4px_30px_rgba(124,111,247,0.25)] hover:shadow-[0_4px_40px_rgba(124,111,247,0.35)] transition-all duration-300 disabled:opacity-60"
                  style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    getContentValue('contact', 'submit_button', 'Send project brief')
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
