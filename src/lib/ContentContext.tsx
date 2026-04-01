import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ContentContext, type ContentItem } from './content-context';
import { getErrorMessage } from './getErrorMessage';

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
    let count = 0;
    for (let index = 1; index <= 50; index += 1) {
      if (contentMap.has(`portfolio::project_${index}_name`)) count = index;
      else break;
    }
    return count;
  }, [contentMap]);

  return (
    <ContentContext.Provider value={{ content, getContentValue, loading, error, projectCount }}>
      {children}
    </ContentContext.Provider>
  );
}
