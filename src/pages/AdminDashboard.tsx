import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Check, ExternalLink, Loader2, LogOut, Plus, RefreshCw, Save, Shield, Trash2 } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import ImageUploader from '../components/ImageUploader';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { BUDGET_RANGE_LABELS, PROJECT_TYPE_LABELS } from '../lib/contactOptions';
import { getErrorMessage } from '../lib/getErrorMessage';
import type { ContentItem } from '../lib/content-context';

type SubmissionStatus = 'archived' | 'new' | 'reviewed';
type TabId = 'submissions' | string;

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
  id: number;
  kind: 'field' | 'submission';
  label: string;
}

const SUBMISSIONS_TAB = 'submissions';
const SECTION_ORDER = ['nav', 'hero', 'marquee', 'services', 'techstack', 'stats', 'process', 'portfolio', 'team', 'pricing', 'faq', 'contact', 'footer'];
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
};

function labelForKey(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
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

  const sections = useMemo(() => {
    const available = [...new Set(content.map((item) => item.section))];
    const ordered = SECTION_ORDER.filter((section) => available.includes(section));
    const extras = available.filter((section) => !SECTION_ORDER.includes(section)).sort();
    return [...ordered, ...extras];
  }, [content]);

  const activeItems = useMemo(() => {
    if (activeTab === SUBMISSIONS_TAB) return [];
    return content
      .filter((item) => item.section === activeTab)
      .sort((left, right) => left.key.localeCompare(right.key, undefined, { numeric: true }));
  }, [activeTab, content]);

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
    const nextNumber = content.reduce((highest, item) => {
      const match = item.key.match(/^project_(\d+)_/);
      return match ? Math.max(highest, Number.parseInt(match[1], 10)) : highest;
    }, 0) + 1;
    const fields = ['name', 'subtitle', 'tag', 'desc', 'url', 'image', 'gallery'];
    try {
      const created: ContentItem[] = [];
      for (const field of fields) {
        created.push(await api<ContentItem>('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section: 'portfolio', key: `project_${nextNumber}_${field}`, value: field === 'name' ? `Project ${nextNumber}` : '' }),
        }));
      }
      setContent((current) => [...current, ...created]);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function deleteField(id: number) {
    try {
      await api('/api/content', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setContent((current) => current.filter((item) => item.id !== id));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  async function confirmDelete() {
    if (!confirmTarget) return;
    if (confirmTarget.kind === 'submission') await deleteSubmission(confirmTarget.id);
    if (confirmTarget.kind === 'field') await deleteField(confirmTarget.id);
    setConfirmTarget(null);
  }

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
        title={confirmTarget?.kind === 'submission' ? 'Delete submission?' : 'Delete content field?'}
        message={`This will permanently remove ${confirmTarget?.label || 'this item'}.`}
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
                <p className="text-[13px] text-text-tertiary">{activeItems.length} fields in this section.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTab === 'portfolio' && <button type="button" onClick={() => void createProject()} className="px-3 py-2 rounded-xl border border-[rgba(124,111,247,0.2)] text-accent inline-flex items-center gap-2"><Plus size={14} /> Add project</button>}
              </div>
            </div>

            <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-5 flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_auto] gap-3">
                <input type="text" placeholder="field_key" value={newFieldKey} onChange={(event) => setNewFieldKey(event.target.value)} className="bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(124,111,247,0.5)]" style={{ fontFamily: 'JetBrains Mono' }} />
                <input type="text" placeholder="Initial value" value={newFieldValue} onChange={(event) => setNewFieldValue(event.target.value)} className="bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(124,111,247,0.5)]" />
                <button type="button" onClick={() => void createField()} className="px-4 py-2.5 rounded-[10px] gradient-bg text-white text-[14px]">Create</button>
              </div>
            </div>

            {activeItems.length === 0 ? (
              <div className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-10 text-center text-text-tertiary">No fields in this section yet.</div>
            ) : (
              activeItems.map((item) => {
                const currentValue = editedValues[item.id] ?? item.value;
                const dirty = editedValues[item.id] !== undefined && editedValues[item.id] !== item.value;
                const saving = savingIds.has(item.id);
                const galleryValues = currentValue.split(',').map((entry) => entry.trim()).filter(Boolean);

                return (
                  <div key={item.id} className="bg-surface-1 rounded-2xl border border-[rgba(255,255,255,0.06)] p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-[14px] text-text-primary font-medium">{labelForKey(item.key)}</p>
                        <p className="text-[11px] text-text-tertiary" style={{ fontFamily: 'JetBrains Mono' }}>{item.section}.{item.key}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {dirty && !saving && <button type="button" onClick={() => void saveField(item, currentValue)} className="text-[12px] text-accent inline-flex items-center gap-1"><Save size={12} /> Save</button>}
                        {saving && <span className="text-[11px] text-text-tertiary inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving</span>}
                        <button type="button" onClick={() => setConfirmTarget({ kind: 'field', id: item.id, label: item.key })} className="text-[12px] text-red-400 inline-flex items-center gap-1"><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>

                    {isImageField(item) ? (
                      <ImageUploader value={currentValue} onChange={(url) => void saveField(item, url)} />
                    ) : (
                      <>
                        {isLongField(item, currentValue) ? (
                          <textarea rows={Math.min(8, Math.max(3, Math.ceil(currentValue.length / 90)))} value={currentValue} onChange={(event) => setEditedValues((current) => ({ ...current, [item.id]: event.target.value }))} className={`w-full bg-[rgba(255,255,255,0.03)] text-text-primary text-[14px] px-3 py-2.5 rounded-[10px] border outline-none resize-y ${dirty ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)]`} style={{ fontFamily: isGalleryField(item) ? 'JetBrains Mono' : 'DM Sans' }} />
                        ) : (
                          <input type={isUrlField(item) ? 'url' : 'text'} value={currentValue} onChange={(event) => setEditedValues((current) => ({ ...current, [item.id]: event.target.value }))} className={`w-full bg-[rgba(255,255,255,0.03)] text-[14px] px-3 py-2.5 rounded-[10px] border outline-none ${dirty ? 'border-[rgba(124,111,247,0.4)]' : 'border-[rgba(255,255,255,0.06)]'} focus:border-[rgba(124,111,247,0.5)] ${isUrlField(item) ? 'text-cyan' : 'text-text-primary'}`} style={{ fontFamily: isUrlField(item) ? 'JetBrains Mono' : 'DM Sans' }} />
                        )}

                        {isGalleryField(item) && (
                          <>
                            {galleryValues.length > 0 && <div className="flex flex-wrap gap-2">{galleryValues.map((imageUrl, index) => <img key={`${item.id}-${index}`} src={imageUrl} alt={`Gallery ${index + 1}`} className="h-[72px] w-auto rounded-lg border border-[rgba(255,255,255,0.06)] object-cover" loading="lazy" decoding="async" />)}</div>}
                            <ImageUploader value="" compact onChange={(url) => void saveField(item, [...galleryValues, url].join(','))} />
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
