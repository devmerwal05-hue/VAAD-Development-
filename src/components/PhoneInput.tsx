interface PhoneInputProps {
  descriptionId: string;
  error?: string;
  errorId: string;
  helpText?: string;
  id: string;
  label?: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
  placeholder?: string;
  value: string;
}

export default function PhoneInput({
  descriptionId,
  error,
  errorId,
  helpText,
  id,
  label,
  onChange,
  onClearError,
  placeholder,
  value,
}: PhoneInputProps) {
  const describedBy = [descriptionId, error ? errorId : ''].filter(Boolean).join(' ');

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[13px] text-text-secondary mb-2"
        style={{ fontFamily: 'DM Sans', fontWeight: 500 }}
      >
        {label || 'Phone number'}
      </label>
      <input
        id={id}
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        placeholder={placeholder || '+91 98765 43210'}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          onClearError?.();
        }}
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={`w-full bg-surface-1 text-text-primary text-[15px] px-4 py-[14px] rounded-xl border outline-none transition-all duration-200 placeholder:text-text-tertiary ${
          error
            ? 'border-[rgba(239,68,68,0.5)] focus:border-[rgba(239,68,68,0.7)] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]'
            : 'border-[rgba(255,255,255,0.06)] focus:border-[rgba(124,111,247,0.4)] focus:shadow-[0_0_0_3px_rgba(124,111,247,0.08)]'
        }`}
        style={{ fontFamily: 'DM Sans', fontWeight: 400 }}
      />
      <p id={descriptionId} className="text-[12px] text-text-tertiary mt-2" style={{ fontFamily: 'DM Sans', fontWeight: 300 }}>
        {helpText || 'Optional. Include the country code so we can reach you on WhatsApp or by phone.'}
      </p>
      {error && (
        <p id={errorId} className="text-[12px] text-red-400 mt-1" style={{ fontFamily: 'DM Sans', fontWeight: 400 }}>
          {error}
        </p>
      )}
    </div>
  );
}
