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
  'w-full text-text-primary text-[14px] px-4 py-[13px] outline-none transition-all duration-200 placeholder:text-[#55556A]';

export default function Contact() {
  const { getContentValue } = useContent();
  const labelParts = getContentValue('contact', 'label', '08 / Contact').split(' / ');
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '',
    project_type: '', budget_range: '', message: '',
    website: '', started_at: Date.now(),
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const contactEmail = getContentValue('contact', 'email', 'hello@vaad.dev');
  const projectTypeOptions = PROJECT_TYPE_OPTIONS.map((option) => ({
    ...option,
    label: getContentValue('contact_form', `project_type_${option.value}`, option.label),
  }));
  const budgetRangeOptions = BUDGET_RANGE_OPTIONS.map((option) => ({
    ...option,
    label: getContentValue('contact_form', `budget_${option.value}`, option.label),
  }));

  function setField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }
  function clearFieldError(field: keyof FormErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function inputClass(field: keyof FormErrors) {
    const hasError = errors[field];
    return `${baseInputClass} ${hasError
      ? 'border border-[rgba(255,45,85,0.45)] focus:border-[rgba(255,45,85,0.7)] bg-[rgba(255,45,85,0.03)]'
      : 'border border-[rgba(255,255,255,0.07)] focus:border-[rgba(0,180,255,0.4)] bg-[#07070F]'
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
      setForm({ name: '', email: '', phone: '', company: '', project_type: '', budget_range: '', message: '', website: '', started_at: Date.now() });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        <SectionLabel number={labelParts[0] || '08'} label={labelParts[1] || 'Contact'} />
        <SectionTitle>{getContentValue('contact', 'title', 'Tell us what needs to ship')}</SectionTitle>

        <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-px" style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>

          {/* Left: Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease }}
            className="p-8 md:p-12"
            style={{ background: '#07070F', borderRight: '1px solid rgba(255,255,255,0.05)' }}
          >
            <h3
              style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(28px,3vw,44px)', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F0EDE6', lineHeight: 1, marginBottom: '16px' }}
            >
              {getContentValue('contact', 'heading', 'Share the scope, timeline, and blockers.')}
            </h3>

            <div style={{ width: '20px', height: '1px', background: 'rgba(255,45,85,0.5)', marginBottom: '16px' }} />

            <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', lineHeight: 1.75, marginBottom: '40px' }}>
              {getContentValue('contact', 'description', 'This form is for real project inquiries. Give us the business context, what needs to be built, and what is slowing the team down today.')}
            </p>

            <div className="flex flex-col gap-5">
              {[
                { Icon: Clock, text: getContentValue('contact', 'response_time', 'Replies within one business day') },
                { Icon: Globe, text: getContentValue('contact', 'timezone', 'Based in India, working with remote teams globally') },
                { Icon: Mail, text: contactEmail, href: `mailto:${contactEmail}` },
              ].map(({ Icon, text, href }, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.1)', borderRadius: '2px' }}
                  >
                    <Icon size={14} style={{ color: '#00B4FF' }} />
                  </div>
                  {href ? (
                    <a
                      href={href}
                      className="transition-colors duration-200 hover:text-[#00B4FF]"
                      style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', paddingTop: '6px' }}
                    >
                      {text}
                    </a>
                  ) : (
                    <span style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0', paddingTop: '6px' }}>
                      {text}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Availability block */}
            <div
              className="mt-12 p-5"
              style={{ background: 'rgba(0,180,255,0.04)', border: '1px solid rgba(0,180,255,0.1)', borderRadius: '2px' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00B4FF', boxShadow: '0 0 6px rgba(0,180,255,0.7)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,180,255,0.8)' }}>
                  Currently accepting new projects
                </span>
              </div>
              <p style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 300, color: '#55556A' }}>
                Typical onboarding in 3–5 business days after scope call.
              </p>
            </div>
          </motion.div>

          {/* Right: Form panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="p-8 md:p-12"
            style={{ background: '#07070F' }}
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                {/* Success checkmark */}
                <div
                  className="w-14 h-14 flex items-center justify-center mb-6"
                  style={{ background: 'rgba(0,180,255,0.08)', border: '1px solid rgba(0,180,255,0.2)', borderRadius: '2px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '36px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#F0EDE6', marginBottom: '10px' }}>
                  {getContentValue('contact', 'success_title', 'Message sent')}
                </h3>
                <p style={{ fontFamily: 'Space Grotesk', fontSize: '14px', fontWeight: 300, color: '#8A8AA0' }}>
                  {getContentValue('contact', 'success_desc', 'Thanks. We will review the scope and reply with next steps.')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {/* Honeypot */}
                <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => setField('website', event.target.value)} />
                </div>

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', display: 'block', marginBottom: '8px' }}>
                      {getContentValue('contact_form', 'name_label', 'Name')}
                    </label>
                    <input
                      id="contact-name" name="name" type="text" autoComplete="name"
                      placeholder={getContentValue('contact_form', 'name_placeholder', 'Your name')}
                      value={form.name}
                      onChange={(event) => { setField('name', event.target.value); clearFieldError('name'); }}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      className={inputClass('name')}
                      style={{ fontFamily: 'Space Grotesk', fontWeight: 400, borderRadius: '2px' }}
                    />
                    {errors.name && <p id="contact-name-error" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#FF2D55', marginTop: '6px' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', display: 'block', marginBottom: '8px' }}>
                      {getContentValue('contact_form', 'email_label', 'Email')}
                    </label>
                    <input
                      id="contact-email" name="email" type="email" autoComplete="email"
                      placeholder={getContentValue('contact_form', 'email_placeholder', 'you@company.com')}
                      value={form.email}
                      onChange={(event) => { setField('email', event.target.value); clearFieldError('email'); }}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      className={inputClass('email')}
                      style={{ fontFamily: 'Space Grotesk', fontWeight: 400, borderRadius: '2px' }}
                    />
                    {errors.email && <p id="contact-email-error" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#FF2D55', marginTop: '6px' }}>{errors.email}</p>}
                  </div>
                </div>

                {/* Phone */}
                <PhoneInput
                  id="contact-phone"
                  value={form.phone}
                  onChange={(value) => setField('phone', value)}
                  error={errors.phone}
                  onClearError={() => clearFieldError('phone')}
                  descriptionId="contact-phone-help"
                  errorId="contact-phone-error"
                  label={getContentValue('contact_form', 'phone_label', 'Phone number')}
                  placeholder={getContentValue('contact_form', 'phone_placeholder', '+91 98765 43210')}
                  helpText={getContentValue('contact_form', 'phone_help', 'Optional. Include the country code so we can reach you on WhatsApp or by phone.')}
                />

                {/* Company */}
                <div>
                  <label htmlFor="contact-company" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', display: 'block', marginBottom: '8px' }}>
                    {getContentValue('contact_form', 'company_label', 'Company or brand')}
                  </label>
                  <input
                    id="contact-company" name="company" type="text" autoComplete="organization"
                    placeholder={getContentValue('contact_form', 'company_placeholder', 'Optional')}
                    value={form.company}
                    onChange={(event) => setField('company', event.target.value)}
                    className={`${baseInputClass} border border-[rgba(255,255,255,0.07)] focus:border-[rgba(0,180,255,0.4)] bg-[#07070F]`}
                    style={{ fontFamily: 'Space Grotesk', fontWeight: 400, borderRadius: '2px' }}
                  />
                </div>

                {/* Project type + Budget */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-project-type" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', display: 'block', marginBottom: '8px' }}>
                      {getContentValue('contact_form', 'project_type_label', 'Project type')}
                    </label>
                    <select
                      id="contact-project-type" name="project_type"
                      value={form.project_type}
                      onChange={(event) => { setField('project_type', event.target.value); clearFieldError('project_type'); }}
                      aria-invalid={Boolean(errors.project_type)}
                      className={inputClass('project_type')}
                      style={{ fontFamily: 'Space Grotesk', fontWeight: 400, borderRadius: '2px', color: form.project_type ? '#F0EDE6' : '#55556A' }}
                    >
                      <option value="" disabled>{getContentValue('contact_form', 'project_type_placeholder', 'Select one')}</option>
                      {projectTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.project_type && <p id="contact-project-type-error" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#FF2D55', marginTop: '6px' }}>{errors.project_type}</p>}
                  </div>
                  <div>
                    <label htmlFor="contact-budget-range" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', display: 'block', marginBottom: '8px' }}>
                      {getContentValue('contact_form', 'budget_range_label', 'Budget range')}
                    </label>
                    <select
                      id="contact-budget-range" name="budget_range"
                      value={form.budget_range}
                      onChange={(event) => { setField('budget_range', event.target.value); clearFieldError('budget_range'); }}
                      aria-invalid={Boolean(errors.budget_range)}
                      className={inputClass('budget_range')}
                      style={{ fontFamily: 'Space Grotesk', fontWeight: 400, borderRadius: '2px', color: form.budget_range ? '#F0EDE6' : '#55556A' }}
                    >
                      <option value="" disabled>{getContentValue('contact_form', 'budget_range_placeholder', 'Select one')}</option>
                      {budgetRangeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    {errors.budget_range && <p id="contact-budget-range-error" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#FF2D55', marginTop: '6px' }}>{errors.budget_range}</p>}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="contact-message" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#55556A', display: 'block', marginBottom: '8px' }}>
                    {getContentValue('contact_form', 'message_label', 'Project details')}
                  </label>
                  <textarea
                    id="contact-message" name="message" rows={5}
                    placeholder={getContentValue('contact_form', 'message_placeholder', 'What are you building, who is it for, and what should happen next?')}
                    value={form.message}
                    onChange={(event) => { setField('message', event.target.value); clearFieldError('message'); }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : 'contact-message-help'}
                    className={`${inputClass('message')} resize-none`}
                    style={{ fontFamily: 'Space Grotesk', fontWeight: 400, borderRadius: '2px' }}
                  />
                  <p id="contact-message-help" style={{ fontFamily: 'Space Grotesk', fontSize: '12px', fontWeight: 300, color: '#55556A', marginTop: '8px' }}>
                    {getContentValue('contact_form', 'message_help', 'Include launch pressure, approvals, integrations, or anything else that affects delivery.')}
                  </p>
                  {errors.message && <p id="contact-message-error" style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#FF2D55', marginTop: '6px' }}>{errors.message}</p>}
                </div>

                {serverError && (
                  <p style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#FF2D55' }}>{serverError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="shimmer-btn w-full transition-all duration-300"
                  style={{
                    fontFamily: 'JetBrains Mono',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#040408',
                    background: submitting ? '#007AB5' : '#00B4FF',
                    padding: '15px',
                    borderRadius: '2px',
                    boxShadow: '0 0 30px rgba(0,180,255,0.18)',
                    opacity: submitting ? 0.7 : 1,
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {getContentValue('contact_form', 'sending_label', 'Sending...')}
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
