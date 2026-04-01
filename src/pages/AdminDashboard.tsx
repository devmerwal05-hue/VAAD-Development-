import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Check, ExternalLink, GripVertical, Loader2, LogOut, Plus, RefreshCw, Save, Search, Shield, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { BUDGET_RANGE_LABELS, PROJECT_TYPE_LABELS } from '../lib/contactOptions';
import { getErrorMessage } from '../lib/getErrorMessage';
import type { ContentItem } from '../lib/content-context';
import {
  homeSectionDefinitions,
  portfolioCollectionDefinition,
  teamCollectionDefinition,
} from '../lib/homeContent';
import { getIndexedContentCount, getIndexedContentGroups } from '../lib/repeatableContent';

type SubmissionStatus = 'archived' | 'new' | 'reviewed';
type TabId = 'submissions' | string;
type ManagedCollectionSection = 'portfolio' | 'team';

interface Submission {
  budget_range: keyof typeof BUDGET_RANGE_LABELS;
  company: string | null;
  created_at: string;
  email: string;
  id: number;
  message: string;
  name: string;
  phone: string | null;
  project_type: keyof typeof PROJECT_TYPE_LABELS;
  status: SubmissionStatus;
}

interface ConfirmTarget {
  id?: number;
  index?: number;
  kind: 'field' | 'submission' | 'collection_item';
  label: string;
  section?: ManagedCollectionSection;
}

interface CollectionEntry {
  fields: Record<string, ContentItem | undefined>;
  index: number;
  label: string;
  values: Record<string, string>;
}

interface DragState {
  fromIndex: number;
  section: ManagedCollectionSection;
}

const SUBMISSIONS_TAB = 'submissions';
const SECTION_ORDER = ['nav', 'hero', 'marquee', 'services', 'techstack', 'stats', 'process', 'portfolio', 'team', 'pricing', 'faq', 'contact', 'footer', 'work_page', 'services_page', 'process_page', 'team_page', 'pricing_page', 'contact_page'];
const SECTION_LABELS: Record<string, string> = {
  nav: 'Navigation',
  hero: 'Hero',
  marquee: 'Marquee',
  services: 'Services',
  techstack: 'Tech Stack',
  stats: 'Stats',
  process: 'Process',
  portfolio: 'Portfolio',
  team: 'Team',
  pricing: 'Pricing',
  faq: 'FAQ',
  contact: 'Contact',
  footer: 'Footer',
  work_page: 'Work Page',
  services_page: 'Services Page',
  process_page: 'Process Page',
  team_page: 'Team Page',
  pricing_page: 'Pricing Page',
  contact_page: 'Contact Page',
};

const collectionEditors = {
  portfolio: {
    countKey: 'project_count',
    definition: portfolioCollectionDefinition,
    prefix: 'project',
  },
  team: {
    countKey: 'member_count',
    definition: teamCollectionDefinition,
    prefix: 'member',
  },
} as const;

function labelForKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function getFallbackValue(item: unknown, key: string) {
  const value = (item as Record<string, string | string[] | undefined>)[key];
  if (Array.isArray(value)) return value.join(',');
  return value || '';
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

function isImageField(item: ContentItem) {
  return item.key.includes('image') && !item.key.includes('gallery');
}

function isGalleryField(item: ContentItem) {
  return item.key.includes('gallery');
}

function isUrlField(item: ContentItem) {
  return item.key.includes('url') || item.key.includes('href');
}

function isLongField(item: ContentItem, value: string) {
  return value.length > 90 || /desc|description|subheadline|items|gallery/.test(item.key);
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error((payload as { error?: string } | null)?.error || `Request failed with ${response.status}`);
  }
  return payload as T;
}

export default function AdminDashboard() {
  usePageMetadata({
    title: 'VAAD Development | Admin',
    description: 'Admin interface for VAAD Development content and submissions.',
    path: '/admin',
    noIndex: true,
  });

  const [password, setPassword] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabId>(SUBMISSIONS_TAB);
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Record<number, string>>({});
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(null);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [collectionBusy, setCollectionBusy] = useState<ManagedCollectionSection | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sections = useMemo(() => {
    const available = [...new Set(content.map((item) => item.section))];
    const extras = available.filter((section) => !SECTION_ORDER.includes(section)).sort();
    return [...SECTION_ORDER, ...extras];
  }, [content]);

  const activeItems = useMemo(() => {
    if (activeTab === SUBMISSIONS_TAB) return [];
    const fieldOrder = new Map(
      (homeSectionDefinitions[activeTab]?.fields || []).map((field, index) => [field.key, index]),
    );

    let items = content
      .filter((item) => item.section === activeTab)
      .filter((item) => {
        if (activeTab === 'portfolio') return !/^project_\d+_/.test(item.key) && item.key !== collectionEditors.portfolio.countKey;
        if (activeTab === 'team') return !/^member_\d+_/.test(item.key) && item.key !== collectionEditors.team.countKey;
        return true;
      })
      .sort((left, right) => {
        const leftIndex = fieldOrder.get(left.key);
        const rightIndex = fieldOrder.get(right.key);

        if (leftIndex !== undefined || rightIndex !== undefined) {
          return (leftIndex ?? Number.MAX_SAFE_INTEGER) - (rightIndex ?? Number.MAX_SAFE_INTEGER);
        }

        return left.key.localeCompare(right.key, undefined, { numeric: true });
      });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => 
        item.key.toLowerCase().includes(query) || 
        item.value.toLowerCase().includes(query)
      );
    }

    return items;
  }, [activeTab, content, searchQuery]);

  useEffect(() => {
    void (async () => {
      try {
        const session = await api<{ authenticated: boolean }>('/api/admin/session');
        if (session.authenticated) {
          setAuthenticated(true);
          await loadDashboard();
        }
      } catch {
        setAuthenticated(false);
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (activeTab !== SUBMISSIONS_TAB && !sections.includes(activeTab)) {
      setActiveTab(sections[0] || SUBMISSIONS_TAB);
    }
  }, [activeTab, sections]);

  function findContentItem(section: string, key: string) {
    return content.find((item) => item.section === section && item.key === key);
  }

  function getFieldDefinition(section: string, key: string) {
    return homeSectionDefinitions[section]?.fields.find((field) => field.key === key);
  }

  async function upsertField(section: string, key: string, value: string) {
    const existing = findContentItem(section, key);
    if (existing) {
      const updated = await api<ContentItem>('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: existing.id, value }),
      });
      setContent((current) => current.map((entry) => (entry.id === existing.id ? updated : entry)));
      return updated;
    }

    const created = await api<ContentItem>('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section, key, value }),
    });
    setContent((current) => [...current, created]);
    return created;
  }

  async function removeFieldById(id: number) {
    await api('/api/content', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setContent((current) => current.filter((item) => item.id !== id));
  }

  function getCollectionEntries(section: ManagedCollectionSection) {
    const setup = collectionEditors[section];
    const groups = getIndexedContentGroups(content, section, setup.prefix);
    const explicitCountItem = findContentItem(section, setup.countKey);
    const explicitCount = Number.parseInt(explicitCountItem?.value || '', 10);
    const fallbackCount = Math.max(
      getIndexedContentCount(content, section, setup.prefix),
      setup.definition.defaultCount,
    );
    const totalCount = Number.isNaN(explicitCount) ? fallbackCount : Math.max(0, explicitCount);

    return Array.from({ length: totalCount }, (_, index) => {
      const group = groups.find((entry) => entry.index === index + 1);
      const fallback = setup.definition.getFallback(index);
      const values = Object.fromEntries(
        setup.definition.fields.map((field) => {
          const item = group?.fields[field.key];
          return [field.key, item?.value ?? getFallbackValue(fallback, field.key)];
        }),
      );

      return {
        fields: Object.fromEntries(setup.definition.fields.map((field) => [field.key, group?.fields[field.key]])),
        index: index + 1,
        label: values[setup.definition.primaryField] || `${setup.definition.itemLabel} ${index + 1}`,
        values,
      } satisfies CollectionEntry;
    });
  }

  async function persistCollection(section: ManagedCollectionSection, entries: CollectionEntry[]) {
    const setup = collectionEditors[section];
    setCollectionBusy(section);
    setError('');
    try {
      for (let index = 0; index < entries.length; index += 1) {
        const entry = entries[index];
        for (const field of setup.definition.fields) {
          await upsertField(section, `${setup.prefix}_${index + 1}_${field.key}`, entry.values[field.key] || '');
        }
      }

      const groups = getIndexedContentGroups(content, section, setup.prefix);
      for (const group of groups) {
        if (group.index <= entries.length) continue;
        for (const item of Object.values(group.fields)) {
          if (item) await removeFieldById(item.id);
        }
      }

      await upsertField(section, setup.countKey, String(entries.length));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setCollectionBusy(null);
    }
  }

  async function addCollectionEntry(section: ManagedCollectionSection) {
    const setup = collectionEditors[section];
    const currentEntries = getCollectionEntries(section);
    const fallback = setup.definition.getFallback(currentEntries.length);
    const nextEntry: CollectionEntry = {
      fields: {},
      index: currentEntries.length + 1,
      label: getFallbackValue(fallback, setup.definition.primaryField) || `${setup.definition.itemLabel} ${currentEntries.length + 1}`,
      values: Object.fromEntries(setup.definition.fields.map((field) => [field.key, getFallbackValue(fallback, field.key)])),
    };

    await persistCollection(section, [...currentEntries, nextEntry]);
  }

  async function deleteCollectionEntry(section: ManagedCollectionSection, index: number) {
    await persistCollection(section, getCollectionEntries(section).filter((entry) => entry.index !== index));
  }

  async function reorderCollection(section: ManagedCollectionSection, fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const currentEntries = getCollectionEntries(section);
    await persistCollection(section, moveItem(currentEntries, fromIndex - 1, toIndex - 1));
  }

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [nextSubmissions, nextContent] = await Promise.all([
        api<Submission[]>('/api/contact'),
        api<ContentItem[]>(`/api/content?ts=${Date.now()}`),
      ]);
      setSubmissions(nextSubmissions);
      setContent(nextContent);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      setAuthenticated(true);
      setPassword('');
      await loadDashboard();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      await api('/api/admin/session', { method: 'DELETE' });
      setAuthenticated(false);
      setSubmissions([]);
      setContent([]);
      setEditedValues({});
      setActiveTab(SUBMISSIONS_TAB);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  async function updateSubmission(id: number, status: SubmissionStatus) {
    try {
      const updated = await api<Submission>('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      setSubmissions((current) => current.map((submission) => (submission.id === id ? updated : submission)));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function deleteSubmission(id: number) {
    try {
      await api('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setSubmissions((current) => current.filter((submission) => submission.id !== id));
      setExpandedSubmission((current) => (current === id ? null : current));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function saveField(item: ContentItem, value: string) {
    setSavingIds((current) => new Set(current).add(item.id));
    try {
      const updated = await api<ContentItem>('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, value }),
      });
      setContent((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
      setEditedValues((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSavingIds((current) => {
        const next = new Set(current);
        next.delete(item.id);
        return next;
      });
    }
  }

  async function createField() {
    if (activeTab === SUBMISSIONS_TAB || !newFieldKey.trim()) return;
    try {
      const created = await api<ContentItem>('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: activeTab, key: newFieldKey.trim(), value: newFieldValue }),
      });
      setContent((current) => [...current, created]);
      setNewFieldKey('');
      setNewFieldValue('');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function createProject() {
    await addCollectionEntry('portfolio');
  }

  async function createTeamMember() {
    await addCollectionEntry('team');
  }

  async function deleteField(id: number) {
    try {
      await removeFieldById(id);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    if (confirmTarget.kind === 'submission' && confirmTarget.id) await deleteSubmission(confirmTarget.id);
    if (confirmTarget.kind === 'field' && confirmTarget.id) await deleteField(confirmTarget.id);
    if (confirmTarget.kind === 'collection_item' && confirmTarget.section && confirmTarget.index) {
      await deleteCollectionEntry(confirmTarget.section, confirmTarget.index);
    }
    setConfirmTarget(null);
  }

  const portfolioEntries = activeTab === 'portfolio' ? getCollectionEntries('portfolio') : [];
  const teamEntries = activeTab === 'team' ? getCollectionEntries('team') : [];

  if (checkingSession) {
    return <div className="min-h-screen bg-page-bg flex items-center justify-center text-text-secondary">Checking admin session...</div>;
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-page-bg flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-surface-1 rounded-[20px] p-8 w-full max-w-[420px] border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl gradient-bg flex items-center justify-center text-white"><Shield size={18} /></div>
            <div>
              <h1 className="text-[24px] text-text-primary" style={{ fontFamily: 'Syne', fontWeight: 700 }}>Admin sign in</h1>
              <p className="text-[14px] text-text-secondary">Uses the secure admin session cookie configured on the server.</p>
            </div>
          </div>
          <form onSubmit={login} className="flex flex-col gap-4">
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              className="w-full bg-surface-2 text-text-primary text-[15px] px-4 py-3 rounded-[10px] border border-[rgba(255,255,255,0.08)] outline-none focus:border-[rgba(124,111,247,0.5)]"
            />
            {error && <p className="text-red-400 text-[13px]">{error}</p>}
            <button type="submit" disabled={loading} className="w-full gradient-bg text-white py-3 rounded-[10px] text-[15px] font-medium disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page-bg px-4 md:px-6 py-6 md:py-8" style={{ fontFamily: 'DM Sans' }}>
      <ConfirmDialog
        open={Boolean(confirmTarget)}
        title={
          confirmTarget?.kind === 'submission'
            ? 'Delete submission?'
            : confirmTarget?.kind === 'collection_item'
              ? `Delete ${confirmTarget.label}?`
              : 'Delete content field?'
        }
        message={
          confirmTarget?.kind === 'collection_item'
            ? 'This will remove the card from the live website and shift the remaining items up.'
            : `This will permanently remove ${confirmTarget?.label || 'this item'}.`
        }
        onCancel={() => setConfirmTarget(null)}
        onConfirm={() => void confirmDelete()}
      />

      <div className="max-w-[1180px] mx-auto">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-[28px] text-text-primary" style={{ fontFamily: 'Syne', fontWeight: 700 }}>VAAD admin</h1>
            <p className="text-[14px] text-text-secondary">Content and submissions, backed by secure cookie auth.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.08)] text-[13px] text-text-secondary inline-flex items-center gap-2">
              <ExternalLink size={14} /> View site
            </a>
            <button type="button" onClick={() => void loadDashboard()} disabled={loading} className="px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.08)] text-[13px] text-text-secondary inline-flex items-center gap-2 disabled:opacity-60">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
            <button type="button" onClick={() => void logout()} disabled={loading} className="px-3 py-2 rounded-xl border border-[rgba(239,68,68,0.2)] text-[13px] text-red-400 inline-flex items-center gap-2 disabled:opacity-60">
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </header>

        <div className="overflow-x-auto pb-2 mb-6">
          <div className="flex gap-2 min-w-max">
            <button type="button" onClick={() => setActiveTab(SUBMISSIONS_TAB)} className={`px-4 py-2 rounded-full text-[13px] ${activeTab === SUBMISSIONS_TAB ? 'bg-[rgba(124,111,247,0.16)] text-accent-light' : 'bg-[rgba(255,255,255,0.04)] text-text-secondary'}`}>
              Submissions ({submissions.filter((submission) => submission.status === 'new').length})
            </button>
            {sections.map((section) => (
              <button key={section} type="button" onClick={() => setActiveTab(section)} className={`px-4 py-2 rounded-full text-[13px] ${activeTab === section ? 'bg-[rgba(124,111,247,0.16)] text-accent-light' : 'bg-[rgba(255,255,255,0.04)] text-text-secondary'}`}>
                {SECTION_LABELS[section] || labelForKey(section)}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-5 p-3 rounded-xl bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-red-400 text-[13px]">{error}</div>}

        {activeTab === SUBMISSIONS_TAB ? (
          <div className="flex flex-col gap-4">
            {submissions.length === 0 ? (
              <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-10 text-center text-text-tertiary">No submissions yet.</div>
            ) : (
              submissions.map((submission) => (
                <article key={submission.id} className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] overflow-hidden">
                  <button type="button" onClick={() => setExpandedSubmission((current) => current === submission.id ? null : submission.id)} className="w-full px-5 py-4 flex flex-col gap-3 text-left md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-[15px] text-text-primary font-medium">{submission.name}</p>
                      <p className="text-[13px] text-text-secondary">{submission.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[12px]">
                      <span className="px-2.5 py-1 rounded-full bg-[rgba(124,111,247,0.12)] text-accent-light">{PROJECT_TYPE_LABELS[submission.project_type] || submission.project_type}</span>
                      <span className="px-2.5 py-1 rounded-full bg-[rgba(34,211,238,0.1)] text-cyan">{BUDGET_RANGE_LABELS[submission.budget_range] || submission.budget_range}</span>
                      <span className="px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.05)] text-text-secondary">{submission.status}</span>
                    </div>
                  </button>
                  {expandedSubmission === submission.id && (
                    <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.04)]">
                      <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><p className="text-[11px] text-text-tertiary uppercase mb-1">Company</p><p className="text-[14px] text-text-primary">{submission.company || 'Not provided'}</p></div>
                        <div><p className="text-[11px] text-text-tertiary uppercase mb-1">Phone</p><p className="text-[14px] text-text-primary">{submission.phone || 'Not provided'}</p></div>
                        <div className="md:col-span-2"><p className="text-[11px] text-text-tertiary uppercase mb-1">Message</p><p className="text-[14px] text-text-secondary leading-[1.7] bg-[rgba(255,255,255,0.02)] rounded-xl p-4 border border-[rgba(255,255,255,0.04)]">{submission.message}</p></div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {submission.status !== 'reviewed' && <button type="button" onClick={() => void updateSubmission(submission.id, 'reviewed')} className="px-3 py-2 rounded-xl border border-[rgba(124,111,247,0.25)] text-accent inline-flex items-center gap-2"><Check size={14} /> Mark reviewed</button>}
                        {submission.status !== 'archived' && <button type="button" onClick={() => void updateSubmission(submission.id, 'archived')} className="px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.1)] text-text-secondary inline-flex items-center gap-2"><Archive size={14} /> Archive</button>}
                        <button type="button" onClick={() => setConfirmTarget({ kind: 'submission', id: submission.id, label: submission.name })} className="px-3 py-2 rounded-xl border border-[rgba(239,68,68,0.2)] text-red-400 inline-flex items-center gap-2"><Trash2 size={14} /> Delete</button>
                      </div>
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-[22px] text-text-primary" style={{ fontFamily: 'Syne', fontWeight: 700 }}>{SECTION_LABELS[activeTab] || labelForKey(activeTab)}</h2>
                <p className="text-[13px] text-text-tertiary">
                  {homeSectionDefinitions[activeTab]?.description || `${activeItems.length} fields in this section.`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTab === 'portfolio' && <button type="button" onClick={() => void createProject()} disabled={Boolean(collectionBusy)} className="px-3 py-2 rounded-xl border border-[rgba(124,111,247,0.2)] text-accent inline-flex items-center gap-2 disabled:opacity-50"><Plus size={14} /> Add project</button>}
                {activeTab === 'team' && <button type="button" onClick={() => void createTeamMember()} disabled={Boolean(collectionBusy)} className="px-3 py-2 rounded-xl border border-[rgba(124,111,247,0.2)] text-accent inline-flex items-center gap-2 disabled:opacity-50"><Plus size={14} /> Add team member</button>}
              </div>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search fields by key or value..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full bg-surface-1 text-text-primary text-[14px] pl-10 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(124,111,247,0.5)]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-5 flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_auto] gap-3">
                <input type="text" placeholder="field_key" value={newFieldKey} onChange={(event) => setNewFieldKey(event.target.value)} className="bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(124,111,247,0.5)]" style={{ fontFamily: 'JetBrains Mono' }} />
                <input type="text" placeholder="Initial value" value={newFieldValue} onChange={(event) => setNewFieldValue(event.target.value)} className="bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(124,111,247,0.5)]" />
                <button type="button" onClick={() => void createField()} className="px-4 py-2.5 rounded-[10px] gradient-bg text-white text-[14px]">Create</button>
              </div>
            </div>

            {(activeTab === 'portfolio' || activeTab === 'team') && (
              <div className="flex flex-col gap-4">
                <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-5">
                  <p className="text-[14px] text-text-primary font-medium mb-2">
                    {activeTab === 'portfolio' ? 'Portfolio cards' : 'Team cards'}
                  </p>
                  <p className="text-[13px] text-text-secondary">
                    Drag cards to reorder them. Upload images directly or use image URLs. Deleting a card shifts the remaining items up.
                  </p>
                </div>

                {(activeTab === 'portfolio' ? portfolioEntries : teamEntries).length === 0 ? (
                  <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-10 text-center text-text-tertiary">
                    No {activeTab === 'portfolio' ? 'projects' : 'team members'} yet.
                  </div>
                ) : (
                  (activeTab === 'portfolio' ? portfolioEntries : teamEntries).map((entry) => {
                    const setup = collectionEditors[activeTab as ManagedCollectionSection];
                    const galleryValues = (entry.values.gallery || '').split(',').map((value) => value.trim()).filter(Boolean);

                    return (
                      <div
                        key={`${activeTab}-${entry.index}`}
                        draggable={!collectionBusy}
                        onDragStart={() => setDragState({ fromIndex: entry.index, section: activeTab as ManagedCollectionSection })}
                        onDragOver={(event) => {
                          if (dragState?.section === activeTab) event.preventDefault();
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          if (dragState?.section === activeTab) {
                            void reorderCollection(activeTab as ManagedCollectionSection, dragState.fromIndex, entry.index);
                          }
                          setDragState(null);
                        }}
                        onDragEnd={() => setDragState(null)}
                        className={`bg-surface-1 rounded-2xl border p-5 flex flex-col gap-4 ${dragState?.section === activeTab && dragState.fromIndex === entry.index ? 'border-[rgba(124,111,247,0.3)] opacity-70' : 'border-[rgba(255,255,255,0.06)]'}`}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex items-start gap-3">
                            <span className="text-text-tertiary mt-0.5"><GripVertical size={16} /></span>
                            <div>
                              <p className="text-[15px] text-text-primary font-medium">{entry.label}</p>
                              <p className="text-[11px] text-text-tertiary" style={{ fontFamily: 'JetBrains Mono' }}>
                                {setup.prefix}_{entry.index}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setConfirmTarget({ kind: 'collection_item', section: activeTab as ManagedCollectionSection, index: entry.index, label: entry.label })}
                            className="px-3 py-2 rounded-xl border border-[rgba(239,68,68,0.2)] text-red-400 inline-flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          {setup.definition.fields.filter((field) => field.key !== 'gallery').map((field) => {
                            const fieldItem = entry.fields[field.key];
                            const currentValue = editedValues[fieldItem?.id || -1] ?? entry.values[field.key];
                            const dirty = Boolean(fieldItem && editedValues[fieldItem.id] !== undefined && editedValues[fieldItem.id] !== fieldItem.value);
                            const saving = Boolean(fieldItem && savingIds.has(fieldItem.id));

                            return (
                              <div key={`${setup.prefix}-${entry.index}-${field.key}`} className={`flex flex-col gap-3 ${field.type === 'textarea' || field.type === 'image' ? 'xl:col-span-2' : ''}`}>
                                <div className="flex items-center justify-between gap-3">
                                  <div>
                                    <p className="text-[13px] text-text-primary font-medium">{field.label}</p>
                                    {field.description && <p className="text-[11px] text-text-tertiary mt-1">{field.description}</p>}
                                  </div>
                                  {fieldItem && dirty && !saving && (
                                    <button type="button" onClick={() => void saveField(fieldItem, currentValue)} className="text-[12px] text-accent inline-flex items-center gap-1"><Save size={12} /> Save</button>
                                  )}
                                  {saving && <span className="text-[11px] text-text-tertiary inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving</span>}
                                </div>

                                {field.type === 'image' ? (
                                  <ImageUploader value={currentValue} onChange={(url) => void (fieldItem ? saveField(fieldItem, url) : upsertField(activeTab, `${setup.prefix}_${entry.index}_${field.key}`, url))} />
                                ) : field.type === 'textarea' ? (
                                  <textarea
                                    rows={4}
                                    value={currentValue}
                                    onChange={(event) => {
                                      if (fieldItem) setEditedValues((current) => ({ ...current, [fieldItem.id]: event.target.value }));
                                    }}
                                    className={`w-full bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border outline-none resize-y ${dirty ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)]`}
                                  />
                                ) : (
                                  <input
                                    type={field.type === 'url' ? 'url' : 'text'}
                                    value={currentValue}
                                    onChange={(event) => {
                                      if (fieldItem) setEditedValues((current) => ({ ...current, [fieldItem.id]: event.target.value }));
                                    }}
                                    className={`w-full bg-[rgba(255,255,255,0.03)] text-[14px] px-3 py-2.5 rounded-[10px] border outline-none ${dirty ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)] ${field.type === 'url' ? 'text-cyan' : 'text-text-primary'}`}
                                    style={{ fontFamily: field.type === 'url' ? 'JetBrains Mono' : 'DM Sans' }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {activeTab === 'portfolio' && (
                          <div className="flex flex-col gap-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                            <div>
                              <p className="text-[13px] text-text-primary font-medium">Gallery images</p>
                              <p className="text-[12px] text-text-secondary mt-1">Add more screenshots for the project card.</p>
                            </div>
                            {galleryValues.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {galleryValues.map((imageUrl, index) => (
                                  <div key={`${entry.index}-${index}`} className="relative group">
                                    <img src={imageUrl} alt="" className="h-[72px] w-[96px] rounded-lg border border-[rgba(255,255,255,0.06)] object-cover" loading="lazy" decoding="async" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const fieldItem = entry.fields.gallery;
                                        if (fieldItem) {
                                          void saveField(fieldItem, galleryValues.filter((_, galleryIndex) => galleryIndex !== index).join(','));
                                        }
                                      }}
                                      className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-[rgba(0,0,0,0.7)] text-red-400"
                                      aria-label="Remove gallery image"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                            <ImageUploader
                              value=""
                              compact
                              onChange={(url) => {
                                const fieldItem = entry.fields.gallery;
                                if (fieldItem) void saveField(fieldItem, [...galleryValues, url].join(','));
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeItems.length === 0 && activeTab !== 'portfolio' && activeTab !== 'team' ? (
              <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-10 text-center text-text-tertiary">No fields in this section yet.</div>
            ) : activeItems.length > 0 ? (
              activeItems.map((item) => {
                const fieldDefinition = getFieldDefinition(item.section, item.key);
                const [localValue, setLocalValue] = useState(item.value);
                const isModified = localValue !== item.value;
                const isSaving = savingIds.has(item.id);
                
                const usesImageUploader = fieldDefinition?.type === 'image' || isImageField(item);
                const usesBooleanSelect = fieldDefinition?.type === 'boolean';
                const usesUrlInput = fieldDefinition?.type === 'url' || isUrlField(item);
                const usesGalleryEditor = (fieldDefinition?.type === 'list' && item.key.includes('gallery')) || isGalleryField(item);
                const usesTextarea = fieldDefinition?.type === 'textarea' || fieldDefinition?.type === 'list' || isLongField(item, localValue);
                const galleryValues = localValue.split(',').map((entry) => entry.trim()).filter(Boolean);

                const handleChange = (value: string) => {
                  setLocalValue(value);
                };

                const handleSave = async () => {
                  if (localValue !== item.value) {
                    setSavingIds((current) => new Set(current).add(item.id));
                    try {
                      const updated = await api<ContentItem>('/api/content', {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: item.id, value: localValue }),
                      });
                      setContent((current) => current.map((entry) => (entry.id === item.id ? updated : entry)));
                    } catch (requestError) {
                      setError(getErrorMessage(requestError));
                    } finally {
                      setSavingIds((current) => {
                        const next = new Set(current);
                        next.delete(item.id);
                        return next;
                      });
                    }
                  }
                };

                const handleKeyDown = (e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleSave();
                  }
                };

                const handlePaste = async (e: React.ClipboardEvent) => {
                  const items = e.clipboardData?.items;
                  if (!items) return;
                  
                  for (const item of items) {
                    if (item.type.startsWith('image/')) {
                      e.preventDefault();
                      const file = item.getAsFile();
                      if (file) {
                        const formData = new FormData();
                        formData.append('file', file);
                        
                        try {
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          });
                          const data = await response.json();
                          if (data.url) {
                            setLocalValue(data.url);
                          }
                        } catch (err) {
                          console.error('Upload failed:', err);
                        }
                      }
                      break;
                    }
                  }
                };

                return (
                  <div key={item.id} className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[14px] text-text-primary font-medium">{fieldDefinition?.label || labelForKey(item.key)}</p>
                        <p className="text-[11px] text-text-tertiary" style={{ fontFamily: 'JetBrains Mono' }}>{item.section}.{item.key}</p>
                        {fieldDefinition?.description && <p className="text-[12px] text-text-tertiary mt-2">{fieldDefinition.description}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        {isModified && !isSaving && (
                          <button type="button" onClick={handleSave} className="text-[12px] text-accent inline-flex items-center gap-1 hover:text-accent-light">
                            <Save size={12} /> Save
                          </button>
                        )}
                        {isSaving && <span className="text-[11px] text-text-tertiary inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving</span>}
                        <button type="button" onClick={() => setConfirmTarget({ kind: 'field', id: item.id, label: item.key })} className="text-[12px] text-red-400 inline-flex items-center gap-1 hover:text-red-300"><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>

                    {usesImageUploader ? (
                      <ImageUploader value={localValue} onChange={(url) => setLocalValue(url)} />
                    ) : usesBooleanSelect ? (
                      <select
                        value={localValue === 'true' ? 'true' : 'false'}
                        onChange={(event) => handleChange(event.target.value)}
                        onBlur={handleSave}
                        className={`w-full bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border outline-none ${isModified ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)]`}
                      >
                        <option value="false">False</option>
                        <option value="true">True</option>
                      </select>
                    ) : (
                      <>
                        {usesTextarea ? (
                          <textarea 
                            rows={Math.min(8, Math.max(3, Math.ceil(localValue.length / 90)))} 
                            value={localValue} 
                            onChange={(event) => handleChange(event.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            className={`w-full bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border outline-none resize-y ${isModified ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)]`} 
                            style={{ fontFamily: usesGalleryEditor ? 'JetBrains Mono' : 'DM Sans' }} 
                            placeholder="Type here... Paste image with Ctrl+V"
                          />
                        ) : (
                          <input 
                            type={usesUrlInput ? 'url' : 'text'} 
                            value={localValue} 
                            onChange={(event) => handleChange(event.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            onPaste={handlePaste}
                            className={`w-full bg-[rgba(255,255,255,0.03)] text-[14px] px-3 py-2.5 rounded-[10px] border outline-none ${isModified ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)] ${usesUrlInput ? 'text-cyan' : 'text-text-primary'}`} 
                            style={{ fontFamily: usesUrlInput ? 'JetBrains Mono' : 'DM Sans' }} 
                            placeholder="Type here... Paste image with Ctrl+V"
                          />
                        )}

                        {usesGalleryEditor && (
                          <>
                            {galleryValues.length > 0 && <div className="flex flex-wrap gap-2">{galleryValues.map((imgUrl: string, idx: number) => <img key={`${item.id}-${idx}`} src={imgUrl} alt={`Gallery ${idx + 1}`} className="h-[72px] w-auto rounded-lg border border-[rgba(255,255,255,0.06)] object-cover" loading="lazy" decoding="async" />)}</div>}
                            <ImageUploader value="" compact onChange={(url: string) => setLocalValue([...galleryValues, url].join(','))} />
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
