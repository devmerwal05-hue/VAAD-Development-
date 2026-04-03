import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ContentContext, type ContentItem, type PortfolioProject, type TeamMember, type ServiceItem, type StatItem, type HeroStat, type TechCapability } from './content-context';
import { getErrorMessage } from './getErrorMessage';
import { getIndexedContentCount } from './repeatableContent';
import { buildPortfolioProjects } from './portfolio';
import { teamDefaults, serviceDefaults, statsDefaults, techStackDefaults } from './homeContent';

const teamGradients = [
  'linear-gradient(135deg, #7C6FF7, #5548D9)',
  'linear-gradient(135deg, #A855F7, #7C6FF7)',
  'linear-gradient(135deg, #EC4899, #A855F7)',
  'linear-gradient(135deg, #22D3EE, #7C6FF7)',
  'linear-gradient(135deg, #FB923C, #EC4899)',
  'linear-gradient(135deg, #34D399, #22D3EE)',
];

function fallbackInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0] || '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      try {
        setError(null);
        const response = await fetch('/api/content', { signal: controller.signal });
        if (!response.ok) throw new Error(`Content request failed with ${response.status}`);

        const data: unknown = await response.json();
        if (!Array.isArray(data)) throw new Error('Content response was not an array.');

        setContent(data as ContentItem[]);
      } catch (fetchError) {
        if ((fetchError as { name?: string }).name !== 'AbortError') {
          setError(getErrorMessage(fetchError));
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    // Only listen inside an iframe (used by the admin WYSIWYG preview).
    if (window.parent === window) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== window.parent) return;

      const data = event.data as unknown;
      if (!data || typeof data !== 'object') return;

      const message = data as { type?: string; content?: unknown };
      if (message.type !== 'VAAD_ADMIN_CONTENT_UPDATE') return;
      if (!Array.isArray(message.content)) return;

      const next = (message.content as unknown[])
        .filter((item): item is { id: unknown; section: unknown; key: unknown; value: unknown } => {
          return Boolean(item && typeof item === 'object' && 'id' in item && 'section' in item && 'key' in item && 'value' in item);
        })
        .map((item) => ({
          id: typeof item.id === 'number' ? item.id : Number.NaN,
          section: typeof item.section === 'string' ? item.section : '',
          key: typeof item.key === 'string' ? item.key : '',
          value: typeof item.value === 'string' ? item.value : '',
        }))
        .filter((item) => Number.isFinite(item.id) && item.section && item.key);

      setContent(next as ContentItem[]);
      setError(null);
      setLoading(false);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const contentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of content) {
      map.set(`${item.section}::${item.key}`, item.value);
    }
    return map;
  }, [content]);

  const getContentValue = useMemo(() => {
    return (section: string, key: string, fallback = '') => contentMap.get(`${section}::${key}`) ?? fallback;
  }, [contentMap]);

  const projectCount = useMemo(() => {
    const storedCount = Number.parseInt(contentMap.get('portfolio::project_count') || '', 10);
    if (!Number.isNaN(storedCount)) return Math.max(0, storedCount);
    return getIndexedContentCount(content, 'portfolio', 'project');
  }, [content, contentMap]);

  const teamCount = useMemo(() => {
    const storedCount = Number.parseInt(contentMap.get('team::member_count') || '', 10);
    if (!Number.isNaN(storedCount)) return Math.max(0, storedCount);
    return getIndexedContentCount(content, 'team', 'member');
  }, [content, contentMap]);

  // Performance Optimization: Build repeatable content lists once here using memoization.
  // This avoids O(N) searches and repeated object allocations in component render bodies.

  const portfolioProjects = useMemo<PortfolioProject[]>(() => {
    const hasStoredCount = contentMap.has('portfolio::project_count');
    return buildPortfolioProjects(contentMap, projectCount, !hasStoredCount);
  }, [contentMap, projectCount]);

  const teamMembers = useMemo<TeamMember[]>(() => {
    const hasStoredCount = contentMap.has('team::member_count');
    const totalMembers = hasStoredCount ? teamCount : Math.max(teamCount, teamDefaults.length);

    return Array.from({ length: totalMembers }, (_, index) => {
      const memberNumber = index + 1;
      const fallback = teamDefaults[index];
      const getVal = (key: string, fb: string) => contentMap.get(`team::${key}`) ?? fb;
      const name = getVal(`member_${memberNumber}_name`, fallback?.name || '');

      return {
        name,
        initials: getVal(`member_${memberNumber}_initials`, fallback?.initials || (name ? fallbackInitials(name) : '')),
        role: getVal(`member_${memberNumber}_role`, fallback?.role || ''),
        description: getVal(`member_${memberNumber}_desc`, fallback?.description || ''),
        image: getVal(`member_${memberNumber}_image`, fallback?.image || ''),
        gradient: teamGradients[index % teamGradients.length],
      };
    }).filter((member) => member.name);
  }, [contentMap, teamCount]);

  const services = useMemo<ServiceItem[]>(() => {
    const storedCardCount = Number(contentMap.get('services::card_count') || '');
    const cardCount = (!isNaN(storedCardCount) && storedCardCount > 0) ? storedCardCount : serviceDefaults.length;

    return Array.from({ length: cardCount }, (_, index) => {
      const fallback = serviceDefaults[index];
      const getVal = (key: string, fb: string) => contentMap.get(`services::${key}`) ?? fb;
      return {
        title: getVal(`card_${index + 1}_title`, fallback?.title || ''),
        description: getVal(`card_${index + 1}_desc`, fallback?.description || ''),
      };
    }).filter(s => s.title);
  }, [contentMap]);

  const homepageStats = useMemo<StatItem[]>(() => {
    const storedStatCount = Number(contentMap.get('stats::stat_count') || '');
    const statCount = (!isNaN(storedStatCount) && storedStatCount > 0) ? storedStatCount : statsDefaults.length;

    return Array.from({ length: statCount }, (_, index) => {
      const fallback = statsDefaults[index];
      const getVal = (key: string, fb: string) => contentMap.get(`stats::${key}`) ?? fb;
      return {
        value: getVal(`stat_${index + 1}_value`, fallback?.value || ''),
        suffix: getVal(`stat_${index + 1}_suffix`, fallback?.suffix || ''),
        label: getVal(`stat_${index + 1}_label`, fallback?.label || ''),
        sublabel: getVal(`stat_${index + 1}_sublabel`, fallback?.sublabel || ''),
        description: getVal(`stat_${index + 1}_desc`, fallback?.description || ''),
      };
    }).filter(s => s.label);
  }, [contentMap]);

  const heroStats = useMemo<HeroStat[]>(() => {
    const heroStatDefaults = [
      { value: '5', label: 'Senior builders' },
      { value: '1-3', label: 'Week delivery' },
      { value: 'Always', label: 'Post-launch iteration' },
    ];
    const storedStatCount = Number(contentMap.get('hero::stat_count') || '');
    const statCount = (!isNaN(storedStatCount) && storedStatCount > 0) ? storedStatCount : heroStatDefaults.length;

    return Array.from({ length: statCount }, (_, index) => {
      const getVal = (key: string, fb: string) => contentMap.get(`hero::${key}`) ?? fb;
      return {
        value: getVal(`stat_${index + 1}_number`, heroStatDefaults[index]?.value || ''),
        label: getVal(`stat_${index + 1}_label`, heroStatDefaults[index]?.label || ''),
      };
    }).filter(s => s.value);
  }, [contentMap]);

  const capabilities = useMemo<TechCapability[]>(() => {
    const storedCategoryCount = Number(contentMap.get('techstack::cat_count') || '');
    const maxCategories = (!isNaN(storedCategoryCount) && storedCategoryCount > 0) ? storedCategoryCount : 10;

    return Array.from({ length: maxCategories }, (_, index) => {
      const categoryNumber = index + 1;
      const fallback = techStackDefaults[index];
      const getVal = (key: string, fb: string) => contentMap.get(`techstack::${key}`) ?? fb;
      const name = getVal(`cat_${categoryNumber}_name`, fallback?.name || '');
      if (!name) return null;

      return {
        name,
        desc: getVal(`cat_${categoryNumber}_desc`, fallback?.desc || ''),
        tags: getVal(`cat_${categoryNumber}_tags`, fallback?.tags.join(', ') || '')
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      };
    }).filter((c): c is TechCapability => c !== null);
  }, [contentMap]);

  return (
    <ContentContext.Provider
      value={{
        content,
        getContentValue,
        loading,
        error,
        projectCount,
        teamCount,
        portfolioProjects,
        teamMembers,
        services,
        homepageStats,
        heroStats,
        capabilities
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
