import { createContext } from 'react';

export interface ContentItem {
  id: number;
  section: string;
  key: string;
  value: string;
  updated_at?: string;
}

export type ContentGetter = (section: string, key: string, fallback?: string) => string;

export interface ContentContextType {
  content: ContentItem[];
  getContentValue: ContentGetter;
  loading: boolean;
  error: string | null;
  isFallbackMode: boolean;
  lastLoadedAt: number | null;
  retryContentLoad: () => void;
  projectCount: number;
  teamCount: number;
}

export const ContentContext = createContext<ContentContextType>({
  content: [],
  getContentValue: (_section, _key, fallback = '') => fallback,
  loading: true,
  error: null,
  isFallbackMode: false,
  lastLoadedAt: null,
  retryContentLoad: () => {},
  projectCount: 0,
  teamCount: 0,
});
