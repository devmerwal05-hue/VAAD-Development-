import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ContentContext, type ContentItem } from './content-context';
import { getErrorMessage } from './getErrorMessage';
import { getIndexedContentCount } from './repeatableContent';

const CONTENT_CACHE_KEY = 'vaad.content.cache.v1';
const REQUEST_TIMEOUT_MS = 8000;
const MAX_RETRIES = 2;

function safeReadCachedContent(): ContentItem[] {
  try {
    const raw = window.localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is ContentItem => {
        return Boolean(
          item
          && typeof item === 'object'
          && 'id' in item
          && 'section' in item
          && 'key' in item
          && 'value' in item
          && typeof (item as ContentItem).id === 'number'
          && typeof (item as ContentItem).section === 'string'
          && typeof (item as ContentItem).key === 'string'
          && typeof (item as ContentItem).value === 'string'
        );
      });
  } catch {
    return [];
  }
}

function safeWriteCachedContent(items: ContentItem[]) {
  try {
    window.localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota/unavailable errors.
  }
}

async function fetchWithTimeout(url: string, signal: AbortSignal, timeoutMs: number) {
  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), timeoutMs);

  const relayAbort = () => timeoutController.abort();
  signal.addEventListener('abort', relayAbort, { once: true });

  try {
    return await fetch(url, { signal: timeoutController.signal });
  } finally {
    window.clearTimeout(timeoutId);
    signal.removeEventListener('abort', relayAbort);
  }
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

        let lastError: unknown = null;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
          try {
            const response = await fetchWithTimeout('/api/content', controller.signal, REQUEST_TIMEOUT_MS);
            if (!response.ok) throw new Error(`Content request failed with ${response.status}`);

            const data: unknown = await response.json();
            if (!Array.isArray(data)) throw new Error('Content response was not an array.');

            setContent(data as ContentItem[]);
            setError(null);
            return;
          } catch (attemptError) {
            if ((attemptError as { name?: string }).name === 'AbortError') throw attemptError;
            lastError = attemptError;
            if (attempt < MAX_RETRIES) {
              const delayMs = 250 * (attempt + 1);
              await new Promise((resolve) => window.setTimeout(resolve, delayMs));
            }
          }
        }

        throw lastError || new Error('Unable to load content.');
      } catch (fetchError) {
        if ((fetchError as { name?: string }).name !== 'AbortError') {
          const cached = safeReadCachedContent();
          if (cached.length > 0) {
            setContent(cached);
            setError('Live content is temporarily unavailable. Showing last synced content.');
          } else {
            setError(getErrorMessage(fetchError));
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (content.length === 0) return;
    safeWriteCachedContent(content);
  }, [content]);

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
