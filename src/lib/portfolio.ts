import type { ContentGetter } from './content-context';

export interface PortfolioProject {
  accentColor: string;
  accentSolid: string;
  credits: string[];
  description: string;
  gallery: string[];
  gradientAngle: string;
  image: string;
  name: string;
  subtitle: string;
  tag: string;
  url: string;
  year: string;
}

const accentColorPool = [
  'rgba(124,111,247,0.14)',
  'rgba(168,85,249,0.12)',
  'rgba(34,211,238,0.10)',
  'rgba(236,72,153,0.10)',
  'rgba(34,197,94,0.10)',
  'rgba(251,146,60,0.10)',
];

const accentSolidPool = ['#7C6FF7', '#A855F7', '#22D3EE', '#EC4899', '#22C55E', '#FB923C'];

const gradientAnglePool = ['135deg', '225deg', '315deg', '45deg', '180deg', '270deg'];

const fallbackProjects = [
  {
    credits: ['Shopify', 'Supabase', 'Framer Motion'],
    tag: 'Coffee Commerce',
    name: 'Kofi Supply',
    subtitle: 'Inventory-aware storefront',
    description: 'Catalog, subscriptions, and repeat-order flows designed for a small team that ships fast.',
    url: '',
    image: '/images/project-kofi.svg',
    gallery: ['/images/project-kofi.svg'],
    year: '2026',
  },
  {
    credits: ['React', 'Node', 'Postgres'],
    tag: 'Ops Dashboard',
    name: 'Novare',
    subtitle: 'Internal workflow system',
    description: 'Role-based admin workflows, analytics summaries, and task visibility built for daily operational use.',
    url: '',
    image: '/images/project-novare.svg',
    gallery: ['/images/project-novare.svg'],
    year: '2025',
  },
  {
    credits: ['Vite', 'Content', 'Vercel'],
    tag: 'Retail Experience',
    name: 'Solebound',
    subtitle: 'Launch-ready product site',
    description: 'A high-contrast product story with conversion-first merchandising and mobile-first browsing.',
    url: '',
    image: '/images/project-solebound.svg',
    gallery: ['/images/project-solebound.svg'],
    year: '2025',
  },
] as const;

export function buildPortfolioProjects(getContentValue: ContentGetter, projectCount: number, useFallbackCount = true): PortfolioProject[] {
  const totalProjects = useFallbackCount ? Math.max(projectCount, fallbackProjects.length) : projectCount;

  return Array.from({ length: totalProjects }, (_, index) => {
    const projectNumber = index + 1;
    const fallbackProject = fallbackProjects[index];
    const galleryValue = getContentValue('portfolio', `project_${projectNumber}_gallery`, fallbackProject?.gallery.join(',') || '');
    const creditsValue = getContentValue('portfolio', `project_${projectNumber}_credits`, fallbackProject?.credits.join(',') || '');

    return {
      accentColor: accentColorPool[index % accentColorPool.length],
      accentSolid: accentSolidPool[index % accentSolidPool.length],
      credits: creditsValue
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      description: getContentValue('portfolio', `project_${projectNumber}_desc`, fallbackProject?.description || ''),
      gallery: galleryValue
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      gradientAngle: gradientAnglePool[index % gradientAnglePool.length],
      image: getContentValue('portfolio', `project_${projectNumber}_image`, fallbackProject?.image || ''),
      name: getContentValue('portfolio', `project_${projectNumber}_name`, fallbackProject?.name || ''),
      tag: getContentValue('portfolio', `project_${projectNumber}_tag`, fallbackProject?.tag || ''),
      subtitle: getContentValue('portfolio', `project_${projectNumber}_subtitle`, fallbackProject?.subtitle || ''),
      url: getContentValue('portfolio', `project_${projectNumber}_url`, fallbackProject?.url || ''),
      year: getContentValue('portfolio', `project_${projectNumber}_year`, fallbackProject?.year || ''),
    };
  }).filter((project) => project.name);
}
