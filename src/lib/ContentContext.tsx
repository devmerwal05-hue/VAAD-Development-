import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ContentContext, type ContentItem } from './content-context';
import { getErrorMessage } from './getErrorMessage';
import { getIndexedContentCount } from './repeatableContent';
import { logClientEvent, logFrontendFetchError } from './clientLogger';

const CONTENT_CACHE_KEY = 'vaad_content_cache_v1';
const CONTENT_TIMEOUT_MS = 8000;
const MAX_CONTENT_FETCH_ATTEMPTS = 2;

function isContentItem(value: unknown): value is ContentItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<ContentItem>;
  return (
    typeof item.id === 'number'
    && typeof item.section === 'string'
    && typeof item.key === 'string'
    && typeof item.value === 'string'
  );
}

function readCachedContent(): ContentItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CONTENT_CACHE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isContentItem);
  } catch {
    return [];
  }
}

function writeCachedContent(content: ContentItem[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(content));
  } catch {
    // Ignore storage quota and browser privacy mode failures.
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState(false);
  const [lastLoadedAt, setLastLoadedAt] = useState<number | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const retryContentLoad = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadContent() {
      setLoading(true);
      setError(null);

      let responseContent: ContentItem[] | null = null;
      let lastFailure: unknown = null;

      for (let attempt = 1; attempt <= MAX_CONTENT_FETCH_ATTEMPTS; attempt += 1) {
        try {
          const timeoutId = window.setTimeout(() => controller.abort(), CONTENT_TIMEOUT_MS);
          let response: Response;
          try {
            response = await fetch('/api/content', {
              signal: controller.signal,
              credentials: 'same-origin',
            });
          } finally {
            window.clearTimeout(timeoutId);
          }

          if (!response.ok) {
            throw new Error(`Content request failed with ${response.status}`);
          }

          const data: unknown = await response.json();
          if (!Array.isArray(data)) {
            throw new Error('Content response was not an array.');
          }

          const normalized = data.filter(isContentItem);
          responseContent = normalized;
          break;
        } catch (fetchError) {
          if (controller.signal.aborted) {
            lastFailure = new Error('Content request timed out.');
            break;
          }

          lastFailure = fetchError;
          logClientEvent('warn', 'content.fetch.retry', {
            attempt,
            maxAttempts: MAX_CONTENT_FETCH_ATTEMPTS,
            message: getErrorMessage(fetchError),
          });

          if (attempt >= MAX_CONTENT_FETCH_ATTEMPTS) break;
        }
      }

      if (cancelled) return;

      if (responseContent) {
        setContent(responseContent);
        setIsFallbackMode(false);
        setError(null);
        setLastLoadedAt(Date.now());
        writeCachedContent(responseContent);
        setLoading(false);
        logClientEvent('info', 'content.fetch.success', {
          count: responseContent.length,
        });
        return;
      }

      const fallbackError = getErrorMessage(lastFailure);
      const cachedContent = readCachedContent();
      const usingCachedContent = cachedContent.length > 0;

      setContent(usingCachedContent ? cachedContent : []);
      setError(fallbackError);
      setIsFallbackMode(true);
      setLoading(false);
      setLastLoadedAt(usingCachedContent ? Date.now() : null);

      logFrontendFetchError('content.load', lastFailure, {
        usingCachedContent,
        cachedCount: cachedContent.length,
      });
    }

    loadContent();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [reloadToken]);

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
    <ContentContext.Provider
      value={{
        content,
        getContentValue,
        loading,
        error,
        isFallbackMode,
        lastLoadedAt,
        retryContentLoad,
        projectCount,
        teamCount,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}
