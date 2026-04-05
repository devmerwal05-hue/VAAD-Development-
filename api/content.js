import { hasSupabaseConfig } from './_config.js';
import { getSupabaseAdmin, getSupabasePublic } from './_supabase.js';
import {
  applySecurity,
  getErrorMessage,
  getRequestBody,
  hasAdminSession,
  logAdminAction,
  sanitize,
  validateEditableContentValue,
  verifyAdminSession,
} from './_security.js';

const defaultContent = [
  { section: 'nav', key: 'logo_text', value: 'VAAD' },
  { section: 'nav', key: 'link_1', value: 'Work' },
  { section: 'nav', key: 'link_1_href', value: '/work' },
  { section: 'nav', key: 'link_2', value: 'Services' },
  { section: 'nav', key: 'link_2_href', value: '/services' },
  { section: 'nav', key: 'link_3', value: 'Process' },
  { section: 'nav', key: 'link_3_href', value: '/process' },
  { section: 'nav', key: 'link_5', value: 'Pricing' },
  { section: 'nav', key: 'link_5_href', value: '/pricing' },
  { section: 'nav', key: 'link_6', value: 'Contact' },
  { section: 'nav', key: 'link_6_href', value: '/contact' },
  { section: 'hero', key: 'eyebrow', value: 'Web Design + Web App Delivery' },
  { section: 'hero', key: 'headline_line1', value: 'Small teams need fast systems' },
  { section: 'hero', key: 'headline_line2', value: 'not vague agency timelines.' },
  { section: 'hero', key: 'subheadline', value: 'Conversion-focused websites and operational web apps for teams that need a tight scope, a fast build window, and a handoff they can actually maintain.' },
  { section: 'hero', key: 'cta_primary', value: 'Start a project' },
  { section: 'hero', key: 'cta_secondary', value: 'See shipped work' },
  { section: 'hero', key: 'stat_count', value: '3' },
  { section: 'hero', key: 'stat_1_number', value: '5' },
  { section: 'hero', key: 'stat_1_label', value: 'Senior builders' },
  { section: 'hero', key: 'stat_2_number', value: '1-3' },
  { section: 'hero', key: 'stat_2_label', value: 'Week delivery' },
  { section: 'hero', key: 'stat_3_number', value: 'Always' },
  { section: 'hero', key: 'stat_3_label', value: 'Post-launch iteration' },
  { section: 'hero', key: 'proof_kicker', value: 'Live delivery board' },
  { section: 'hero', key: 'proof_title', value: 'Creative builds that still respect real deadlines.' },
  { section: 'hero', key: 'proof_description', value: 'Each release is scoped against launch pressure, content reality, and what your team can maintain after handoff.' },
  { section: 'hero', key: 'proof_image', value: '' },
  { section: 'hero', key: 'proof_location', value: 'Home' },
  { section: 'hero', key: 'featured_fallback_alt', value: 'Featured release' },
  { section: 'hero', key: 'featured_fallback_tag', value: 'Featured release' },
  { section: 'hero', key: 'featured_fallback_name', value: 'Launch-ready systems' },
  { section: 'hero', key: 'proof_panel_label', value: 'Panel' },
  { section: 'hero', key: 'scroll_hint', value: 'scroll' },
  { section: 'marquee', key: 'items', value: 'Scoped delivery,Operations dashboards,Marketing sites with real CMS,Fast launch cycles,Conversion-focused landing pages,React and TypeScript,Node and Supabase,Vercel deployment,Admin tooling' },
  { section: 'services', key: 'label', value: '01 / Services' },
  { section: 'services', key: 'title', value: 'What we build' },
  { section: 'services', key: 'subtitle', value: 'Delivery is structured around what your team actually needs to launch, maintain, and extend after handoff.' },
  { section: 'services', key: 'card_count', value: '4' },
  { section: 'services', key: 'card_1_title', value: 'High-conviction websites' },
  { section: 'services', key: 'card_1_desc', value: 'Marketing sites with strong information hierarchy, custom visuals, and a CMS handoff your team can actually maintain.' },
  { section: 'services', key: 'card_2_title', value: 'Operational web apps' },
  { section: 'services', key: 'card_2_desc', value: 'Internal tools, client dashboards, and workflow systems that reduce manual follow-up and keep teams aligned.' },
  { section: 'services', key: 'card_3_title', value: 'Commerce builds' },
  { section: 'services', key: 'card_3_desc', value: 'Stores and product funnels designed around clear merchandising, product storytelling, and mobile conversion paths.' },
  { section: 'services', key: 'card_4_title', value: 'Launch support' },
  { section: 'services', key: 'card_4_desc', value: 'Deployment, analytics, content updates, and post-launch improvements so the build keeps paying off after go-live.' },
  { section: 'techstack', key: 'label', value: '09 / Capabilities' },
  { section: 'techstack', key: 'title', value: 'How we build' },
  { section: 'techstack', key: 'subtitle', value: 'The stack is chosen around delivery speed, maintainability, and how much control your team needs after launch.' },
  { section: 'techstack', key: 'cat_count', value: '10' },
  { section: 'techstack', key: 'cat_1_name', value: 'Frontend systems' },
  { section: 'techstack', key: 'cat_1_desc', value: 'React interfaces with durable component patterns and content-aware layouts.' },
  { section: 'techstack', key: 'cat_1_tags', value: 'React, TypeScript, Routing' },
  { section: 'techstack', key: 'cat_2_name', value: 'Backend workflows' },
  { section: 'techstack', key: 'cat_2_desc', value: 'Serverless endpoints and operational logic built for forms, content, and admin tooling.' },
  { section: 'techstack', key: 'cat_2_tags', value: 'Node, Vercel Functions, Validation' },
  { section: 'techstack', key: 'cat_3_name', value: 'Data models' },
  { section: 'techstack', key: 'cat_3_desc', value: 'Supabase tables and policies shaped around actual editing, intake, and reporting needs.' },
  { section: 'techstack', key: 'cat_3_tags', value: 'Supabase, Postgres, RLS' },
  { section: 'techstack', key: 'cat_4_name', value: 'Media delivery' },
  { section: 'techstack', key: 'cat_4_desc', value: 'Storage-backed image workflows so content editors are not blocked by manual asset handling.' },
  { section: 'techstack', key: 'cat_4_tags', value: 'Storage, Caching, Optimization' },
  { section: 'techstack', key: 'cat_5_name', value: 'Integrations' },
  { section: 'techstack', key: 'cat_5_desc', value: 'Analytics, email, CRM, and ops touchpoints connected where they support the workflow.' },
  { section: 'techstack', key: 'cat_5_tags', value: 'Webhooks, Forms, Automation' },
  { section: 'techstack', key: 'cat_6_name', value: 'Deployment' },
  { section: 'techstack', key: 'cat_6_desc', value: 'Preview-to-production delivery on infrastructure that is simple to hand off and maintain.' },
  { section: 'techstack', key: 'cat_6_tags', value: 'Vercel, CDN, Rollbacks' },
  { section: 'stats', key: 'label', value: '02 / Why Us' },
  { section: 'stats', key: 'title', value: 'Why teams choose VAAD' },
  { section: 'stats', key: 'stat_count', value: '4' },
  { section: 'stats', key: 'stat_1_value', value: '7' },
  { section: 'stats', key: 'stat_1_suffix', value: '' },
  { section: 'stats', key: 'stat_1_label', value: 'Days to first milestone' },
  { section: 'stats', key: 'stat_1_sublabel', value: 'Delivery' },
  { section: 'stats', key: 'stat_1_desc', value: 'Projects start with a clearly defined first ship target instead of an open-ended discovery loop.' },
  { section: 'stats', key: 'stat_2_value', value: '48' },
  { section: 'stats', key: 'stat_2_suffix', value: 'h' },
  { section: 'stats', key: 'stat_2_label', value: 'Typical response window' },
  { section: 'stats', key: 'stat_2_sublabel', value: 'Communication' },
  { section: 'stats', key: 'stat_2_desc', value: 'You are not waiting days for a status update when decisions are blocking progress.' },
  { section: 'stats', key: 'stat_3_value', value: '90' },
  { section: 'stats', key: 'stat_3_suffix', value: '%' },
  { section: 'stats', key: 'stat_3_label', value: 'Mobile traffic share considered' },
  { section: 'stats', key: 'stat_3_sublabel', value: 'Real usage' },
  { section: 'stats', key: 'stat_3_desc', value: 'Layouts are designed around the traffic mix most small businesses actually see.' },
  { section: 'stats', key: 'stat_4_value', value: '1' },
  { section: 'stats', key: 'stat_4_suffix', value: '' },
  { section: 'stats', key: 'stat_4_label', value: 'Single accountable team' },
  { section: 'stats', key: 'stat_4_sublabel', value: 'Ownership' },
  { section: 'stats', key: 'stat_4_desc', value: 'Design, development, and launch decisions are owned by the same small team.' },
  { section: 'process', key: 'label', value: '03 / Process' },
  { section: 'process', key: 'title', value: 'How a project works' },
  { section: 'process', key: 'step_count', value: '4' },
  { section: 'process', key: 'step_1_title', value: 'Scope' },
  { section: 'process', key: 'step_1_desc', value: 'We lock the goals, pages, flows, and timeline before visuals start drifting.' },
  { section: 'process', key: 'step_2_title', value: 'Design' },
  { section: 'process', key: 'step_2_desc', value: 'Core screens and layout direction are approved early so implementation moves with fewer surprises.' },
  { section: 'process', key: 'step_3_title', value: 'Build' },
  { section: 'process', key: 'step_3_desc', value: 'The app or site is built in production-minded slices with content, analytics, and QA included.' },
  { section: 'process', key: 'step_4_title', value: 'Launch' },
  { section: 'process', key: 'step_4_desc', value: 'Deployment, walkthroughs, and next-step recommendations are delivered as part of the release.' },
  { section: 'portfolio', key: 'label', value: '04 / Work' },
  { section: 'portfolio', key: 'title', value: 'Selected work' },
  { section: 'portfolio', key: 'footer_text', value: 'Detailed breakdowns are available during discovery for projects that match your workflow, audience, and launch window.' },
  { section: 'pricing', key: 'label', value: '06 / Pricing' },
  { section: 'pricing', key: 'title', value: 'Transparent pricing' },
  { section: 'pricing', key: 'subtitle', value: 'Clear ranges for common scopes. Final pricing depends on content volume, integrations, and operational complexity.' },
  { section: 'pricing', key: 'popular_badge', value: 'Popular' },
  { section: 'pricing', key: 'plan_button', value: 'Get Started' },
  { section: 'pricing', key: 'plan_count', value: '3' },
  { section: 'pricing', key: 'plan_1_name', value: 'Starter site' },
  { section: 'pricing', key: 'plan_1_price', value: '900' },
  { section: 'pricing', key: 'plan_1_desc', value: 'For focused marketing sites that need clarity, speed, and a CMS handoff.' },
  { section: 'pricing', key: 'plan_1_features', value: 'Strategy workshop|Custom UI direction|CMS setup|Vercel deployment' },
  { section: 'pricing', key: 'plan_1_highlighted', value: 'false' },
  { section: 'pricing', key: 'plan_2_name', value: 'Growth build' },
  { section: 'pricing', key: 'plan_2_price', value: '1900' },
  { section: 'pricing', key: 'plan_2_desc', value: 'For businesses that need a stronger funnel, more pages, and clearer conversion flows.' },
  { section: 'pricing', key: 'plan_2_features', value: 'Multi-page build|Analytics setup|Structured content model|Launch QA' },
  { section: 'pricing', key: 'plan_2_highlighted', value: 'true' },
  { section: 'pricing', key: 'plan_3_name', value: 'Operational system' },
  { section: 'pricing', key: 'plan_3_price', value: '3900' },
  { section: 'pricing', key: 'plan_3_desc', value: 'For teams replacing manual workflows with a tailored internal or client-facing system.' },
  { section: 'pricing', key: 'plan_3_features', value: 'Workflow mapping|Admin dashboard|Role-aware logic|Post-launch support' },
  { section: 'pricing', key: 'plan_3_highlighted', value: 'false' },
  { section: 'pricing', key: 'cta_text', value: 'If the scope is unusual, we price it from the workflow backward instead of forcing it into a generic package.' },
  { section: 'pricing', key: 'cta_button', value: 'Request a scoped estimate' },
  { section: 'faq', key: 'label', value: '07 / FAQ' },
  { section: 'faq', key: 'title', value: 'Common questions' },
  { section: 'faq', key: 'faq_count', value: '4' },
  { section: 'faq', key: 'q_1', value: 'How fast can a project start?' },
  { section: 'faq', key: 'a_1', value: 'Once scope is agreed, work can usually start within a few days instead of waiting through a long intake cycle.' },
  { section: 'faq', key: 'q_2', value: 'Do you also handle content updates?' },
  { section: 'faq', key: 'a_2', value: 'Yes. We can structure the CMS, migrate content, or hand your team a workflow for ongoing edits.' },
  { section: 'faq', key: 'q_3', value: 'Will the site be editable after launch?' },
  { section: 'faq', key: 'a_3', value: 'That is a default expectation. Content models and admin editing should not depend on a developer for routine changes.' },
  { section: 'faq', key: 'q_4', value: 'Can you work with an existing brand?' },
  { section: 'faq', key: 'a_4', value: 'Yes. The design direction can extend an existing system or sharpen a rough one without forcing a full rebrand.' },
  { section: 'contact', key: 'label', value: '08 / Contact' },
  { section: 'contact', key: 'title', value: 'Tell us what needs to ship' },
  { section: 'contact', key: 'heading', value: 'Share the scope, timeline, and blockers.' },
  { section: 'contact', key: 'description', value: 'This form is for real project inquiries. Give us the business context, what needs to be built, and what is slowing the team down today.' },
  { section: 'contact', key: 'response_time', value: 'Replies within one business day' },
  { section: 'contact', key: 'timezone', value: 'Based in India, working with remote teams globally' },
  { section: 'contact', key: 'email', value: 'hello@vaad.dev' },
  { section: 'contact', key: 'success_title', value: 'Message sent' },
  { section: 'contact', key: 'success_desc', value: 'Thanks. We will review the scope and reply with next steps.' },
  { section: 'contact', key: 'submit_button', value: 'Send project brief' },
  { section: 'footer', key: 'cta_title', value: 'Need a site or app that can ship fast?' },
  { section: 'footer', key: 'cta_description', value: 'Share the scope, timeline, and blockers. We will reply with a clear build path instead of a placeholder message.' },
  { section: 'footer', key: 'cta_button', value: 'Start a project' },
  { section: 'footer', key: 'tagline', value: 'VAAD Development builds launch-ready websites and internal tools for small teams that need clarity, speed, and a maintainable handoff.' },
  { section: 'footer', key: 'eyebrow', value: 'Design, build, deploy, maintain' },
  { section: 'footer', key: 'explore_title', value: 'Explore' },
  { section: 'footer', key: 'work_title', value: 'What We Ship' },
  { section: 'footer', key: 'model_title', value: 'Working Model' },
  { section: 'footer', key: 'contact_title', value: 'Contact' },
  { section: 'footer', key: 'model_1', value: 'Discovery and scope in 24 hours' },
  { section: 'footer', key: 'model_2', value: 'Design and build handled by one team' },
  { section: 'footer', key: 'model_3', value: 'CMS handoff and launch support included' },
  { section: 'footer', key: 'model_4', value: 'Async-friendly collaboration for remote clients' },
  { section: 'footer', key: 'copyright', value: 'Copyright 2026 VAAD Development. All rights reserved.' },
  { section: 'footer', key: 'made_by', value: 'Built for teams that want fewer meetings and stronger execution.' },
  { section: 'work_page', key: 'eyebrow', value: 'Selected Work' },
  { section: 'work_page', key: 'title_before', value: 'Sites and products that had to' },
  { section: 'work_page', key: 'title_highlight', value: 'ship on time' },
  { section: 'work_page', key: 'description', value: 'These are the kinds of builds we take on: lean teams, real delivery pressure, and a clear need for design and engineering to move in the same sprint.' },
  { section: 'work_page', key: 'cta_title', value: 'Have a build that needs traction?' },
  { section: 'work_page', key: 'cta_description', value: 'We can scope the work, call out the risks, and tell you what should happen in the first release.' },
  { section: 'work_page', key: 'cta_button', value: 'Start the conversation' },
  { section: 'services_page', key: 'eyebrow', value: 'What We Build' },
  { section: 'services_page', key: 'title_before', value: 'Design and engineering for teams that need a' },
  { section: 'services_page', key: 'title_highlight', value: 'working release' },
  { section: 'services_page', key: 'description', value: 'We handle the interface, frontend, backend wiring, CMS setup, deployment, and the cleanup work that usually gets pushed past launch.' },
  { section: 'services_page', key: 'cta_title', value: 'Need a tighter scope before you commit?' },
  { section: 'services_page', key: 'cta_description', value: 'Send the requirements and we will outline the first release, constraints, and recommended stack.' },
  { section: 'services_page', key: 'cta_button', value: 'Scope my project' },
  { section: 'process_page', key: 'eyebrow', value: 'How Delivery Works' },
  { section: 'process_page', key: 'title_before', value: 'Clear checkpoints from brief to' },
  { section: 'process_page', key: 'title_highlight', value: 'launch day' },
  { section: 'process_page', key: 'description', value: 'The process is designed for speed without hidden surprises: scope first, build against decisions, then launch with a handoff that is actually usable.' },
  { section: 'process_page', key: 'cta_title', value: 'Want this process on your project?' },
  { section: 'process_page', key: 'cta_description', value: 'We can start with scope, risks, and a release plan before touching design or code.' },
  { section: 'process_page', key: 'cta_button', value: 'Request a project plan' },
  { section: 'pricing_page', key: 'eyebrow', value: 'Pricing' },
  { section: 'pricing_page', key: 'title_before', value: 'Pricing framed around delivery, not' },
  { section: 'pricing_page', key: 'title_highlight', value: 'billable drift' },
  { section: 'pricing_page', key: 'description', value: 'We scope around the release, the complexity, and the support needed after launch. That gives you a clearer budget before execution starts.' },
  { section: 'contact_page', key: 'eyebrow', value: 'Contact' },
  { section: 'contact_page', key: 'title_before', value: 'Bring the requirements. We will bring a' },
  { section: 'contact_page', key: 'title_highlight', value: 'real plan' },
  { section: 'contact_page', key: 'description', value: 'Share what needs to launch, where the current setup is failing, and what kind of timeline you are working against.' },

  // Admin-editable UI strings
  { section: 'nav', key: 'mobile_open_aria', value: 'Open navigation menu' },
  { section: 'nav', key: 'mobile_close_aria', value: 'Close navigation menu' },
  { section: 'portfolio', key: 'link_label_live', value: 'View live project' },
  { section: 'portfolio', key: 'link_label_internal', value: 'Internal showcase' },
  { section: 'ui', key: 'skip_to_content', value: 'Skip to content' },
  { section: 'ui', key: 'loading', value: 'Loading' },
  { section: 'ui', key: 'content_loading_banner', value: 'Loading live content from Supabase.' },
  { section: 'ui', key: 'content_error_banner', value: 'Live content is unavailable right now. Showing fallback content until Supabase is configured.' },

  // SEO titles + descriptions
  { section: 'seo', key: 'home_title', value: 'VAAD Development | Fast websites and web apps' },
  { section: 'seo', key: 'home_description', value: 'VAAD Development designs, builds, and ships conversion-focused websites and operational web apps for small teams that need momentum.' },
  { section: 'seo', key: 'work_title', value: 'VAAD Development | Selected projects' },
  { section: 'seo', key: 'work_description', value: 'Recent website and web application builds from VAAD Development, including e-commerce, operations tooling, and launch-focused product work.' },
  { section: 'seo', key: 'services_title', value: 'VAAD Development | Services' },
  { section: 'seo', key: 'services_description', value: 'Website builds, product interfaces, internal tools, and launch support from VAAD Development.' },
  { section: 'seo', key: 'process_title', value: 'VAAD Development | Process' },
  { section: 'seo', key: 'process_description', value: 'How VAAD Development scopes, designs, builds, and launches projects without losing visibility or momentum.' },
  { section: 'seo', key: 'pricing_title', value: 'VAAD Development | Pricing' },
  { section: 'seo', key: 'pricing_description', value: 'Project pricing, delivery ranges, and what is included in a typical VAAD Development engagement.' },
  { section: 'seo', key: 'contact_title', value: 'VAAD Development | Contact' },
  { section: 'seo', key: 'contact_description', value: 'Contact VAAD Development to scope a website, internal tool, or web application build.' },
  { section: 'seo', key: 'not_found_title', value: 'VAAD Development | Page not found' },
  { section: 'seo', key: 'not_found_description', value: 'The page you requested could not be found.' },

  // 404 page copy
  { section: 'not_found', key: 'heading', value: 'Page not found' },
  { section: 'not_found', key: 'description', value: 'The route does not exist, or the page was removed while the site structure changed.' },
  { section: 'not_found', key: 'button', value: 'Return home' },

  // Error boundary copy
  { section: 'error_boundary', key: 'title', value: 'Something went wrong' },
  { section: 'error_boundary', key: 'description', value: 'An unexpected error occurred. Please refresh the page.' },
  { section: 'error_boundary', key: 'button', value: 'Refresh Page' },

  // Intro splash
  { section: 'intro_splash', key: 'tagline', value: 'Development' },

  // Contact form labels, placeholders, options, and validation copy
  { section: 'contact_form', key: 'honeypot_label', value: 'Website' },
  { section: 'contact_form', key: 'name_label', value: 'Name' },
  { section: 'contact_form', key: 'name_placeholder', value: 'Your name' },
  { section: 'contact_form', key: 'email_label', value: 'Email' },
  { section: 'contact_form', key: 'email_placeholder', value: 'you@company.com' },
  { section: 'contact_form', key: 'phone_label', value: 'Phone number' },
  { section: 'contact_form', key: 'phone_placeholder', value: '+91 98765 43210' },
  { section: 'contact_form', key: 'phone_help', value: 'Optional. Include the country code so we can reach you on WhatsApp or by phone.' },
  { section: 'contact_form', key: 'company_label', value: 'Company or brand' },
  { section: 'contact_form', key: 'company_placeholder', value: 'Optional' },
  { section: 'contact_form', key: 'project_type_label', value: 'Project type' },
  { section: 'contact_form', key: 'budget_range_label', value: 'Budget range' },
  { section: 'contact_form', key: 'select_placeholder', value: 'Select one' },
  { section: 'contact_form', key: 'message_label', value: 'Project details' },
  { section: 'contact_form', key: 'message_placeholder', value: 'What are you building, who is it for, and what should happen next?' },
  { section: 'contact_form', key: 'message_help', value: 'Include launch pressure, approvals, integrations, or anything else that affects delivery.' },
  { section: 'contact_form', key: 'submit_sending', value: 'Sending...' },
  { section: 'contact_form', key: 'submit_error_generic', value: 'Something went wrong.' },
  { section: 'contact_form', key: 'validation_name_required', value: 'Name is required.' },
  { section: 'contact_form', key: 'validation_email_invalid', value: 'Enter a valid email address.' },
  { section: 'contact_form', key: 'validation_phone_digits', value: 'Phone number must contain 7 to 15 digits.' },
  { section: 'contact_form', key: 'validation_phone_country_code', value: 'Include a country code, for example +91.' },
  { section: 'contact_form', key: 'validation_project_type_required', value: 'Choose the type of project you need.' },
  { section: 'contact_form', key: 'validation_budget_required', value: 'Choose a budget range.' },
  { section: 'contact_form', key: 'validation_message_min', value: 'Message must be at least 10 characters.' },
  { section: 'contact_form', key: 'project_type_website', value: 'Website' },
  { section: 'contact_form', key: 'project_type_web_application', value: 'Web Application' },
  { section: 'contact_form', key: 'project_type_ecommerce', value: 'E-commerce Store' },
  { section: 'contact_form', key: 'project_type_not_sure', value: 'Not sure yet' },
  { section: 'contact_form', key: 'budget_range_under_500', value: 'Under $500' },
  { section: 'contact_form', key: 'budget_range_between_500_1500', value: '$500-$1,500' },
  { section: 'contact_form', key: 'budget_range_between_1500_3000', value: '$1,500-$3,000' },
  { section: 'contact_form', key: 'budget_range_above_3000', value: '$3,000+' },
  { section: 'contact_form', key: 'budget_range_lets_discuss', value: "Let's discuss" },
];

async function seedDefaultContent(supabase) {
  const { count, error: countError } = await supabase
    .from('site_content')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking content count:', countError);
    return false;
  }

  if (count > 0) {
    console.log(`Content already exists (${count} items), skipping seed.`);
    return false;
  }

  console.log('Seeding default content...');
  const { error: insertError } = await supabase
    .from('site_content')
    .upsert(
      defaultContent.map(item => ({
        section: item.section,
        key: item.key,
        value: item.value,
        updated_at: new Date().toISOString(),
      })),
      {
        onConflict: 'section,key',
        ignoreDuplicates: true,
      }
    );

  if (insertError) {
    console.error('Error seeding content:', insertError);
    return false;
  }

  console.log(`Successfully seeded ${defaultContent.length} default content items.`);
  return true;
}

export default async function handler(req, res) {
  const scope = req.method === 'GET' ? 'public' : 'admin';
  if (!applySecurity(req, res, { scope })) return;

  try {
    if (!hasSupabaseConfig()) {
      if (req.method === 'GET') {
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json([]);
      }
      return res.status(503).json({ error: 'Supabase is not configured yet.' });
    }

    if (req.method === 'GET') {
      const supabase = getSupabasePublic();
      
      try {
        // Seed using the service-role client (RLS blocks inserts on the public/anon client).
        await seedDefaultContent(getSupabaseAdmin());
      } catch (seedError) {
        console.error('Seed error (non-fatal):', seedError);
      }

      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('id, section, key, value, updated_at')
          .order('section', { ascending: true })
          .order('key', { ascending: true });

        if (error) throw error;

        res.setHeader(
          'Cache-Control',
          hasAdminSession(req)
            ? 'no-store'
            : 'public, s-maxage=60, stale-while-revalidate=300'
        );
        return res.status(200).json(data || []);
      } catch (fetchError) {
        console.error('Content fetch error:', fetchError);
        return res.status(200).json([]);
      }
    }

    if (req.method === 'PUT') {
      const auth = await verifyAdminSession(req, res);
      if (!auth) return;

      const body = getRequestBody(req, res);
      if (!body) return;
      const { id, value, expected_updated_at: expectedUpdatedAt } = body;
      if (typeof id !== 'number' || typeof value !== 'string' || !Number.isFinite(id)) {
        return res.status(400).json({ error: 'id (number) and value (string) are required.' });
      }

      const { data: current, error: currentError } = await getSupabaseAdmin()
        .from('site_content')
        .select('id, section, key, value, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (currentError) throw currentError;
      if (!current) {
        return res.status(404).json({ error: 'Content item not found.' });
      }

      if (typeof expectedUpdatedAt === 'string' && expectedUpdatedAt && expectedUpdatedAt !== current.updated_at) {
        return res.status(409).json({
          error: 'This field was updated by someone else. Refresh and try again.',
          current,
        });
      }

      const cleanValue = sanitize(value, 10000);
      const validationError = validateEditableContentValue(current.section, current.key, cleanValue);
      if (validationError) return res.status(400).json({ error: validationError });

      const { data, error } = await getSupabaseAdmin()
        .from('site_content')
        .update({ value: cleanValue, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('updated_at', current.updated_at)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return res.status(409).json({ error: 'Write conflict detected. Refresh and try again.' });
      }

      await logAdminAction(req, auth, 'content.update', {
        id,
        section: data.section,
        key: data.key,
        previous_value_length: current.value?.length ?? 0,
        next_value_length: data.value?.length ?? 0,
      });

      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const auth = await verifyAdminSession(req, res);
      if (!auth) return;

      const body = getRequestBody(req, res);
      if (!body) return;
      const { section, key, value } = body;
      if (typeof section !== 'string' || typeof key !== 'string' || typeof value !== 'string') {
        return res.status(400).json({ error: 'section, key, and value are required.' });
      }

      const cleanSection = sanitize(section, 50);
      const cleanKey = sanitize(key, 100);
      const cleanValue = sanitize(value, 10000);

      const validationError = validateEditableContentValue(cleanSection, cleanKey, cleanValue);
      if (validationError) return res.status(400).json({ error: validationError });

      const { data: existing, error: existingError } = await getSupabaseAdmin()
        .from('site_content')
        .select('id, updated_at')
        .eq('section', cleanSection)
        .eq('key', cleanKey)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existing) {
        return res.status(409).json({
          error: 'Field already exists. Update the existing field instead.',
          existing,
        });
      }

      const { data, error } = await getSupabaseAdmin()
        .from('site_content')
        .insert({
          section: cleanSection,
          key: cleanKey,
          value: cleanValue,
        })
        .select()
        .single();

      if (error) throw error;

      await logAdminAction(req, auth, 'content.create', {
        id: data.id,
        section: data.section,
        key: data.key,
        value_length: data.value?.length ?? 0,
      });

      return res.status(201).json(data);
    }

    if (req.method === 'DELETE') {
      const auth = await verifyAdminSession(req, res);
      if (!auth) return;

      const body = getRequestBody(req, res);
      if (!body) return;
      const { id, expected_updated_at: expectedUpdatedAt } = body;
      if (typeof id !== 'number' || !Number.isFinite(id)) {
        return res.status(400).json({ error: 'Valid numeric id is required' });
      }

      const { data: current, error: currentError } = await getSupabaseAdmin()
        .from('site_content')
        .select('id, section, key, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (currentError) throw currentError;
      if (!current) {
        return res.status(404).json({ error: 'Content item not found.' });
      }

      if (typeof expectedUpdatedAt === 'string' && expectedUpdatedAt && expectedUpdatedAt !== current.updated_at) {
        return res.status(409).json({
          error: 'This field changed before deletion. Refresh and try again.',
          current,
        });
      }

      const { error, count } = await getSupabaseAdmin()
        .from('site_content')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('updated_at', current.updated_at);

      if (error) throw error;
      if (!count) {
        return res.status(409).json({ error: 'Delete conflict detected. Refresh and try again.' });
      }

      await logAdminAction(req, auth, 'content.delete', {
        id,
        section: current.section,
        key: current.key,
      });

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}
