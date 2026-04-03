import type { PortfolioProject } from './content-context';

const accentColorPool = [
  'rgba(124,111,247,0.14)',
  'rgba(168,85,249,0.12)',
  'rgba(34,211,238,0.10)',
  'rgba(236,72,153,0.10)',
  'rgba(34,197,94,0.10)',
  'rgba(251,146,60,0.10)',
];

const gradientAnglePool = ['135deg', '225deg', '315deg', '45deg', '180deg', '270deg'];

export const fallbackProjects = [
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

/**
 * Builds the portfolio project list.
 * Optimization: Uses a Map for O(1) lookups instead of O(N) array searches.
 */
export function buildPortfolioProjects(
  contentMap: Map<string, string>,
  projectCount: number,
  useFallbackCount = true
): PortfolioProject[] {
  const totalProjects = useFallbackCount ? Math.max(projectCount, fallbackProjects.length) : projectCount;

  return Array.from({ length: totalProjects }, (_, index) => {
    const projectNumber = index + 1;
    const fallbackProject = fallbackProjects[index];

    const getVal = (key: string, fb: string) => contentMap.get(`portfolio::${key}`) ?? fb;

    const galleryValue = getVal(`project_${projectNumber}_gallery`, fallbackProject?.gallery.join(',') || '');

    return {
      tag: getVal(`project_${projectNumber}_tag`, fallbackProject?.tag || ''),
      name: getVal(`project_${projectNumber}_name`, fallbackProject?.name || ''),
      subtitle: getVal(`project_${projectNumber}_subtitle`, fallbackProject?.subtitle || ''),
      description: getVal(`project_${projectNumber}_desc`, fallbackProject?.description || ''),
      url: getVal(`project_${projectNumber}_url`, fallbackProject?.url || ''),
      image: getVal(`project_${projectNumber}_image`, fallbackProject?.image || ''),
      gallery: galleryValue
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean),
      accentColor: accentColorPool[index % accentColorPool.length],
      gradientAngle: gradientAnglePool[index % gradientAnglePool.length],
    };
  }).filter((project) => project.name);
}
