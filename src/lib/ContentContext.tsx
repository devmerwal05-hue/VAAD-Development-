import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ContentContext, type ContentItem } from './content-context';
import { getErrorMessage } from './getErrorMessage';
import { getIndexedContentCount } from './repeatableContent';

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

  return (
    <ContentContext.Provider value={{ content, getContentValue, loading, error, projectCount, teamCount }}>
      {children}
    </ContentContext.Provider>
  );
}
