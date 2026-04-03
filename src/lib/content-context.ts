import { createContext } from 'react';

export interface ContentItem {
  id: number;
  section: string;
  key: string;
  value: string;
  updated_at?: string;
}

export interface PortfolioProject {
  tag: string;
  name: string;
  subtitle: string;
  description: string;
  url: string;
  image: string;
  gallery: string[];
  accentColor: string;
  gradientAngle: string;
}

export interface TeamMember {
  name: string;
  initials: string;
  role: string;
  description: string;
  image: string;
  gradient: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  suffix: string;
  label: string;
  sublabel: string;
  description: string;
}

export interface HeroStat {
  value: string;
  label: string;
}

export interface TechCapability {
  name: string;
  desc: string;
  tags: string[];
}

export type ContentGetter = (section: string, key: string, fallback?: string) => string;

export interface ContentContextType {
  content: ContentItem[];
  getContentValue: ContentGetter;
  loading: boolean;
  error: string | null;
  projectCount: number;
  teamCount: number;
  portfolioProjects: PortfolioProject[];
  teamMembers: TeamMember[];
  services: ServiceItem[];
  homepageStats: StatItem[];
  heroStats: HeroStat[];
  capabilities: TechCapability[];
}

export const ContentContext = createContext<ContentContextType>({
  content: [],
  getContentValue: (_section, _key, fallback = '') => fallback,
  loading: true,
  error: null,
  projectCount: 0,
  teamCount: 0,
  portfolioProjects: [],
  teamMembers: [],
  services: [],
  homepageStats: [],
  heroStats: [],
  capabilities: [],
});
