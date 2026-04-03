export type AdminFieldType = 'text' | 'textarea' | 'url' | 'image' | 'list' | 'boolean';

export interface AdminFieldDefinition {
  key: string;
  label: string;
  fallback: string;
  type?: AdminFieldType;
  description?: string;
  placeholder?: string;
}

export interface AdminSectionDefinition {
  description: string;
  fields: AdminFieldDefinition[];
  title: string;
}

export interface RepeatableCollectionDefinition<TItem> {
  description: string;
  defaultCount: number;
  emptyTitle: string;
  fieldOrder: string[];
  fields: AdminFieldDefinition[];
  getFallback: (index: number) => TItem;
  itemLabel: string;
  primaryField: string;
}

export interface PortfolioFallbackItem {
  description: string;
  gallery: string[];
  image: string;
  name: string;
  subtitle: string;
  tag: string;
  url: string;
}

export interface TeamFallbackItem {
  description: string;
  image: string;
  initials: string;
  name: string;
  role: string;
}

export const heroDefaults = {
  eyebrow: 'Web Design + Web App Delivery',
  headline_line1: 'Small teams need fast systems',
  headline_line2: 'not vague agency timelines.',
  subheadline: 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.',
  cta_primary: 'Start a project',
  cta_secondary: 'See shipped work',
  stat_1_number: '5',
  stat_1_label: 'Senior builders',
  stat_2_number: '1-3',
  stat_2_label: 'Week delivery',
  stat_3_number: 'Always',
  stat_3_label: 'Post-launch iteration',
  proof_kicker: 'Live delivery board',
  proof_title: 'Creative builds that still respect real deadlines.',
  proof_description: 'Each release is scoped against launch pressure, content reality, and what your team can maintain after handoff.',
  proof_image: '',
};

export const marqueeDefaults = {
  items: 'Scoped delivery,Operations dashboards,Marketing sites with real CMS,Fast launch cycles,Conversion-focused landing pages,React and TypeScript,Node and Supabase,Vercel deployment,Admin tooling',
};

export const serviceDefaults = [
  {
    title: 'High-conviction websites',
    description: 'Marketing sites with strong information hierarchy, custom visuals, and a CMS handoff your team can actually maintain.',
  },
  {
    title: 'Operational web apps',
    description: 'Internal tools, client dashboards, and workflow systems that reduce manual follow-up and keep teams aligned.',
  },
  {
    title: 'Commerce builds',
    description: 'Stores and product funnels designed around clear merchandising, product storytelling, and mobile conversion paths.',
  },
  {
    title: 'Launch support',
    description: 'Deployment, analytics, content updates, and post-launch improvements so the build keeps paying off after go-live.',
  },
] as const;

export const techStackDefaults = [
  { name: 'Frontend systems', desc: 'React interfaces with durable component patterns and content-aware layouts.', tags: ['React', 'TypeScript', 'Routing'] },
  { name: 'Backend workflows', desc: 'Serverless endpoints and operational logic built for forms, content, and admin tooling.', tags: ['Node', 'Vercel Functions', 'Validation'] },
  { name: 'Data models', desc: 'Supabase tables and policies shaped around actual editing, intake, and reporting needs.', tags: ['Supabase', 'Postgres', 'RLS'] },
  { name: 'Media delivery', desc: 'Storage-backed image workflows so content editors are not blocked by manual asset handling.', tags: ['Storage', 'Caching', 'Optimization'] },
  { name: 'Integrations', desc: 'Analytics, email, CRM, and ops touchpoints connected where they support the workflow.', tags: ['Webhooks', 'Forms', 'Automation'] },
  { name: 'Deployment', desc: 'Preview-to-production delivery on infrastructure that is simple to hand off and maintain.', tags: ['Vercel', 'CDN', 'Rollbacks'] },
] as const;

export const statsDefaults = [
  {
    value: '7',
    suffix: '',
    label: 'Days to first milestone',
    sublabel: 'Delivery',
    description: 'Projects start with a clearly defined first ship target instead of an open-ended discovery loop.',
  },
  {
    value: '48',
    suffix: 'h',
    label: 'Typical response window',
    sublabel: 'Communication',
    description: 'You are not waiting days for a status update when decisions are blocking progress.',
  },
  {
    value: '90',
    suffix: '%',
    label: 'Mobile traffic share considered',
    sublabel: 'Real usage',
    description: 'Layouts are designed around the traffic mix most small businesses actually see.',
  },
  {
    value: '1',
    suffix: '',
    label: 'Single accountable team',
    sublabel: 'Ownership',
    description: 'Design, development, and launch decisions are owned by the same small team.',
  },
] as const;

export const processDefaults = [
  {
    title: 'Scope',
    description: 'We lock the goals, pages, flows, and timeline before visuals start drifting.',
  },
  {
    title: 'Design',
    description: 'Core screens and layout direction are approved early so implementation moves with fewer surprises.',
  },
  {
    title: 'Build',
    description: 'The app or site is built in production-minded slices with content, analytics, and QA included.',
  },
  {
    title: 'Launch',
    description: 'Deployment, walkthroughs, and next-step recommendations are delivered as part of the release.',
  },
] as const;

export const portfolioDefaults: readonly PortfolioFallbackItem[] = [
  {
    tag: 'Coffee Commerce',
    name: 'Kofi Supply',
    subtitle: 'Inventory-aware storefront',
    description: 'Catalog, subscriptions, and repeat-order flows designed for a small team that ships fast.',
    url: '',
    image: '/images/project-kofi.svg',
    gallery: ['/images/project-kofi.svg'],
  },
  {
    tag: 'Ops Dashboard',
    name: 'Novare',
    subtitle: 'Internal workflow system',
    description: 'Role-based admin workflows, analytics summaries, and task visibility built for daily operational use.',
    url: '',
    image: '/images/project-novare.svg',
    gallery: ['/images/project-novare.svg'],
  },
  {
    tag: 'Retail Experience',
    name: 'Solebound',
    subtitle: 'Launch-ready product site',
    description: 'A high-contrast product story with conversion-first merchandising and mobile-first browsing.',
    url: '',
    image: '/images/project-solebound.svg',
    gallery: ['/images/project-solebound.svg'],
  },
] as const;

export const teamDefaults: readonly TeamFallbackItem[] = [
  {
    name: 'Aarav',
    initials: 'AA',
    role: 'Strategy + Product',
    description: 'Keeps scope, priorities, and delivery decisions grounded in the client goal rather than feature drift.',
    image: '',
  },
  {
    name: 'Mira',
    initials: 'MI',
    role: 'Design Systems',
    description: 'Shapes visual systems that stay distinctive without becoming difficult to maintain.',
    image: '',
  },
  {
    name: 'Kabir',
    initials: 'KA',
    role: 'Frontend Engineering',
    description: 'Builds the interfaces, state flow, and client behavior that users actually interact with.',
    image: '',
  },
  {
    name: 'Anya',
    initials: 'AN',
    role: 'Launch Ops',
    description: 'Owns deployment hygiene, QA passes, and the details that turn a build into a reliable release.',
    image: '',
  },
] as const;

export const pricingDefaults = [
  {
    name: 'Starter site',
    price: '900',
    description: 'For focused marketing sites that need clarity, speed, and a CMS handoff.',
    features: 'Strategy workshop|Custom UI direction|CMS setup|Vercel deployment',
    highlighted: 'false',
  },
  {
    name: 'Growth build',
    price: '1900',
    description: 'For businesses that need a stronger funnel, more pages, and clearer conversion flows.',
    features: 'Multi-page build|Analytics setup|Structured content model|Launch QA',
    highlighted: 'true',
  },
  {
    name: 'Operational system',
    price: '3900',
    description: 'For teams replacing manual workflows with a tailored internal or client-facing system.',
    features: 'Workflow mapping|Admin dashboard|Role-aware logic|Post-launch support',
    highlighted: 'false',
  },
] as const;

export const faqDefaults = [
  {
    question: 'How fast can a project start?',
    answer: 'Once scope is agreed, work can usually start within a few days instead of waiting through a long intake cycle.',
  },
  {
    question: 'Do you also handle content updates?',
    answer: 'Yes. We can structure the CMS, migrate content, or hand your team a workflow for ongoing edits.',
  },
  {
    question: 'Will the site be editable after launch?',
    answer: 'That is a default expectation. Content models and admin editing should not depend on a developer for routine changes.',
  },
  {
    question: 'Can you work with an existing brand?',
    answer: 'Yes. The design direction can extend an existing system or sharpen a rough one without forcing a full rebrand.',
  },
] as const;

export const footerDefaults = {
  cta_title: 'Need a site or app that can ship fast?',
  cta_description: 'Share the scope, timeline, and blockers. We will reply with a clear build path instead of a vague pitch deck.',
  cta_button: 'Start a project',
  tagline: 'VAAD Development builds launch-ready websites and internal tools for small teams that need clarity, speed, and a maintainable handoff.',
  eyebrow: 'Design, build, deploy, maintain',
  explore_title: 'Explore',
  work_title: 'What We Ship',
  model_title: 'Working Model',
  contact_title: 'Contact',
  model_1: 'Discovery and scope in 24 hours',
  model_2: 'Design and build handled by one team',
  model_3: 'CMS handoff and launch support included',
  model_4: 'Async-friendly collaboration for remote clients',
  copyright: 'Copyright 2026 VAAD Development. All rights reserved.',
  made_by: 'Built for teams that want fewer meetings and stronger execution.',
};

const navFields: AdminFieldDefinition[] = [
  { key: 'logo_text', label: 'Logo text', fallback: 'VAAD' },
  { key: 'link_1', label: 'Link 1 label', fallback: 'Work' },
  { key: 'link_1_href', label: 'Link 1 URL', fallback: '/work', type: 'url' },
  { key: 'link_2', label: 'Link 2 label', fallback: 'Services' },
  { key: 'link_2_href', label: 'Link 2 URL', fallback: '/services', type: 'url' },
  { key: 'link_3', label: 'Link 3 label', fallback: 'Process' },
  { key: 'link_3_href', label: 'Link 3 URL', fallback: '/process', type: 'url' },
  { key: 'link_4', label: 'Link 4 label', fallback: 'Team' },
  { key: 'link_4_href', label: 'Link 4 URL', fallback: '/team', type: 'url' },
  { key: 'link_5', label: 'Link 5 label', fallback: 'Pricing' },
  { key: 'link_5_href', label: 'Link 5 URL', fallback: '/pricing', type: 'url' },
  { key: 'link_6', label: 'Link 6 label', fallback: 'Contact' },
  { key: 'link_6_href', label: 'Link 6 URL', fallback: '/contact', type: 'url' },
  { key: 'mobile_open_aria', label: 'Mobile menu open (ARIA label)', fallback: 'Open navigation menu', description: 'Screen reader label for the mobile navigation toggle when the menu is closed.' },
  { key: 'mobile_close_aria', label: 'Mobile menu close (ARIA label)', fallback: 'Close navigation menu', description: 'Screen reader label for the mobile navigation toggle when the menu is open.' },
];

const heroFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Eyebrow', fallback: heroDefaults.eyebrow },
  { key: 'headline_line1', label: 'Headline line 1', fallback: heroDefaults.headline_line1 },
  { key: 'headline_line2', label: 'Headline line 2', fallback: heroDefaults.headline_line2 },
  { key: 'subheadline', label: 'Subheadline', fallback: heroDefaults.subheadline, type: 'textarea' },
  { key: 'cta_primary', label: 'Primary button label', fallback: heroDefaults.cta_primary },
  { key: 'cta_secondary', label: 'Secondary button label', fallback: heroDefaults.cta_secondary },
  { key: 'stat_count', label: 'Number of hero stats', fallback: '3', type: 'text', description: 'Set the number of stats in the hero section (1-5).' },
  { key: 'stat_1_number', label: 'Stat 1 value', fallback: heroDefaults.stat_1_number },
  { key: 'stat_1_label', label: 'Stat 1 label', fallback: heroDefaults.stat_1_label },
  { key: 'stat_2_number', label: 'Stat 2 value', fallback: heroDefaults.stat_2_number },
  { key: 'stat_2_label', label: 'Stat 2 label', fallback: heroDefaults.stat_2_label },
  { key: 'stat_3_number', label: 'Stat 3 value', fallback: heroDefaults.stat_3_number },
  { key: 'stat_3_label', label: 'Stat 3 label', fallback: heroDefaults.stat_3_label },
  { key: 'proof_kicker', label: 'Proof card kicker', fallback: heroDefaults.proof_kicker },
  { key: 'proof_title', label: 'Proof card title', fallback: heroDefaults.proof_title, type: 'textarea' },
  { key: 'proof_description', label: 'Proof card description', fallback: heroDefaults.proof_description, type: 'textarea' },
  { key: 'proof_image', label: 'Proof card image', fallback: heroDefaults.proof_image, type: 'image', description: 'Optional. Upload an image for the delivery board panel. If empty, the first portfolio project image is used.' },
  { key: 'proof_location', label: 'Proof card location label', fallback: 'Home', description: 'Small label in the proof-card header (top right).' },
  { key: 'featured_fallback_alt', label: 'Featured image alt (fallback)', fallback: 'Featured release' },
  { key: 'featured_fallback_tag', label: 'Featured tag (fallback)', fallback: 'Featured release' },
  { key: 'featured_fallback_name', label: 'Featured title (fallback)', fallback: 'Launch-ready systems' },
  { key: 'proof_panel_label', label: 'Panel label prefix', fallback: 'Panel', description: 'Shown as “Panel 01”, “Panel 02”… in the proof-card sidebar.' },
  { key: 'scroll_hint', label: 'Scroll hint label', fallback: 'scroll' },
];

const serviceFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '01 / Services' },
  { key: 'title', label: 'Section title', fallback: 'What we build' },
  { key: 'subtitle', label: 'Section subtitle', fallback: 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.', type: 'textarea' },
  { key: 'card_count', label: 'Number of service cards', fallback: String(serviceDefaults.length), type: 'text', description: 'Set the number of service cards to display (1-10).' },
  ...serviceDefaults.flatMap((service, index) => {
    const number = index + 1;
    return [
      { key: `card_${number}_title`, label: `Service ${number} title`, fallback: service.title },
      { key: `card_${number}_desc`, label: `Service ${number} description`, fallback: service.description, type: 'textarea' as const },
    ];
  }),
];

const techStackFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '09 / Capabilities' },
  { key: 'title', label: 'Section title', fallback: 'How we build' },
  { key: 'subtitle', label: 'Section subtitle', fallback: 'The stack is chosen around delivery speed, maintainability, and how much control your team needs after launch.', type: 'textarea' },
  { key: 'cat_count', label: 'Number of capabilities', fallback: '10', type: 'text', description: 'Set the number of capability cards to display (1-10).' },
  ...Array.from({ length: 10 }, (_, index) => {
    const fallback = techStackDefaults[index];
    const number = index + 1;
    return [
      { key: `cat_${number}_name`, label: `Capability ${number} name`, fallback: fallback?.name || '' },
      { key: `cat_${number}_desc`, label: `Capability ${number} description`, fallback: fallback?.desc || '', type: 'textarea' as const },
      { key: `cat_${number}_tags`, label: `Capability ${number} tags`, fallback: fallback?.tags.join(', ') || '', type: 'list' as const, description: 'Comma-separated tags.' },
    ];
  }).flat(),
];

const statsFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '02 / Why Us' },
  { key: 'title', label: 'Section title', fallback: 'Why teams choose VAAD' },
  { key: 'stat_count', label: 'Number of stats', fallback: String(statsDefaults.length), type: 'text', description: 'Set the number of stats to display (1-6).' },
  ...statsDefaults.flatMap((stat, index) => {
    const number = index + 1;
    return [
      { key: `stat_${number}_value`, label: `Stat ${number} value`, fallback: stat.value },
      { key: `stat_${number}_suffix`, label: `Stat ${number} suffix`, fallback: stat.suffix },
      { key: `stat_${number}_label`, label: `Stat ${number} label`, fallback: stat.label },
      { key: `stat_${number}_sublabel`, label: `Stat ${number} sublabel`, fallback: stat.sublabel },
      { key: `stat_${number}_desc`, label: `Stat ${number} description`, fallback: stat.description, type: 'textarea' as const },
    ];
  }),
];

const processFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '03 / Process' },
  { key: 'title', label: 'Section title', fallback: 'How a project works' },
  { key: 'step_count', label: 'Number of process steps', fallback: String(processDefaults.length), type: 'text', description: 'Set the number of process steps to display (1-6).' },
  ...processDefaults.flatMap((step, index) => {
    const number = index + 1;
    return [
      { key: `step_${number}_title`, label: `Step ${number} title`, fallback: step.title },
      { key: `step_${number}_desc`, label: `Step ${number} description`, fallback: step.description, type: 'textarea' as const },
    ];
  }),
];

const portfolioMetaFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '04 / Work' },
  { key: 'title', label: 'Section title', fallback: 'Selected work' },
  { key: 'footer_text', label: 'Footer text', fallback: 'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.', type: 'textarea' },
  { key: 'link_label_live', label: 'Project link label (when URL exists)', fallback: 'View live project' },
  { key: 'link_label_internal', label: 'Project link label (when no URL)', fallback: 'Internal showcase' },
];

const uiFields: AdminFieldDefinition[] = [
  { key: 'skip_to_content', label: 'Skip link label', fallback: 'Skip to content', description: 'Accessible skip-to-content link shown on focus.' },
  { key: 'loading', label: 'Generic loading label', fallback: 'Loading' },
  { key: 'enable_3d_card_effect', label: 'Enable 3D card effect', fallback: 'false', type: 'boolean', description: 'Toggles the interactive 3D tilt effect on supported cards (disabled on touch/coarse pointers and when reduced-motion is enabled).' },
  { key: 'enable_floating_dock_nav', label: 'Enable floating dock navigation', fallback: 'true', type: 'boolean', description: 'Toggles the icon-based floating dock navigation in the top bar (desktop only).' },
  { key: 'content_loading_banner', label: 'Content banner (loading)', fallback: 'Loading live content from Supabase.', type: 'textarea' },
  { key: 'content_error_banner', label: 'Content banner (error)', fallback: 'Live content is unavailable right now. Showing fallback content until Supabase is configured.', type: 'textarea' },
];

const seoFields: AdminFieldDefinition[] = [
  { key: 'home_title', label: 'Home page title', fallback: 'VAAD Development | Fast websites and web apps' },
  { key: 'home_description', label: 'Home page description', fallback: 'VAAD Development designs, builds, and ships conversion-focused websites and operational web apps for small teams that need momentum.', type: 'textarea' },
  { key: 'work_title', label: 'Work page title', fallback: 'VAAD Development | Selected projects' },
  { key: 'work_description', label: 'Work page description', fallback: 'Recent website and web application builds from VAAD Development, including e-commerce, operations tooling, and launch-focused product work.', type: 'textarea' },
  { key: 'services_title', label: 'Services page title', fallback: 'VAAD Development | Services' },
  { key: 'services_description', label: 'Services page description', fallback: 'Website builds, product interfaces, internal tools, and launch support from VAAD Development.', type: 'textarea' },
  { key: 'process_title', label: 'Process page title', fallback: 'VAAD Development | Process' },
  { key: 'process_description', label: 'Process page description', fallback: 'How VAAD Development scopes, designs, builds, and launches projects without losing visibility or momentum.', type: 'textarea' },
  { key: 'team_title', label: 'Team page title', fallback: 'VAAD Development | Team' },
  { key: 'team_description', label: 'Team page description', fallback: 'Meet the small delivery team behind VAAD Development and how the work is split across design, engineering, and project delivery.', type: 'textarea' },
  { key: 'pricing_title', label: 'Pricing page title', fallback: 'VAAD Development | Pricing' },
  { key: 'pricing_description', label: 'Pricing page description', fallback: 'Project pricing, delivery ranges, and what is included in a typical VAAD Development engagement.', type: 'textarea' },
  { key: 'contact_title', label: 'Contact page title', fallback: 'VAAD Development | Contact' },
  { key: 'contact_description', label: 'Contact page description', fallback: 'Contact VAAD Development to scope a website, internal tool, or web application build.', type: 'textarea' },
  { key: 'not_found_title', label: '404 page title', fallback: 'VAAD Development | Page not found' },
  { key: 'not_found_description', label: '404 page description', fallback: 'The page you requested could not be found.', type: 'textarea' },
];

const notFoundFields: AdminFieldDefinition[] = [
  { key: 'heading', label: 'Heading', fallback: 'Page not found' },
  { key: 'description', label: 'Description', fallback: 'The route does not exist, or the page was removed while the site structure changed.', type: 'textarea' },
  { key: 'button', label: 'Button label', fallback: 'Return home' },
];

const errorBoundaryFields: AdminFieldDefinition[] = [
  { key: 'title', label: 'Title', fallback: 'Something went wrong' },
  { key: 'description', label: 'Description', fallback: 'An unexpected error occurred. Please refresh the page.', type: 'textarea' },
  { key: 'button', label: 'Button label', fallback: 'Refresh Page' },
];

const introSplashFields: AdminFieldDefinition[] = [
  { key: 'tagline', label: 'Tagline', fallback: 'Development' },
];

const contactFormFields: AdminFieldDefinition[] = [
  { key: 'honeypot_label', label: 'Honeypot label', fallback: 'Website' },
  { key: 'name_label', label: 'Name label', fallback: 'Name' },
  { key: 'name_placeholder', label: 'Name placeholder', fallback: 'Your name' },
  { key: 'email_label', label: 'Email label', fallback: 'Email' },
  { key: 'email_placeholder', label: 'Email placeholder', fallback: 'you@company.com' },
  { key: 'phone_label', label: 'Phone label', fallback: 'Phone number' },
  { key: 'phone_placeholder', label: 'Phone placeholder', fallback: '+91 98765 43210' },
  { key: 'phone_help', label: 'Phone help text', fallback: 'Optional. Include the country code so we can reach you on WhatsApp or by phone.', type: 'textarea' },
  { key: 'company_label', label: 'Company label', fallback: 'Company or brand' },
  { key: 'company_placeholder', label: 'Company placeholder', fallback: 'Optional' },
  { key: 'project_type_label', label: 'Project type label', fallback: 'Project type' },
  { key: 'budget_range_label', label: 'Budget range label', fallback: 'Budget range' },
  { key: 'select_placeholder', label: 'Select placeholder', fallback: 'Select one' },
  { key: 'message_label', label: 'Message label', fallback: 'Project details' },
  { key: 'message_placeholder', label: 'Message placeholder', fallback: 'What are you building, who is it for, and what should happen next?', type: 'textarea' },
  { key: 'message_help', label: 'Message help text', fallback: 'Include launch pressure, approvals, integrations, or anything else that affects delivery.', type: 'textarea' },
  { key: 'submit_sending', label: 'Submit button (sending)', fallback: 'Sending...' },
  { key: 'submit_error_generic', label: 'Submit error (generic)', fallback: 'Something went wrong.' },
  { key: 'validation_name_required', label: 'Validation: name', fallback: 'Name is required.' },
  { key: 'validation_email_invalid', label: 'Validation: email', fallback: 'Enter a valid email address.' },
  { key: 'validation_phone_digits', label: 'Validation: phone digits', fallback: 'Phone number must contain 7 to 15 digits.' },
  { key: 'validation_phone_country_code', label: 'Validation: phone country code', fallback: 'Include a country code, for example +91.' },
  { key: 'validation_project_type_required', label: 'Validation: project type', fallback: 'Choose the type of project you need.' },
  { key: 'validation_budget_required', label: 'Validation: budget range', fallback: 'Choose a budget range.' },
  { key: 'validation_message_min', label: 'Validation: message', fallback: 'Message must be at least 10 characters.' },
  { key: 'project_type_website', label: 'Project type option: website', fallback: 'Website' },
  { key: 'project_type_web_application', label: 'Project type option: web application', fallback: 'Web Application' },
  { key: 'project_type_ecommerce', label: 'Project type option: e-commerce', fallback: 'E-commerce Store' },
  { key: 'project_type_not_sure', label: 'Project type option: not sure', fallback: 'Not sure yet' },
  { key: 'budget_range_under_500', label: 'Budget option: under 500', fallback: 'Under $500' },
  { key: 'budget_range_between_500_1500', label: 'Budget option: 500-1500', fallback: '$500-$1,500' },
  { key: 'budget_range_between_1500_3000', label: 'Budget option: 1500-3000', fallback: '$1,500-$3,000' },
  { key: 'budget_range_above_3000', label: 'Budget option: above 3000', fallback: '$3,000+' },
  { key: 'budget_range_lets_discuss', label: 'Budget option: lets discuss', fallback: "Let's discuss" },
];

const teamMetaFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '05 / Team' },
  { key: 'title', label: 'Section title', fallback: 'The people behind the work' },
  { key: 'subtitle', label: 'Section subtitle', fallback: 'A compact team that scopes, designs, builds, and launches without handoff fog.', type: 'textarea' },
];

const pricingFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '06 / Pricing' },
  { key: 'title', label: 'Section title', fallback: 'Transparent pricing' },
  { key: 'subtitle', label: 'Section subtitle', fallback: 'Clear ranges for common scopes. Final pricing depends on content volume, integrations, and operational complexity.', type: 'textarea' },
  { key: 'popular_badge', label: 'Popular badge label', fallback: 'Popular' },
  { key: 'plan_button', label: 'Plan button label', fallback: 'Get Started' },
  { key: 'plan_count', label: 'Number of pricing plans', fallback: String(pricingDefaults.length), type: 'text', description: 'Set the number of pricing plans to display (1-4).' },
  ...pricingDefaults.flatMap((plan, index) => {
    const number = index + 1;
    return [
      { key: `plan_${number}_name`, label: `Plan ${number} name`, fallback: plan.name },
      { key: `plan_${number}_price`, label: `Plan ${number} price`, fallback: plan.price },
      { key: `plan_${number}_desc`, label: `Plan ${number} description`, fallback: plan.description, type: 'textarea' as const },
      { key: `plan_${number}_features`, label: `Plan ${number} features`, fallback: plan.features, type: 'list' as const, description: 'Use | between features.' },
      { key: `plan_${number}_highlighted`, label: `Plan ${number} highlighted`, fallback: plan.highlighted, type: 'boolean' as const },
    ];
  }),
  { key: 'cta_text', label: 'CTA text', fallback: 'If the scope is unusual, we price it from the workflow backward instead of forcing it into a generic package.', type: 'textarea' },
  { key: 'cta_button', label: 'CTA link label', fallback: 'Request a scoped estimate' },
];

const faqFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '07 / FAQ' },
  { key: 'title', label: 'Section title', fallback: 'Common questions' },
  { key: 'faq_count', label: 'Number of FAQs', fallback: String(faqDefaults.length), type: 'text', description: 'Set the number of FAQ items to display (1-10).' },
  ...Array.from({ length: 6 }, (_, index) => {
    const fallback = faqDefaults[index];
    const number = index + 1;
    return [
      { key: `q_${number}`, label: `Question ${number}`, fallback: fallback?.question || '' },
      { key: `a_${number}`, label: `Answer ${number}`, fallback: fallback?.answer || '', type: 'textarea' as const },
    ];
  }).flat(),
];

const contactFields: AdminFieldDefinition[] = [
  { key: 'label', label: 'Section label', fallback: '08 / Contact' },
  { key: 'title', label: 'Section title', fallback: 'Tell us what needs to ship' },
  { key: 'heading', label: 'Sidebar heading', fallback: 'Share the scope, timeline, and blockers.' },
  { key: 'description', label: 'Sidebar description', fallback: 'This form is for real project inquiries. Give us the business context, what needs to be built, and what is slowing the team down today.', type: 'textarea' },
  { key: 'response_time', label: 'Response time', fallback: 'Replies within one business day' },
  { key: 'timezone', label: 'Timezone line', fallback: 'Based in India, working with remote teams globally' },
  { key: 'email', label: 'Contact email', fallback: 'hello@vaad.dev' },
  { key: 'success_title', label: 'Success title', fallback: 'Message sent' },
  { key: 'success_desc', label: 'Success description', fallback: 'Thanks. We will review the scope and reply with next steps.', type: 'textarea' },
  { key: 'submit_button', label: 'Submit button', fallback: 'Send project brief' },
];

const footerFields: AdminFieldDefinition[] = [
  { key: 'cta_title', label: 'Footer CTA title', fallback: footerDefaults.cta_title, type: 'textarea' },
  { key: 'cta_description', label: 'Footer CTA description', fallback: footerDefaults.cta_description, type: 'textarea' },
  { key: 'cta_button', label: 'Footer CTA button', fallback: footerDefaults.cta_button },
  { key: 'tagline', label: 'Footer tagline', fallback: footerDefaults.tagline, type: 'textarea' },
  { key: 'eyebrow', label: 'Footer eyebrow', fallback: footerDefaults.eyebrow },
  { key: 'explore_title', label: 'Explore column title', fallback: footerDefaults.explore_title },
  { key: 'work_title', label: 'Work column title', fallback: footerDefaults.work_title },
  { key: 'model_title', label: 'Working model column title', fallback: footerDefaults.model_title },
  { key: 'contact_title', label: 'Contact column title', fallback: footerDefaults.contact_title },
  { key: 'model_1', label: 'Working model item 1', fallback: footerDefaults.model_1 },
  { key: 'model_2', label: 'Working model item 2', fallback: footerDefaults.model_2 },
  { key: 'model_3', label: 'Working model item 3', fallback: footerDefaults.model_3 },
  { key: 'model_4', label: 'Working model item 4', fallback: footerDefaults.model_4 },
  { key: 'copyright', label: 'Copyright line', fallback: footerDefaults.copyright },
  { key: 'made_by', label: 'Bottom line', fallback: footerDefaults.made_by },
];

const workPageFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Hero eyebrow', fallback: 'Selected Work' },
  { key: 'title_before', label: 'Hero title before highlight', fallback: 'Sites and products that had to' },
  { key: 'title_highlight', label: 'Hero highlighted title', fallback: 'ship on time' },
  { key: 'description', label: 'Hero description', fallback: 'These are the kinds of builds we take on: lean teams, real delivery pressure, and a clear need for design and engineering to move in the same sprint.', type: 'textarea' },
  { key: 'cta_title', label: 'CTA title', fallback: 'Have a build that needs traction?' },
  { key: 'cta_description', label: 'CTA description', fallback: 'We can scope the work, call out the risks, and tell you what should happen in the first release.', type: 'textarea' },
  { key: 'cta_button', label: 'CTA button label', fallback: 'Start the conversation' },
];

const servicesPageFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Hero eyebrow', fallback: 'What We Build' },
  { key: 'title_before', label: 'Hero title before highlight', fallback: 'Design and engineering for teams that need a' },
  { key: 'title_highlight', label: 'Hero highlighted title', fallback: 'working release' },
  { key: 'description', label: 'Hero description', fallback: 'We handle the interface, frontend, backend wiring, CMS setup, deployment, and the cleanup work that usually gets pushed past launch.', type: 'textarea' },
  { key: 'cta_title', label: 'CTA title', fallback: 'Need a tighter scope before you commit?' },
  { key: 'cta_description', label: 'CTA description', fallback: 'Send the requirements and we will outline the first release, constraints, and recommended stack.', type: 'textarea' },
  { key: 'cta_button', label: 'CTA button label', fallback: 'Scope my project' },
];

const processPageFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Hero eyebrow', fallback: 'How Delivery Works' },
  { key: 'title_before', label: 'Hero title before highlight', fallback: 'Clear checkpoints from brief to' },
  { key: 'title_highlight', label: 'Hero highlighted title', fallback: 'launch day' },
  { key: 'description', label: 'Hero description', fallback: 'The process is designed for speed without hidden surprises: scope first, build against decisions, then launch with a handoff that is actually usable.', type: 'textarea' },
  { key: 'cta_title', label: 'CTA title', fallback: 'Want this process on your project?' },
  { key: 'cta_description', label: 'CTA description', fallback: 'We can start with scope, risks, and a release plan before touching design or code.', type: 'textarea' },
  { key: 'cta_button', label: 'CTA button label', fallback: 'Request a project plan' },
];

const teamPageFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Hero eyebrow', fallback: 'The Team' },
  { key: 'title_before', label: 'Hero title before highlight', fallback: 'Small crew, direct accountability,' },
  { key: 'title_highlight', label: 'Hero highlighted title', fallback: 'no relay race' },
  { key: 'description', label: 'Hero description', fallback: 'The same people who scope the work stay close to implementation. That cuts down handoff loss, surprises, and vague ownership.', type: 'textarea' },
  { key: 'cta_title', label: 'CTA title', fallback: 'Need the right mix of design and engineering?' },
  { key: 'cta_description', label: 'CTA description', fallback: 'Tell us the shape of the project and we will pull in the people who should own it.', type: 'textarea' },
  { key: 'cta_button', label: 'CTA button label', fallback: 'Talk to the team' },
];

const pricingPageFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Hero eyebrow', fallback: 'Pricing' },
  { key: 'title_before', label: 'Hero title before highlight', fallback: 'Pricing framed around delivery, not' },
  { key: 'title_highlight', label: 'Hero highlighted title', fallback: 'billable drift' },
  { key: 'description', label: 'Hero description', fallback: 'We scope around the release, the complexity, and the support needed after launch. That gives you a clearer budget before execution starts.', type: 'textarea' },
];

const contactPageFields: AdminFieldDefinition[] = [
  { key: 'eyebrow', label: 'Hero eyebrow', fallback: 'Contact' },
  { key: 'title_before', label: 'Hero title before highlight', fallback: 'Bring the requirements. We will bring a' },
  { key: 'title_highlight', label: 'Hero highlighted title', fallback: 'real plan' },
  { key: 'description', label: 'Hero description', fallback: 'Share what needs to launch, where the current setup is failing, and what kind of timeline you are working against.', type: 'textarea' },
];

export const homeSectionDefinitions: Record<string, AdminSectionDefinition> = {
  nav: {
    title: 'Navigation',
    description: 'Logo text and primary navigation labels/links used across the main website.',
    fields: navFields,
  },
  hero: {
    title: 'Hero',
    description: 'Main landing section content, stat tape, and proof card copy.',
    fields: heroFields,
  },
  marquee: {
    title: 'Marquee',
    description: 'Scrolling capability strip below the hero. Use commas to separate items.',
    fields: [{ key: 'items', label: 'Marquee items', fallback: marqueeDefaults.items, type: 'list', description: 'Comma-separated items.' }],
  },
  services: {
    title: 'Services',
    description: 'Service cards on the homepage.',
    fields: serviceFields,
  },
  techstack: {
    title: 'Capabilities',
    description: 'Capability grid and supporting tags.',
    fields: techStackFields,
  },
  stats: {
    title: 'Stats',
    description: 'Proof metrics and supporting explanations.',
    fields: statsFields,
  },
  process: {
    title: 'Process',
    description: 'Project delivery steps.',
    fields: processFields,
  },
  portfolio: {
    title: 'Work',
    description: 'Portfolio section heading and footer text. Individual projects are managed below.',
    fields: portfolioMetaFields,
  },
  team: {
    title: 'Team',
    description: 'Team section heading and repeatable member cards.',
    fields: teamMetaFields,
  },
  pricing: {
    title: 'Pricing',
    description: 'Pricing cards and CTA copy.',
    fields: pricingFields,
  },
  faq: {
    title: 'FAQ',
    description: 'Frequently asked questions on the homepage.',
    fields: faqFields,
  },
  contact: {
    title: 'Contact',
    description: 'Contact section copy, response lines, and success message.',
    fields: contactFields,
  },
  footer: {
    title: 'Footer',
    description: 'Footer CTA and supporting footer copy.',
    fields: footerFields,
  },
  ui: {
    title: 'UI',
    description: 'Global UI strings such as skip links, loading labels, and the live-content status banner.',
    fields: uiFields,
  },
  seo: {
    title: 'SEO',
    description: 'Per-page document titles and meta descriptions used for social previews and search engines.',
    fields: seoFields,
  },
  contact_form: {
    title: 'Contact Form',
    description: 'Labels, placeholders, dropdown option labels, and validation copy used in the contact form.',
    fields: contactFormFields,
  },
  not_found: {
    title: '404 Page',
    description: 'Copy shown on the not-found page.',
    fields: notFoundFields,
  },
  error_boundary: {
    title: 'Error Page',
    description: 'Copy shown when the site hits an unexpected runtime error.',
    fields: errorBoundaryFields,
  },
  intro_splash: {
    title: 'Intro Splash',
    description: 'Intro animation copy shown on first visit in a session.',
    fields: introSplashFields,
  },
  work_page: {
    title: 'Work Page',
    description: 'Hero and CTA copy for the public work page.',
    fields: workPageFields,
  },
  services_page: {
    title: 'Services Page',
    description: 'Hero and CTA copy for the services page.',
    fields: servicesPageFields,
  },
  process_page: {
    title: 'Process Page',
    description: 'Hero and CTA copy for the process page.',
    fields: processPageFields,
  },
  team_page: {
    title: 'Team Page',
    description: 'Hero and CTA copy for the public team page.',
    fields: teamPageFields,
  },
  pricing_page: {
    title: 'Pricing Page',
    description: 'Hero copy for the pricing page.',
    fields: pricingPageFields,
  },
  contact_page: {
    title: 'Contact Page',
    description: 'Hero copy for the public contact page.',
    fields: contactPageFields,
  },
};

export const portfolioCollectionDefinition: RepeatableCollectionDefinition<PortfolioFallbackItem> = {
  description: 'Showcase projects with drag-and-drop ordering, image upload, gallery images, and live URLs.',
  defaultCount: portfolioDefaults.length,
  emptyTitle: 'No portfolio projects yet.',
  fieldOrder: ['tag', 'name', 'subtitle', 'desc', 'url', 'image', 'gallery'],
  fields: [
    { key: 'tag', label: 'Project tag', fallback: '', description: 'Short category label above the project title.' },
    { key: 'name', label: 'Project name', fallback: '' },
    { key: 'subtitle', label: 'Project subtitle', fallback: '' },
    { key: 'desc', label: 'Project description', fallback: '', type: 'textarea' },
    { key: 'url', label: 'Project URL', fallback: '', type: 'url' },
    { key: 'image', label: 'Primary image', fallback: '', type: 'image' },
    { key: 'gallery', label: 'Gallery images', fallback: '', type: 'list', description: 'Managed through the gallery uploader below.' },
  ],
  getFallback: (index) => portfolioDefaults[index] || {
    tag: 'New project',
    name: `Project ${index + 1}`,
    subtitle: '',
    description: '',
    url: '',
    image: '',
    gallery: [],
  },
  itemLabel: 'Project',
  primaryField: 'name',
};

export const teamCollectionDefinition: RepeatableCollectionDefinition<TeamFallbackItem> = {
  description: 'Team cards on the homepage and team page. Add as many members as you need and reorder them.',
  defaultCount: teamDefaults.length,
  emptyTitle: 'No team members yet.',
  fieldOrder: ['name', 'initials', 'role', 'desc', 'image'],
  fields: [
    { key: 'name', label: 'Member name', fallback: '' },
    { key: 'initials', label: 'Fallback initials', fallback: '' },
    { key: 'role', label: 'Member role', fallback: '' },
    { key: 'desc', label: 'Member description', fallback: '', type: 'textarea' },
    { key: 'image', label: 'Member image', fallback: '', type: 'image' },
  ],
  getFallback: (index) => teamDefaults[index] || {
    name: `Person ${index + 1}`,
    initials: `P${index + 1}`,
    role: '',
    description: '',
    image: '',
  },
  itemLabel: 'Team member',
  primaryField: 'name',
};

export function getSectionFieldFallback(section: string, key: string) {
  return homeSectionDefinitions[section]?.fields.find((field) => field.key === key)?.fallback || '';
}
