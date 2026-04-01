export const PROJECT_TYPE_OPTIONS = [
  { value: 'website', label: 'Website' },
  { value: 'web_application', label: 'Web Application' },
  { value: 'ecommerce', label: 'E-commerce Store' },
  { value: 'not_sure', label: 'Not sure yet' },
] as const;

export const BUDGET_RANGE_OPTIONS = [
  { value: 'under_500', label: 'Under $500' },
  { value: 'between_500_1500', label: '$500-$1,500' },
  { value: 'between_1500_3000', label: '$1,500-$3,000' },
  { value: 'above_3000', label: '$3,000+' },
  { value: 'lets_discuss', label: "Let's discuss" },
] as const;

export const PROJECT_TYPE_LABELS = Object.fromEntries(
  PROJECT_TYPE_OPTIONS.map((option) => [option.value, option.label])
) as Record<(typeof PROJECT_TYPE_OPTIONS)[number]['value'], string>;

export const BUDGET_RANGE_LABELS = Object.fromEntries(
  BUDGET_RANGE_OPTIONS.map((option) => [option.value, option.label])
) as Record<(typeof BUDGET_RANGE_OPTIONS)[number]['value'], string>;
