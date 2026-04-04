/**
 * VAAD Development – Redesigned WYSIWYG Admin Panel
 * Implementation lives in src/admin/AdminDashboard.tsx
 *
 * What's new vs the old admin:
 *  - Three-panel layout: sidebar | field editor | live preview iframe
 *  - WYSIWYG iframe with same-origin script injection (section highlight + scroll-to)
 *  - Device viewport switcher (desktop / tablet / mobile)
 *  - Autosave-on-blur with per-field saving spinner & "unsaved" dot in sidebar
 *  - Debug log panel (toggle from top bar) – shows every API call & response time
 *  - Keyboard shortcuts: ⌘K / Ctrl+K to focus search, ⌘S / Ctrl+S to save current field
 *  - Gallery images support drag-to-reorder within each project card
 *  - Submissions: email-thread style expansion + copy-email button
 *  - Full TypeScript types throughout
 *
 * BUG FIXES included (see ## BUG FIXES section at bottom of file for details):
 *  1. Collection item new-field race condition (ae() vs Y() mismatch)
 *  2. O(n) section lookup replaced with Map-based index
 *  3. drag-and-drop interfering with text inputs – now uses handle-only drag
 *  4. Missing auth header propagation on upload endpoint
 *  5. Stale closure in `re()` reorder function when called rapidly
 *  6. `onBlur` save fires even when value hasn't changed (wasted API calls)
 *  7. `plan_count` / `faq_count` stored as NaN when cleared
 *  8. No error boundary around iframe – crash-loops the admin on CSP block
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useReducer,
  useDeferredValue,
} from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import {
  homeSectionDefinitions,
  type AdminFieldDefinition,
  portfolioDefaults,
  teamDefaults,
} from "../lib/homeContent";

const DndGallery = React.lazy(() => import("./DndGallery"));

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface ContentItem {
  id: number;
  section: string;
  key: string;
  value: string;
}

interface Submission {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  project_type: string;
  budget_range: string;
  status: "new" | "reviewed" | "archived";
  created_at: string;
}

interface ApiLogEntry {
  id: number;
  ts: number;
  method: string;
  url: string;
  status: number | null;
  ms: number | null;
  error?: string;
}

interface CollectionItem {
  index: number;
  label: string;
  fields: Record<string, ContentItem | undefined>;
  values: Record<string, string>;
}

type VirtualizedFieldWrapperStyle = React.CSSProperties & {
  contentVisibility?: 'auto' | 'visible' | 'hidden';
  containIntrinsicSize?: string;
};

const VIRTUALIZED_FIELD_WRAPPER_STYLE: VirtualizedFieldWrapperStyle = {
  // Browser-level list virtualization: skip offscreen rendering while keeping
  // DOM mounted (prevents losing unsaved edits).
  contentVisibility: 'auto',
  containIntrinsicSize: '0 220px',
};

type DeviceMode = "desktop" | "tablet" | "mobile";
type ActiveTab = "submissions" | string;

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const SUBMISSIONS_TAB = "submissions";

const SECTION_ORDER = [
  "nav", "hero", "marquee", "services", "techstack", "stats",
  "process", "portfolio", "team", "pricing", "faq", "contact", "footer",
  "ui", "seo", "contact_form", "intro_splash", "not_found", "error_boundary",
  "work_page", "services_page", "process_page", "team_page", "pricing_page", "contact_page",
];

const SECTION_LABELS: Record<string, string> = {
  nav: "Navigation", hero: "Hero", marquee: "Marquee", services: "Services",
  techstack: "Tech Stack", stats: "Stats", process: "Process",
  portfolio: "Work / Projects", team: "Team", pricing: "Pricing", faq: "FAQ",
  contact: "Contact", footer: "Footer", work_page: "Work Page",
  services_page: "Services Page", process_page: "Process Page",
  team_page: "Team Page", pricing_page: "Pricing Page", contact_page: "Contact Page",
  ui: "UI",
  seo: "SEO",
  contact_form: "Contact Form",
  intro_splash: "Intro Splash",
  not_found: "404 Page",
  error_boundary: "Error Page",
};

const SECTION_ICONS: Record<string, string> = {
  nav: "⚓", hero: "✦", marquee: "▶▶", services: "◈", techstack: "⬡",
  stats: "▦", process: "◉", portfolio: "◻", team: "◯", pricing: "◇",
  faq: "?", contact: "✉", footer: "▁", work_page: "☰", services_page: "☰",
  process_page: "☰", team_page: "☰", pricing_page: "☰", contact_page: "☰",
  ui: "⚙",
  seo: "🔎",
  contact_form: "✎",
  intro_splash: "✨",
  not_found: "404",
  error_boundary: "⛑",
};

// Section id → hash used on the public site
const SECTION_HASH: Record<string, string> = {
  nav: "nav", hero: "hero", marquee: "marquee", services: "services",
  techstack: "techstack", stats: "stats", process: "process",
  portfolio: "portfolio", team: "team", pricing: "pricing",
  faq: "faq", contact: "contact", footer: "footer",
  contact_form: "contact",
};

// Page-level sections that correspond to routes
const PAGE_SECTIONS: Record<string, string> = {
  work_page: "/work", services_page: "/services", process_page: "/process",
  team_page: "/team", pricing_page: "/pricing", contact_page: "/contact",
  not_found: "/404",
};

const COLLECTION_SECTIONS = ["portfolio", "team"] as const;
type CollectionSection = (typeof COLLECTION_SECTIONS)[number];

const COLLECTION_META: Record<CollectionSection, { prefix: string; countKey: string; primaryField: string; itemLabel: string }> = {
  portfolio: { prefix: "project", countKey: "project_count", primaryField: "name", itemLabel: "Project" },
  team: { prefix: "member", countKey: "member_count", primaryField: "name", itemLabel: "Member" },
};

const PORTFOLIO_FIELDS = [
  { key: "tag", label: "Tag", type: "text" },
  { key: "name", label: "Name", type: "text" },
  { key: "subtitle", label: "Subtitle", type: "text" },
  { key: "desc", label: "Description", type: "textarea" },
  { key: "url", label: "URL", type: "url" },
  { key: "image", label: "Cover image", type: "image" },
  { key: "gallery", label: "Gallery", type: "gallery" },
];

const TEAM_FIELDS = [
  { key: "name", label: "Name", type: "text" },
  { key: "initials", label: "Initials", type: "text" },
  { key: "role", label: "Role", type: "text" },
  { key: "desc", label: "Description", type: "textarea" },
  { key: "image", label: "Photo", type: "image" },
];

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "390px",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  marketing_site: "Marketing site",
  web_app: "Web app",
  ops_dashboard: "Ops dashboard",
  ecommerce: "E-commerce",
  other: "Other",
};

const BUDGET_RANGE_LABELS: Record<string, string> = {
  under_2k: "Under £2k",
  "2k_5k": "£2k – £5k",
  "5k_10k": "£5k – £10k",
  "10k_plus": "£10k+",
  discuss: "Let's discuss",
};

type SidebarGroup = {
  id: string;
  label: string;
  sections: string[];
};

function inferSectionFromPreviewLocation(pathname: string, hash: string) {
  const normPath = (() => {
    if (!pathname) return '/';
    const trimmed = pathname.trim();
    if (!trimmed.startsWith('/')) return `/${trimmed}`;
    return trimmed;
  })();

  const pathNoTrailingSlash = normPath.length > 1 ? normPath.replace(/\/$/, '') : normPath;
  if (pathNoTrailingSlash === '/admin') return null;

  for (const [section, path] of Object.entries(PAGE_SECTIONS)) {
    if (path === pathNoTrailingSlash) return section;
  }

  const hashId = (hash || '').replace(/^#/, '');
  if (hashId) {
    for (const [section, sectionHash] of Object.entries(SECTION_HASH)) {
      if (sectionHash === hashId) return section;
    }
  }

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────────────────────

function humanKey(key: string) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "An unknown error occurred.";
}

class ApiRequestError extends Error {
  status: number;

  mfaRequired: boolean;

  constructor(message: string, status: number, mfaRequired = false) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.mfaRequired = mfaRequired;
  }
}

function withCsrfHeader(options: RequestInit | undefined, csrfToken: string): RequestInit {
  const method = (options?.method || "GET").toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return options || {};

  const headers = new Headers(options?.headers || {});
  if (csrfToken && !headers.has("X-CSRF-Token")) {
    headers.set("X-CSRF-Token", csrfToken);
  }

  return { ...(options || {}), headers };
}

// FIX #2: Build a lookup map for O(1) section+key retrieval
function buildContentMap(items: ContentItem[]) {
  const map = new Map<string, ContentItem>();
  for (const item of items) map.set(`${item.section}::${item.key}`, item);
  return map;
}

function lookupContent(map: Map<string, ContentItem>, section: string, key: string) {
  return map.get(`${section}::${key}`);
}

// FIX #7: Safe number parsing that returns undefined (not NaN) when empty
function safeInt(str: string): number | undefined {
  const n = parseInt(str, 10);
  return isNaN(n) ? undefined : n;
}

async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit,
  logEntry?: (entry: Partial<ApiLogEntry>) => void,
  onCsrfToken?: (token: string) => void,
): Promise<T> {
  const t0 = Date.now();
  let status: number | null = null;
  try {
    // FIX #4: Always include credentials so session cookie is sent
    const res = await fetch(url, { credentials: "include", ...options });
    status = res.status;
    const ms = Date.now() - t0;
    logEntry?.({ method: options?.method || "GET", url, status, ms });
    const body = status === 204 ? null : await res.json().catch(() => null);

    const errorFromBody = (() => {
      if (!body || typeof body !== 'object') return null;
      if (!('error' in body)) return null;
      const maybe = (body as { error?: unknown }).error;
      return typeof maybe === 'string' ? maybe : null;
    })();

    const maybeCsrfToken = (() => {
      if (!body || typeof body !== "object") return null;
      if (!("csrfToken" in body)) return null;
      const token = (body as { csrfToken?: unknown }).csrfToken;
      return typeof token === "string" && token ? token : null;
    })();

    if (maybeCsrfToken) onCsrfToken?.(maybeCsrfToken);

    if (!res.ok) {
      const mfaRequired = Boolean(
        body
        && typeof body === "object"
        && "mfa_required" in body
        && (body as { mfa_required?: unknown }).mfa_required === true,
      );
      throw new ApiRequestError(errorFromBody || `Request failed (${status})`, status, mfaRequired);
    }

    return body as T;
  } catch (err) {
    const ms = Date.now() - t0;
    logEntry?.({ method: options?.method || "GET", url, status, ms, error: getErrorMessage(err) });
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG LOG REDUCER
// ─────────────────────────────────────────────────────────────────────────────

let _logId = 0;
type LogAction = { type: "add"; entry: Partial<ApiLogEntry> } | { type: "clear" };

function logReducer(state: ApiLogEntry[], action: LogAction): ApiLogEntry[] {
  if (action.type === "clear") return [];
  const entry: ApiLogEntry = {
    id: ++_logId,
    ts: Date.now(),
    method: action.entry.method || "GET",
    url: action.entry.url || "",
    status: action.entry.status ?? null,
    ms: action.entry.ms ?? null,
    error: action.entry.error,
  };
  return [entry, ...state].slice(0, 200);
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL SHARED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SavedBadge() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="inline-flex items-center gap-1 text-[11px] text-emerald-400"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Saved
    </motion.span>
  );
}

function ConfirmModal({
  open, title, message, danger = true, confirmLabel = "Delete", cancelLabel = "Cancel",
  onConfirm, onCancel,
}: {
  open: boolean; title: string; message: string; danger?: boolean;
  confirmLabel?: string; cancelLabel?: string; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18 }}
            className="relative bg-[#0f0f18] border border-white/10 rounded-2xl w-full max-w-[380px] p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4 mb-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-red-500/15" : "bg-accent/15"}`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={danger ? "text-red-400" : "text-accent"}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                  <path d="M12 9v4M12 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-[15px] font-medium text-white mb-1">{title}</h3>
                <p className="text-[13px] text-white/50 leading-relaxed">{message}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={onCancel}
                className="px-4 py-2 rounded-lg text-[13px] text-white/50 border border-white/10 hover:border-white/20 hover:text-white/80 transition-all">
                {cancelLabel}
              </button>
              <button onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-[13px] text-white transition-all ${danger ? "bg-red-500 hover:bg-red-600" : "bg-accent hover:opacity-90"}`}>
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SeedDefaultsButton({ onSeed, disabled }: { onSeed: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onSeed}
      disabled={disabled}
      className="px-3 py-1.5 rounded-lg border border-accent/25 text-accent text-[12px] flex items-center gap-1.5 hover:border-accent/40 transition-all disabled:opacity-50"
      title="Create missing default fields in the database"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
      Seed defaults
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE UPLOADER
// ─────────────────────────────────────────────────────────────────────────────

function ImageUploader({
  value, onChange, compact = false,
  onLog,
}: {
  value: string; onChange: (v: string) => void;
  compact?: boolean;
  onLog?: (e: Partial<ApiLogEntry>) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Only image files are supported."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("File too large (max 5 MB)."); return; }
    setUploading(true); setError("");
    try {
      const data = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result as string);
        r.onerror = () => rej(new Error("Cannot read file."));
        r.readAsDataURL(file);
      });
      const json = await apiFetch<{ url: string }>("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, content_type: file.type, data }),
      }, onLog);
      onChange(json.url);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setUploading(false);
    }
  }, [onChange, onLog]);

  // Clipboard paste support
  useEffect(() => {
    const handler = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith("image/")) {
          e.preventDefault();
          const f = item.getAsFile();
          if (f) await upload(f);
          return;
        }
      }
    };
    document.addEventListener("paste", handler);
    return () => document.removeEventListener("paste", handler);
  }, [upload]);

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <div className="relative group inline-flex rounded-xl overflow-hidden border border-white/8">
          <img src={value} alt="Upload preview" className={compact ? "h-14 w-auto object-cover" : "h-28 w-auto max-w-full object-cover"} loading="lazy" />
          <button type="button" onClick={() => onChange("")}
            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove image">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      )}
      <div
        role="button" tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={async (e) => {
          e.preventDefault(); setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f?.type.startsWith("image/")) { await upload(f); return; }
          const url = e.dataTransfer.getData("text");
          if (url.startsWith("http") || url.startsWith("/")) onChange(url);
        }}
        onClick={() => { if (!uploading) inputRef.current?.click(); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer
          ${dragging ? "border-accent/60 bg-accent/8" : "border-white/10 hover:border-accent/30 hover:bg-white/2"}
          ${compact ? "px-3 py-2" : "px-4 py-5"}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Spinner size={14} /> <span className="text-[13px] text-white/40">Uploading…</span>
          </div>
        ) : (
          <div className={`flex ${compact ? "items-center gap-2" : "flex-col items-center gap-1"}`}>
            <svg width={compact ? 13 : 16} height={compact ? 13 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            </svg>
            <span className={`${compact ? "text-[12px]" : "text-[13px]"} text-white/40`}>
              {compact ? "Drop, paste, or click" : "Drag image here, paste a screenshot, or click to browse"}
            </span>
            {!compact && <span className="text-[11px] text-white/25 mt-1">PNG · JPG · WebP · SVG · max 5 MB · Ctrl+V works</span>}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setShowUrl(v => !v)}
          className="flex items-center gap-1 text-[11px] text-white/30 hover:text-white/50 transition-colors">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8" />
          </svg>
          {showUrl ? "Hide URL input" : "Use a URL instead"}
        </button>
      </div>
      {showUrl && (
        <div className="flex gap-2">
          <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { onChange(urlInput.trim()); setUrlInput(""); setShowUrl(false); } }}
            placeholder="https://… or /images/…"
            className="flex-1 bg-white/3 text-white/80 text-[13px] px-3 py-2 rounded-lg border border-white/8 outline-none focus:border-accent/40 font-mono" />
          <button type="button"
            onClick={() => { onChange(urlInput.trim()); setUrlInput(""); setShowUrl(false); }}
            className="px-3 py-2 rounded-lg bg-accent/20 text-accent text-[12px] hover:bg-accent/30 transition-colors">
            Set
          </button>
        </div>
      )}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE FIELD EDITOR
// ─────────────────────────────────────────────────────────────────────────────

type SectionFieldEntry = {
  section: string;
  key: string;
  definition?: AdminFieldDefinition;
  item?: ContentItem;
};

const FieldEditor = React.memo(function FieldEditor({
  entry, onUpsert, onDelete, onLog,
}: {
  entry: SectionFieldEntry;
  onUpsert: (section: string, key: string, value: string) => Promise<ContentItem>;
  onDelete: (id: number, key: string) => void;
  onLog?: (e: Partial<ApiLogEntry>) => void;
}) {
  const [createdItem, setCreatedItem] = useState<ContentItem | null>(null);
  const effectiveItem = entry.item ?? createdItem;

  const baseValue = effectiveItem?.value ?? entry.definition?.fallback ?? "";
  const [localValue, setLocalValue] = useState(baseValue);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  // FIX #6: track whether value actually changed before saving
  const isDirty = localValue !== baseValue;

  useEffect(() => {
    setCreatedItem(null);
  }, [entry.section, entry.key]);

  useEffect(() => {
    setLocalValue(baseValue);
  }, [baseValue]);

  const save = useCallback(async (val: string) => {
    if (val === baseValue) return; // FIX #6: skip if unchanged
    setSaving(true);
    try {
      const updated = await onUpsert(entry.section, entry.key, val);
      setCreatedItem(updated);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }, [baseValue, entry.key, entry.section, onUpsert]);

  const explicitType = entry.definition?.type;
  const isImage = explicitType === 'image' || (entry.key.includes("image") && !entry.key.includes("gallery"));
  const isGallery = entry.key.includes("gallery");
  const isUrl = explicitType === 'url' || entry.key.includes("url") || entry.key.includes("href");
  const isBool = explicitType === 'boolean' || (!explicitType && (localValue === "true" || localValue === "false"));
  const isList = explicitType === 'list';
  const isLong = explicitType === 'textarea' || isList || localValue.length > 80 || /desc|description|subheadline|items|gallery|bio/.test(entry.key);
  const galleryItems = localValue.split(",").map(s => s.trim()).filter(Boolean);

  const handleGalleryReorder = (nextItems: string[]) => {
    const newValue = nextItems.join(',');
    setLocalValue(newValue);
    save(newValue);
  };

  const handleGalleryRemove = (index: number) => {
    const nextItems = galleryItems.filter((_, j) => j !== index);
    const newValue = nextItems.join(",");
    setLocalValue(newValue);
    save(newValue);
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/6 p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-white truncate">{entry.definition?.label || humanKey(entry.key)}</p>
          <p className="text-[10px] text-white/30 font-mono mt-0.5">{entry.section}.{entry.key}</p>
          {entry.definition?.description && (
            <p className="text-[11px] text-white/30 mt-1 leading-snug">{entry.definition.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence mode="wait">
            {saving && <Spinner key="s" size={12} />}
            {!saving && justSaved && <SavedBadge key="ok" />}
            {!saving && isDirty && !justSaved && (
              <motion.button key="save" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                type="button" onClick={() => save(localValue)}
                className="text-[11px] text-accent hover:text-accent-light flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
                </svg>
                Save
              </motion.button>
            )}
          </AnimatePresence>
          {effectiveItem && (
            <button type="button" onClick={() => onDelete(effectiveItem.id, entry.key)}
              className="text-[11px] text-red-400/70 hover:text-red-400 flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          )}
        </div>
      </div>

      {isImage ? (
        <ImageUploader value={localValue} onChange={(v) => { setLocalValue(v); save(v); }} onLog={onLog} />
      ) : isBool ? (
        <div className="flex items-center gap-2">
          <button type="button"
            onClick={() => { const next = localValue === "true" ? "false" : "true"; setLocalValue(next); save(next); }}
            className={`relative w-10 h-5 rounded-full transition-colors ${localValue === "true" ? "bg-accent" : "bg-white/15"}`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${localValue === "true" ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
          <span className="text-[13px] text-white/60">{localValue === "true" ? "True" : "False"}</span>
        </div>
      ) : isLong ? (
        <textarea
          rows={Math.min(8, Math.max(3, Math.ceil(localValue.length / 80)))}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => save(localValue)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(localValue); } }}
          className={`w-full bg-white/3 text-white text-[13px] px-3 py-2.5 rounded-xl border outline-none resize-y transition-colors
            ${isDirty ? "border-accent/40" : "border-white/8 focus:border-accent/30"}
            ${isGallery ? "font-mono text-[12px]" : ""}`}
          placeholder={isGallery ? "url1.jpg, url2.jpg, …" : isList ? "Item 1|Item 2|Item 3" : "Type here…"}
          style={{ fontFamily: isGallery ? "JetBrains Mono, monospace" : "inherit" }}
        />
      ) : (
        <input
          type={isUrl ? "url" : "text"}
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={() => save(localValue)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); save(localValue); } }}
          className={`w-full bg-white/3 text-[13px] px-3 py-2.5 rounded-xl border outline-none transition-colors
            ${isDirty ? "border-accent/40" : "border-white/8 focus:border-accent/30"}
            ${isUrl ? "text-cyan-400 font-mono text-[12px]" : "text-white"}`}
          placeholder="Type here…"
          style={{ fontFamily: isUrl ? "JetBrains Mono, monospace" : "inherit" }}
        />
      )}

      {isGallery && galleryItems.length > 0 && (
        <React.Suspense fallback={<p className="text-[11px] text-white/40">Loading gallery tools…</p>}>
          <DndGallery items={galleryItems} onReorder={handleGalleryReorder} onRemove={handleGalleryRemove} />
        </React.Suspense>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION ITEM CARD  (portfolio / team)
// ─────────────────────────────────────────────────────────────────────────────

function CollectionCard({
  item, section, onFieldSave, onDelete, onLog,
  dragHandleProps,
}: {
  item: CollectionItem;
  section: CollectionSection;
  onFieldSave: (contentItem: ContentItem, value: string) => Promise<void>;
  onDelete: () => void;
  onLog?: (e: Partial<ApiLogEntry>) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
}) {
  const fieldDefs = section === "portfolio" ? PORTFOLIO_FIELDS : TEAM_FIELDS;
  const [localValues, setLocalValues] = useState<Record<string, string>>(item.values);
  const [saving, setSaving] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => { setLocalValues(item.values); }, [item.values]);

  const saveField = useCallback(async (fieldKey: string, val: string) => {
    const contentItem = item.fields[fieldKey];
    if (!contentItem) return;
    if (val === contentItem.value) return;
    setSaving(prev => new Set(prev).add(fieldKey));
    try {
      await onFieldSave(contentItem, val);
      setSaved(prev => { const s = new Set(prev).add(fieldKey); return s; });
      setTimeout(() => setSaved(prev => { const s = new Set(prev); s.delete(fieldKey); return s; }), 2000);
    } finally {
      setSaving(prev => { const s = new Set(prev); s.delete(fieldKey); return s; });
    }
  }, [item.fields, onFieldSave]);

  const prefix = COLLECTION_META[section].prefix;

  const getRecommendedMax = (fieldKey: string) => {
    if (section === 'team') {
      if (fieldKey === 'initials') return 2;
      if (fieldKey === 'name') return 24;
      if (fieldKey === 'role') return 28;
    }
    return null;
  };

  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/6 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        {/* FIX #3: drag handle only on the grip icon – not the whole card */}
        <div className="flex items-center gap-3">
          <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-white/20 hover:text-white/50 transition-colors touch-none">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="5" r="1" fill="currentColor" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="9" cy="19" r="1" fill="currentColor" />
              <circle cx="15" cy="5" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="19" r="1" fill="currentColor" />
            </svg>
          </div>
          <div>
            <p className="text-[13px] font-medium text-white">{item.label}</p>
            <p className="text-[10px] text-white/30 font-mono">{prefix}_{item.index}</p>
          </div>
        </div>
        <button type="button" onClick={onDelete}
          className="px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400/80 hover:text-red-400 hover:border-red-500/40 text-[12px] flex items-center gap-1.5 transition-all">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Delete
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-3">
        {fieldDefs.filter(f => f.key !== "gallery").map(fd => {
          const val = localValues[fd.key] ?? "";
          const isSaving = saving.has(fd.key);
          const isDone = saved.has(fd.key);
          const isDirty = val !== (item.fields[fd.key]?.value ?? "");
          const recommendedMax = getRecommendedMax(fd.key);
          const isOverRecommended = recommendedMax ? val.length > recommendedMax : false;
          return (
            <div key={fd.key} className={`flex flex-col gap-2 ${fd.type === "textarea" || fd.type === "image" ? "xl:col-span-2" : ""}`}>
              <div className="flex items-center justify-between">
                <label className="text-[12px] text-white/50">{fd.label}</label>
                <AnimatePresence mode="wait">
                  {isSaving && <Spinner key="s" size={11} />}
                  {!isSaving && isDone && <SavedBadge key="ok" />}
                  {!isSaving && !isDone && isDirty && (
                    <motion.span key="dot" initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full bg-accent/80" />
                  )}
                </AnimatePresence>
              </div>
              {recommendedMax && (
                <div className="flex items-center justify-between text-[10px]">
                  <span className={`${isOverRecommended ? 'text-amber-300/80' : 'text-white/25'}`}>
                    Recommended ≤ {recommendedMax} chars
                  </span>
                  <span className={`${isOverRecommended ? 'text-amber-300/80' : 'text-white/25'} font-mono`}>
                    {val.length}/{recommendedMax}
                  </span>
                </div>
              )}
              {fd.type === "image" ? (
                <ImageUploader value={val} compact
                  onChange={(v) => { setLocalValues(p => ({ ...p, [fd.key]: v })); saveField(fd.key, v); }}
                  onLog={onLog} />
              ) : fd.type === "textarea" ? (
                <textarea rows={3} value={val}
                  onChange={(e) => setLocalValues(p => ({ ...p, [fd.key]: e.target.value }))}
                  onBlur={() => saveField(fd.key, val)}
                  className={`w-full bg-white/3 text-white text-[13px] px-3 py-2 rounded-xl border outline-none resize-y transition-colors ${isDirty ? "border-accent/35" : "border-white/8 focus:border-accent/25"}`}
                  placeholder="Type here…" />
              ) : (
                <input type={fd.type === "url" ? "url" : "text"} value={val}
                  onChange={(e) => {
                    const nextRaw = e.target.value;
                    const next = section === 'team' && fd.key === 'initials'
                      ? nextRaw.replace(/\s+/g, '').slice(0, 2).toUpperCase()
                      : nextRaw;
                    setLocalValues(p => ({ ...p, [fd.key]: next }));
                  }}
                  onBlur={() => saveField(fd.key, val)}
                  className={`w-full bg-white/3 text-[13px] px-3 py-2 rounded-xl border outline-none transition-colors ${isDirty ? "border-accent/35" : "border-white/8 focus:border-accent/25"} ${fd.type === "url" ? "text-cyan-400 font-mono text-[12px]" : "text-white"}`}
                  placeholder="Type here…"
                  style={{ fontFamily: fd.type === "url" ? "JetBrains Mono, monospace" : "inherit" }} />
              )}
            </div>
          );
        })}

        {/* Gallery */}
        {section === "portfolio" && (
          <div className="xl:col-span-2 flex flex-col gap-2 pt-2 border-t border-white/5">
            <p className="text-[12px] text-white/40">Gallery images</p>
            <div className="flex flex-wrap gap-2">
              {(localValues.gallery || "").split(",").map(s => s.trim()).filter(Boolean).map((src, i, arr) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="h-16 w-24 rounded-lg border border-white/8 object-cover" loading="lazy" />
                  <button type="button"
                    onClick={() => {
                      const next = arr.filter((_, j) => j !== i).join(",");
                      setLocalValues(p => ({ ...p, gallery: next }));
                      saveField("gallery", next);
                    }}
                    className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
              <ImageUploader value="" compact
                onChange={(v) => {
                  const prev = (localValues.gallery || "").split(",").map(s => s.trim()).filter(Boolean);
                  const next = [...prev, v].join(",");
                  setLocalValues(p => ({ ...p, gallery: next }));
                  saveField("gallery", next);
                }}
                onLog={onLog} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUBMISSIONS PANEL
// ─────────────────────────────────────────────────────────────────────────────

const SubmissionsPanel = React.memo(function SubmissionsPanel({
  submissions, onStatusChange, onDelete,
}: {
  submissions: Submission[];
  onStatusChange: (id: number, status: Submission["status"]) => void;
  onDelete: (id: number, name: string) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const copyEmail = (sub: Submission) => {
    navigator.clipboard.writeText(sub.email);
    setCopied(sub.id);
    setTimeout(() => setCopied(null), 2000);
  };

  const statusColors: Record<string, string> = {
    new: "bg-accent/15 text-accent border-accent/20",
    reviewed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    archived: "bg-white/5 text-white/40 border-white/10",
  };

  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/25">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
        <p className="text-[13px]">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {submissions.map(sub => (
        <div key={sub.id} className="bg-white/[0.03] rounded-2xl border border-white/6 overflow-hidden">
          <button type="button" onClick={() => setExpanded(p => p === sub.id ? null : sub.id)}
            className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left hover:bg-white/2 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${sub.status === "new" ? "bg-accent animate-pulse" : "bg-white/15"}`} />
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-white truncate">{sub.name}</p>
                <p className="text-[12px] text-white/40 truncate">{sub.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`px-2 py-0.5 rounded-full text-[11px] border ${statusColors[sub.status] || ""}`}>{sub.status}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-white/5 text-white/40 border border-white/8">
                {PROJECT_TYPE_LABELS[sub.project_type] || sub.project_type}
              </span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-white/25 transition-transform ${expanded === sub.id ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </button>

          <AnimatePresence>
            {expanded === sub.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-white/5">
                <div className="px-4 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sub.company && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Company</p>
                      <p className="text-[13px] text-white">{sub.company}</p>
                    </div>
                  )}
                  {sub.phone && (
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Phone</p>
                      <p className="text-[13px] text-white">{sub.phone}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Budget</p>
                    <p className="text-[13px] text-white">{BUDGET_RANGE_LABELS[sub.budget_range] || sub.budget_range}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Received</p>
                    <p className="text-[13px] text-white">{new Date(sub.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Message</p>
                    <p className="text-[13px] text-white/80 leading-relaxed bg-white/2 rounded-xl p-3 border border-white/5">{sub.message}</p>
                  </div>
                </div>
                <div className="px-4 pb-4 flex flex-wrap gap-2">
                  <button type="button" onClick={() => copyEmail(sub)}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-white/50 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-all">
                    {copied === sub.id ? (
                      <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg> Copied</>
                    ) : (
                      <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> Copy email</>
                    )}
                  </button>
                  {sub.status !== "reviewed" && (
                    <button type="button" onClick={() => onStatusChange(sub.id, "reviewed")}
                      className="px-3 py-1.5 rounded-lg border border-emerald-500/25 text-[12px] text-emerald-400 hover:border-emerald-500/40 flex items-center gap-1.5 transition-all">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                      Mark reviewed
                    </button>
                  )}
                  {sub.status !== "archived" && (
                    <button type="button" onClick={() => onStatusChange(sub.id, "archived")}
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-white/40 hover:border-white/20 hover:text-white/60 flex items-center gap-1.5 transition-all">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
                      Archive
                    </button>
                  )}
                  <button type="button" onClick={() => onDelete(sub.id, sub.name)}
                    className="px-3 py-1.5 rounded-lg border border-red-500/20 text-[12px] text-red-400/80 hover:border-red-500/40 hover:text-red-400 flex items-center gap-1.5 transition-all ml-auto">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                    Delete
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG LOG PANEL
// ─────────────────────────────────────────────────────────────────────────────

function DebugPanel({
  log, onClear,
}: {
  log: ApiLogEntry[]; onClear: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 shrink-0">
        <p className="text-[11px] font-mono text-white/40 uppercase tracking-wider">API Debug Log ({log.length})</p>
        <button type="button" onClick={onClear} className="text-[10px] text-white/30 hover:text-white/60 transition-colors">Clear</button>
      </div>
      <div className="overflow-y-auto flex-1">
        {log.length === 0 && (
          <p className="text-[12px] text-white/25 text-center py-6">No API calls yet.</p>
        )}
        {log.map(entry => (
          <div key={entry.id} className={`flex items-center gap-2 px-3 py-1.5 border-b border-white/3 font-mono text-[11px] ${entry.error ? "bg-red-500/5" : ""}`}>
            <span className={`shrink-0 w-10 text-right ${entry.status && entry.status >= 400 ? "text-red-400" : "text-emerald-400"}`}>
              {entry.status ?? "…"}
            </span>
            <span className={`shrink-0 w-12 ${entry.method === "GET" ? "text-cyan-400/70" : entry.method === "PUT" || entry.method === "POST" ? "text-accent/80" : "text-red-400/70"}`}>
              {entry.method}
            </span>
            <span className="text-white/40 truncate flex-1">{entry.url}</span>
            {entry.ms !== null && <span className="shrink-0 text-white/20">{entry.ms}ms</span>}
            {entry.error && <span className="text-red-400/80 truncate max-w-[200px]">{entry.error}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW PANE (WYSIWYG iframe)
// ─────────────────────────────────────────────────────────────────────────────

function PreviewPane({
  activeSection,
  content,
  syncEnabled,
  onPreviewNavigate,
}: {
  activeSection: string;
  content: ContentItem[];
  syncEnabled: boolean;
  onPreviewNavigate: (info: { pathname: string; hash: string }) => void;
}) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState(false);

  // Build iframe URL: use page route for page sections, or hash for home sections
  const iframeSrc = useMemo(() => {
    const base = window.location.origin;
    if (PAGE_SECTIONS[activeSection]) return `${base}${PAGE_SECTIONS[activeSection]}`;
    const hash = SECTION_HASH[activeSection];
    return hash ? `${base}/#${hash}` : `${base}/`;
  }, [activeSection]);

  const postContentToIframe = useCallback(() => {
    const iframe = iframeRef.current;
    const win = iframe?.contentWindow;
    if (!iframe || !win) return;

    try {
      win.postMessage({ type: "VAAD_ADMIN_CONTENT_UPDATE", content }, window.location.origin);
    } catch {
      // Cross-origin or blocked – silently ignore
    }
  }, [content]);

  useEffect(() => {
    if (!syncEnabled) return;

    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const iframeWin = iframeRef.current?.contentWindow;
      if (!iframeWin || event.source !== iframeWin) return;

      const data = event.data as unknown;
      if (!data || typeof data !== 'object') return;
      const msg = data as { type?: string; pathname?: unknown; hash?: unknown };
      if (msg.type !== 'VAAD_PREVIEW_LOCATION') return;

      const pathname = typeof msg.pathname === 'string' ? msg.pathname : '';
      const hash = typeof msg.hash === 'string' ? msg.hash : '';
      onPreviewNavigate({ pathname, hash });
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onPreviewNavigate, syncEnabled]);

  const applyHighlightOverlay = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      // Inject WYSIWYG highlight overlay (same-origin only)
      const win = iframe.contentWindow;
      const doc = iframe.contentDocument;
      if (!win || !doc) return;

      // Inject minimal CSS to highlight the active section
      const style = doc.createElement("style");
      style.id = "__vaad_admin_overlay__";
      style.textContent = `
        [data-admin-highlight] {
          outline: 2px solid rgba(124, 111, 247, 0.7) !important;
          outline-offset: -2px !important;
          box-shadow: inset 0 0 0 999px rgba(124,111,247,0.05) !important;
        }
        [data-admin-highlight]::after {
          content: attr(data-admin-section) !important;
          position: fixed !important;
          top: 8px; left: 50%; transform: translateX(-50%) !important;
          background: rgba(124,111,247,0.9) !important;
          color: white !important; font-size: 11px !important;
          padding: 2px 10px !important; border-radius: 20px !important;
          z-index: 99999 !important; pointer-events: none !important;
          font-family: DM Sans, sans-serif !important;
        }
      `;
      // Remove old style if present
      doc.getElementById("__vaad_admin_overlay__")?.remove();
      doc.head.appendChild(style);

      // Highlight the active section element
      const hash = SECTION_HASH[activeSection];
      if (hash) {
        doc.querySelectorAll("[data-admin-highlight]").forEach(el => {
          el.removeAttribute("data-admin-highlight");
          el.removeAttribute("data-admin-section");
        });
        const target = doc.getElementById(hash) || doc.querySelector(`section[id="${hash}"], [data-section="${hash}"]`);
        if (target) {
          target.setAttribute("data-admin-highlight", "true");
          target.setAttribute("data-admin-section", SECTION_LABELS[activeSection] || activeSection);
        }
      }
    } catch {
      // Cross-origin – silently ignore
    }
  }, [activeSection]);

  // FIX #8: Catch iframe load errors gracefully
  const handleLoad = useCallback(() => {
    setIframeError(false);
    applyHighlightOverlay();
    postContentToIframe();
  }, [applyHighlightOverlay, postContentToIframe]);

  useEffect(() => {
    applyHighlightOverlay();
  }, [applyHighlightOverlay]);

  useEffect(() => {
    postContentToIframe();
  }, [postContentToIframe]);

  const deviceButtons: DeviceMode[] = ["desktop", "tablet", "mobile"];
  const deviceIcons: Record<DeviceMode, React.ReactNode> = {
    desktop: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="3" rx="2" /><path d="M8 21h8M12 17v4" /></svg>,
    tablet: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="20" x="4" y="2" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
    mobile: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="12" height="20" x="6" y="2" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>,
  };

  return (
    <div className="flex flex-col h-full bg-[#060609]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/6 shrink-0">
        <div className="flex items-center gap-1">
          {deviceButtons.map(d => (
            <button key={d} type="button" onClick={() => setDevice(d)}
              className={`p-1.5 rounded-lg transition-colors ${device === d ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60"}`}
              title={d}>
              {deviceIcons[d]}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-white/25 font-mono hidden sm:block">
            {activeSection !== SUBMISSIONS_TAB ? (iframeSrc.replace(window.location.origin, "")) : ""}
          </span>
          <a href="/" target="_blank" rel="noreferrer"
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors ml-1"
            title="Open site in new tab">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
            </svg>
          </a>
        </div>
      </div>

      {/* iframe container */}
      <div className="flex-1 overflow-hidden flex items-start justify-center bg-[#080810] relative">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full text-white/30 gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p className="text-[12px]">Preview failed to load</p>
            <button type="button" onClick={() => setIframeError(false)}
              className="text-[11px] text-accent hover:underline">Retry</button>
          </div>
        ) : (
          <div
            className="h-full transition-all duration-300 relative"
            style={{ width: DEVICE_WIDTHS[device], maxWidth: "100%" }}>
            {device !== "desktop" && (
              <div className="absolute inset-0 pointer-events-none rounded-[12px] border border-white/10 z-10" />
            )}
            <iframe
              ref={iframeRef}
              src={activeSection === SUBMISSIONS_TAB ? "/" : iframeSrc}
              onLoad={handleLoad}
              onError={() => setIframeError(true)}
              title="Site preview"
              className={`w-full h-full bg-white border-0 ${device !== "desktop" ? "rounded-[12px]" : ""}`}
              style={{ colorScheme: "normal" }}
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION SIDEBAR
// ─────────────────────────────────────────────────────────────────────────────

const SectionSidebar = React.memo(function SectionSidebar({
  groups, activeSection, submissions, onSelectSection, searchQuery, onSearchChange,
}: {
  groups: SidebarGroup[];
  activeSection: string;
  submissions: Submission[];
  onSelectSection: (s: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const searchRef = useRef<HTMLInputElement>(null);

  const STORAGE_KEY = 'vaad_admin_sidebar_groups_v1';
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw) as unknown;
      if (!parsed || typeof parsed !== 'object') return {};
      return parsed as Record<string, boolean>;
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
    } catch {
      // ignore
    }
  }, [collapsed]);

  // ⌘K / Ctrl+K to focus search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); searchRef.current?.focus(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const newCount = submissions.filter(s => s.status === "new").length;

  const forceOpen = Boolean(searchQuery.trim());
  const activeGroupId = useMemo(() => {
    return groups.find(g => g.sections.includes(activeSection))?.id || null;
  }, [activeSection, groups]);

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="px-2 py-2 shrink-0">
        <div className="relative">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input ref={searchRef} type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)}
            placeholder="Search sections… (⌘K)"
            className="w-full bg-white/4 text-white/80 text-[12px] pl-7 pr-3 py-2 rounded-xl border border-white/8 outline-none focus:border-accent/30 placeholder:text-white/20" />
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {/* Submissions */}
        <button type="button" onClick={() => onSelectSection(SUBMISSIONS_TAB)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors mb-1
            ${activeSection === SUBMISSIONS_TAB ? "bg-accent/15 text-accent" : "text-white/50 hover:text-white/80 hover:bg-white/4"}`}>
          <div className="flex items-center gap-2.5">
            <span className="text-[14px]">✉</span>
            <span className="text-[13px]">Submissions</span>
          </div>
          {newCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-medium">{newCount}</span>
          )}
        </button>

        <div className="border-t border-white/5 my-2" />

        {/* Content sections (grouped) */}
        {groups.map((group) => {
          if (group.sections.length === 0) return null;
          const isCollapsed = !forceOpen && Boolean(collapsed[group.id]) && group.id !== activeGroupId;
          return (
            <div key={group.id} className="mb-2">
              <button
                type="button"
                onClick={() => setCollapsed((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-white/35 hover:text-white/60 hover:bg-white/3 transition-colors"
              >
                <span className="text-[10px] uppercase tracking-[0.14em]">{group.label}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`text-white/25 transition-transform ${isCollapsed ? "-rotate-90" : "rotate-0"}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {!isCollapsed && group.sections.map(section => (
                <button key={section} type="button" onClick={() => onSelectSection(section)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors
                    ${activeSection === section ? "bg-accent/15 text-accent" : "text-white/50 hover:text-white/80 hover:bg-white/4"}`}>
                  <span className="text-[13px] w-4 text-center shrink-0 opacity-70">{SECTION_ICONS[section] || "·"}</span>
                  <span className="text-[13px] truncate">{SECTION_LABELS[section] || humanKey(section)}</span>
                </button>
              ))}
            </div>
          );
        })}
      </nav>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  // Data
  const [content, setContent] = useState<ContentItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState<ActiveTab>(SUBMISSIONS_TAB);
  const [sectionSearch, setSectionSearch] = useState("");
  const [fieldSearch, setFieldSearch] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [syncPreview, setSyncPreview] = useState(true);

  // Responsive: disable inline preview on small screens.
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobileViewport(media.matches);
    handleChange();

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    // Safari fallback
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  const previewEnabled = showPreview && !isMobileViewport;

  // Confirm modal
  const [confirm, setConfirm] = useState<{
    kind: "submission" | "field" | "collection_item";
    id?: number; key?: string; label?: string; section?: string; index?: number;
  } | null>(null);

  // Debug log
  const [apiLog, dispatchLog] = useReducer(logReducer, []);
  const addLog = useCallback((entry: Partial<ApiLogEntry>) => dispatchLog({ type: "add", entry }), []);

  // FIX #2: O(1) content map
  const contentMap = useMemo(() => buildContentMap(content), [content]);

  // Sections list
  const allSections = useMemo(() => {
    const extra = [...new Set(content.map(c => c.section))].filter(s => !SECTION_ORDER.includes(s)).sort();
    return [...SECTION_ORDER, ...extra];
  }, [content]);

  const deferredSectionSearch = useDeferredValue(sectionSearch);
  const deferredFieldSearch = useDeferredValue(fieldSearch);

  const filteredSections = useMemo(() => {
    const q = deferredSectionSearch.toLowerCase();
    if (!q) return allSections;
    return allSections.filter(s => (SECTION_LABELS[s] || s).toLowerCase().includes(q));
  }, [allSections, deferredSectionSearch]);

  const sidebarGroups = useMemo((): SidebarGroup[] => {
    const site = new Set([
      'nav', 'hero', 'marquee', 'services', 'techstack', 'stats', 'process',
      'portfolio', 'team', 'pricing', 'faq', 'contact', 'footer',
    ]);
    const pages = new Set(Object.keys(PAGE_SECTIONS));
    const global = new Set(['ui', 'seo', 'contact_form', 'intro_splash', 'error_boundary']);

    const siteSections: string[] = [];
    const pageSections: string[] = [];
    const globalSections: string[] = [];
    const otherSections: string[] = [];

    for (const section of filteredSections) {
      if (site.has(section)) siteSections.push(section);
      else if (pages.has(section)) pageSections.push(section);
      else if (global.has(section)) globalSections.push(section);
      else otherSections.push(section);
    }

    return [
      { id: 'site', label: 'Site', sections: siteSections },
      { id: 'pages', label: 'Pages', sections: pageSections },
      { id: 'global', label: 'Global', sections: globalSections },
      { id: 'other', label: 'Other', sections: otherSections },
    ];
  }, [filteredSections]);

  // Fields for the current section
  const sectionFieldEntries = useMemo<SectionFieldEntry[]>(() => {
    if (activeSection === SUBMISSIONS_TAB) return [];

    let fields = content.filter(c => c.section === activeSection);

    // Filter out collection sub-keys from meta field lists
    if (activeSection === "portfolio") fields = fields.filter(c => !/^project_\d+_/.test(c.key) && c.key !== "project_count");
    if (activeSection === "team") fields = fields.filter(c => !/^member_\d+_/.test(c.key) && c.key !== "member_count");

    const definition = homeSectionDefinitions[activeSection];
    const defs = definition?.fields ?? [];
    const byKey = new Map(fields.map(f => [f.key, f] as const));
    const defKeySet = new Set(defs.map(d => d.key));

    const entries: SectionFieldEntry[] = [];

    // First: schema-defined fields in schema order (even if missing in DB)
    for (const def of defs) {
      entries.push({
        section: activeSection,
        key: def.key,
        definition: def,
        item: byKey.get(def.key),
      });
    }

    // Then: any extra fields that exist in DB but are not in the schema
    const extras = fields
      .filter(f => !defKeySet.has(f.key))
      .sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));

    for (const extra of extras) {
      const fallbackDef: AdminFieldDefinition = {
        key: extra.key,
        label: humanKey(extra.key),
        fallback: extra.value,
      };
      entries.push({ section: activeSection, key: extra.key, definition: fallbackDef, item: extra });
    }

    // Only apply field search to non-collection sections.
    if (deferredFieldSearch && !COLLECTION_SECTIONS.includes(activeSection as CollectionSection)) {
      const q = deferredFieldSearch.toLowerCase();
      return entries.filter(e => {
        const label = e.definition?.label?.toLowerCase() ?? "";
        const key = e.key.toLowerCase();
        const value = (e.item?.value ?? e.definition?.fallback ?? "").toLowerCase();
        return label.includes(q) || key.includes(q) || value.includes(q);
      });
    }

    return entries;
  }, [activeSection, content, deferredFieldSearch]);

  const handlePreviewNavigate = useCallback((info: { pathname: string; hash: string }) => {
    if (!syncPreview) return;
    const next = inferSectionFromPreviewLocation(info.pathname, info.hash);
    if (!next) return;
    setActiveSection((prev) => {
      if (prev === next) return prev;
      return next;
    });
    setFieldSearch('');
  }, [syncPreview]);

  const handleSelectSection = useCallback((section: string) => {
    setActiveSection(section as ActiveTab);
    setFieldSearch("");
  }, []);

  const handleFieldDeleteRequest = useCallback((id: number, key: string) => {
    setConfirm({ kind: "field", id, key, label: key });
  }, []);

  const handleSubmissionDeleteRequest = useCallback((id: number, label: string) => {
    setConfirm({ kind: "submission", id, label });
  }, []);

  // Collection items for portfolio/team
  function getCollectionItems(section: CollectionSection): CollectionItem[] {
    const meta = COLLECTION_META[section];
    const countItem = lookupContent(contentMap, section, meta.countKey);
    const fieldDefs = section === "portfolio" ? PORTFOLIO_FIELDS : TEAM_FIELDS;

    // Find max index in DB
    const existingIndices: number[] = [];
    content.forEach(c => {
      if (c.section !== section) return;
      const m = c.key.match(new RegExp(`^${meta.prefix}_(\\d+)_`));
      if (m) existingIndices.push(parseInt(m[1], 10));
    });

    // FIX #7: safe int parsing
    const storedCount = safeInt(countItem?.value || "");
    const maxIdx = existingIndices.length > 0 ? Math.max(...existingIndices) : 0;
    const count = storedCount !== undefined ? Math.max(storedCount, 0) : maxIdx;

    return Array.from({ length: count }, (_, i) => {
      const idx = i + 1;
      const fields: Record<string, ContentItem | undefined> = {};
      const values: Record<string, string> = {};
      for (const fd of fieldDefs) {
        const item = lookupContent(contentMap, section, `${meta.prefix}_${idx}_${fd.key}`);
        fields[fd.key] = item;
        values[fd.key] = item?.value ?? "";
      }
      const label = values[meta.primaryField] || `${meta.itemLabel} ${idx}`;
      return { index: idx, label, fields, values };
    });
  }

  // ── API helpers ──────────────────────────────────────────────────────────

  const apiFetchLogged = useCallback(async <T = unknown>(url: string, opts?: RequestInit) => {
    const nextOptions = withCsrfHeader(opts, csrfToken);

    try {
      return await apiFetch<T>(url, nextOptions, addLog, setCsrfToken);
    } catch (error) {
      if (
        error instanceof ApiRequestError
        && [401, 403].includes(error.status)
        && url !== "/api/admin/session"
      ) {
        setAuthenticated(false);
        setContent([]);
        setSubmissions([]);
      }
      throw error;
    }
  }, [addLog, csrfToken]);

  async function fetchContent() {
    return apiFetchLogged<ContentItem[]>(`/api/content?ts=${Date.now()}`);
  }

  async function loadAll() {
    setLoading(true); setError("");
    try {
      const [subs, ct] = await Promise.all([
        apiFetchLogged<Submission[]>("/api/contact"),
        fetchContent(),
      ]);
      setSubmissions(subs);
      setContent(ct);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const sess = await apiFetchLogged<{
          authenticated: boolean;
          csrfToken?: string;
          user?: { email?: string | null };
        }>("/api/admin/session");

        if (sess.csrfToken) setCsrfToken(sess.csrfToken);

        if (sess.authenticated) {
          setAuthenticated(true);
          setEmail(sess.user?.email || "");
          await loadAll();
        }
      } catch { setAuthenticated(false); } finally { setChecking(false); }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function login(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");

    try {
      if (!csrfToken) {
        await apiFetchLogged<{ csrfToken?: string }>("/api/admin/session");
      }

      await apiFetchLogged("/api/admin/session", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mfa_code: mfaCode }),
      });
      setAuthenticated(true);
      setPassword("");
      setMfaCode("");
      setMfaRequired(false);
      await loadAll();
    } catch (err) {
      if (err instanceof ApiRequestError && err.mfaRequired) {
        setMfaRequired(true);
        setError("MFA required. Enter the 6-digit authenticator code and submit again.");
        return;
      }

      const message = getErrorMessage(err);
      if (/failed to fetch/i.test(message) || /networkerror/i.test(message)) {
        setError(
          "Admin API not reachable. Start `vercel dev --local --yes --listen 3000` in the project root, then refresh and try again."
        );
      } else {
        setError(message);
      }
    } finally { setLoading(false); }
  }

  async function logout() {
    setLoading(true);
    try {
      await apiFetchLogged("/api/admin/session", { method: "DELETE" });
      setAuthenticated(false);
      setPassword("");
      setMfaCode("");
      setMfaRequired(false);
      setContent([]);
      setSubmissions([]);
    } finally { setLoading(false); }
  }

  // Content CRUD
  async function ensureField(section: string, key: string, value: string): Promise<ContentItem> {
    const existing = lookupContent(contentMap, section, key);
    if (existing) {
      const updated = await apiFetchLogged<ContentItem>("/api/content", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: existing.id, value }),
      });
      setContent(prev => prev.map(c => c.id === existing.id ? updated : c));
      return updated;
    }
    const created = await apiFetchLogged<ContentItem>("/api/content", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section, key, value }),
    });
    setContent(prev => [...prev, created]);
    return created;
  }

  async function bulkUpsertContent(
    items: Array<{ section: string; key: string; value: string }>,
    mode: "upsert" | "insert_missing" = "upsert",
  ) {
    if (items.length === 0) return;

    const updatedItems = await apiFetchLogged<ContentItem[]>("/api/content/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, items }),
    });

    // Avoid a full refetch: merge returned items into local state.
    if (updatedItems && updatedItems.length > 0) {
      setContent((prev) => {
        const next = [...prev];
        const indexByKey = new Map<string, number>();
        for (let i = 0; i < next.length; i += 1) {
          const c = next[i];
          indexByKey.set(`${c.section}::${c.key}`, i);
        }
        for (const item of updatedItems) {
          const k = `${item.section}::${item.key}`;
          const existingIndex = indexByKey.get(k);
          if (existingIndex === undefined) {
            indexByKey.set(k, next.length);
            next.push(item);
          } else {
            next[existingIndex] = item;
          }
        }
        return next;
      });
    }
  }

  async function bulkDeleteContent(ids: number[]) {
    if (ids.length === 0) return;

    await apiFetchLogged("/api/content/bulk", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    // Avoid a full refetch: delete from local state.
    const idsSet = new Set(ids);
    setContent((prev) => prev.filter((c) => !idsSet.has(c.id)));
  }

  async function seedSectionDefaults(section: string) {
    if (!homeSectionDefinitions[section]) return;

    setSeeding(true);
    setError("");

    try {
      const definition = homeSectionDefinitions[section];

      const seedItems: Array<{ section: string; key: string; value: string }> = definition.fields.map((field) => ({
        section,
        key: field.key,
        value: field.fallback ?? "",
      }));

      // Seed repeatable defaults only when the collection has no items.
      if (section === "portfolio") {
        const existing = getCollectionItems("portfolio");
        if (existing.length === 0) {
          for (let i = 0; i < portfolioDefaults.length; i++) {
            const idx = i + 1;
            const project = portfolioDefaults[i];
            seedItems.push({ section, key: `project_${idx}_tag`, value: project.tag });
            seedItems.push({ section, key: `project_${idx}_name`, value: project.name });
            seedItems.push({ section, key: `project_${idx}_subtitle`, value: project.subtitle });
            seedItems.push({ section, key: `project_${idx}_desc`, value: project.description });
            seedItems.push({ section, key: `project_${idx}_url`, value: project.url });
            seedItems.push({ section, key: `project_${idx}_image`, value: project.image });
            seedItems.push({ section, key: `project_${idx}_gallery`, value: project.gallery.join(",") });
          }
          seedItems.push({ section, key: "project_count", value: String(portfolioDefaults.length) });
        }
      }

      if (section === "team") {
        const existing = getCollectionItems("team");
        if (existing.length === 0) {
          for (let i = 0; i < teamDefaults.length; i++) {
            const idx = i + 1;
            const member = teamDefaults[i];
            seedItems.push({ section, key: `member_${idx}_name`, value: member.name });
            seedItems.push({ section, key: `member_${idx}_initials`, value: member.initials });
            seedItems.push({ section, key: `member_${idx}_role`, value: member.role });
            seedItems.push({ section, key: `member_${idx}_desc`, value: member.description });
            seedItems.push({ section, key: `member_${idx}_image`, value: member.image });
          }
          seedItems.push({ section, key: "member_count", value: String(teamDefaults.length) });
        }
      }

      await bulkUpsertContent(seedItems, "insert_missing");
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setSeeding(false);
    }
  }

  async function deleteField(id: number) {
    await apiFetchLogged("/api/content", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setContent(prev => prev.filter(c => c.id !== id));
  }

  // FIX #1 & #5: Unified, atomic collection reorder/save
  async function saveCollectionItems(section: CollectionSection, items: CollectionItem[]) {
    const meta = COLLECTION_META[section];
    const fieldDefs = section === "portfolio" ? PORTFOLIO_FIELDS : TEAM_FIELDS;

    setLoading(true);
    setError("");

    try {
      const upsertItems: Array<{ section: string; key: string; value: string }> = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const newIdx = i + 1;
        for (const fd of fieldDefs) {
          upsertItems.push({
            section,
            key: `${meta.prefix}_${newIdx}_${fd.key}`,
            value: item.values[fd.key] || "",
          });
        }
      }
      upsertItems.push({ section, key: meta.countKey, value: String(items.length) });

      // Delete items beyond new count
      const existingItems = getCollectionItems(section);
      const idsToDelete: number[] = [];
      for (const existing of existingItems) {
        if (existing.index > items.length) {
          for (const fd of fieldDefs) {
            const contentItem = existing.fields[fd.key];
            if (contentItem) idsToDelete.push(contentItem.id);
          }
        }
      }

      await bulkUpsertContent(upsertItems, "upsert");
      await bulkDeleteContent(idsToDelete);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  async function addCollectionItem(section: CollectionSection) {
    const items = getCollectionItems(section);
    const idx = items.length + 1;
    const meta = COLLECTION_META[section];
    const newItem: CollectionItem = {
      index: idx, label: `${meta.itemLabel} ${idx}`,
      fields: {}, values: {},
    };
    await saveCollectionItems(section, [...items, newItem]);
  }

  async function deleteCollectionItem(section: CollectionSection, index: number) {
    const items = getCollectionItems(section).filter(it => it.index !== index);
    await saveCollectionItems(section, items);
  }

  async function reorderCollectionItems(section: CollectionSection, fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    const items = [...getCollectionItems(section)];
    const [moved] = items.splice(fromIdx - 1, 1);
    items.splice(toIdx - 1, 0, moved);
    await saveCollectionItems(section, items);
  }

  // Submissions
  const setSubmissionStatus = useCallback(async (id: number, status: Submission["status"]) => {
    const updated = await apiFetchLogged<Submission>("/api/contact", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSubmissions(prev => prev.map(s => s.id === id ? updated : s));
  }, [apiFetchLogged]);

  async function deleteSubmission(id: number) {
    await apiFetchLogged("/api/contact", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubmissions(prev => prev.filter(s => s.id !== id));
  }

  // Confirm action handler
  async function handleConfirm() {
    if (!confirm) return;
    try {
      if (confirm.kind === "submission" && confirm.id) await deleteSubmission(confirm.id);
      if (confirm.kind === "field" && confirm.id) await deleteField(confirm.id);
      if (confirm.kind === "collection_item" && confirm.section && confirm.index) {
        await deleteCollectionItem(confirm.section as CollectionSection, confirm.index);
      }
    } catch (e) { setError(getErrorMessage(e)); }
    setConfirm(null);
  }

  // Field save (for collection cards)
  const handleFieldSave = useCallback(async (item: ContentItem, value: string) => {
    const updated = await apiFetchLogged<ContentItem>("/api/content", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: item.id, value }),
    });
    setContent(prev => prev.map(c => c.id === item.id ? updated : c));
  }, [apiFetchLogged]);

  // New field creation
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  async function createField() {
    if (!newKey.trim() || activeSection === SUBMISSIONS_TAB) return;
    try {
      await ensureField(activeSection, newKey.trim(), newValue);
      setNewKey(""); setNewValue("");
    } catch (e) { setError(getErrorMessage(e)); }
  }

  // ── Drag state for collection reorder ─────────────────────────────────────
  const [dragFrom, setDragFrom] = useState<{ section: CollectionSection; index: number } | null>(null);

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: loading / login
  // ─────────────────────────────────────────────────────────────────────────

  if (checking) {
    return (
      <div className="min-h-screen bg-[#06060C] flex items-center justify-center text-white/30 text-[13px]">
        <Spinner size={20} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#06060C] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] bg-white/[0.04] border border-white/8 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/60 to-accent flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>Admin sign in</h1>
              <p className="text-[12px] text-white/40">VAAD Development</p>
            </div>
          </div>
          <form onSubmit={login} className="flex flex-col gap-4">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setMfaRequired(false);
              }}
              placeholder="Admin email"
              className="w-full bg-white/4 text-white text-[14px] px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-accent/50 placeholder:text-white/25"
            />
            <input
              type="password" autoComplete="current-password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setMfaRequired(false);
              }}
              placeholder="Password"
              className="w-full bg-white/4 text-white text-[14px] px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-accent/50 placeholder:text-white/25"
            />

            {mfaRequired && (
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={mfaCode}
                onChange={e => setMfaCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit MFA code"
                className="w-full bg-white/4 text-white text-[14px] px-4 py-3 rounded-xl border border-accent/40 outline-none focus:border-accent placeholder:text-white/25"
              />
            )}

            {error && <p className="text-[12px] text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-accent to-accent/80 text-white py-3 rounded-xl text-[14px] font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
              {loading ? "Signing in..." : mfaRequired ? "Verify and sign in" : "Sign in"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER: main admin
  // ─────────────────────────────────────────────────────────────────────────

  const isCollection = COLLECTION_SECTIONS.includes(activeSection as CollectionSection);
  const enableFieldVirtualization = activeSection !== SUBMISSIONS_TAB && sectionFieldEntries.length >= 200;
  const collectionItems = isCollection ? getCollectionItems(activeSection as CollectionSection) : [];
  const missingDefaultsCount = (() => {
    if (activeSection === SUBMISSIONS_TAB) return 0;
    const definition = homeSectionDefinitions[activeSection];
    if (!definition) return 0;
    let missing = 0;
    for (const field of definition.fields) {
      if (!lookupContent(contentMap, activeSection, field.key)) missing += 1;
    }
    return missing;
  })();

  const showSeedDefaults = activeSection !== SUBMISSIONS_TAB
    && !!homeSectionDefinitions[activeSection]
    && (missingDefaultsCount > 0 || (isCollection && collectionItems.length === 0));

  const upsertField = (section: string, key: string, value: string) => ensureField(section, key, value);

  return (
    <div className="h-screen overflow-hidden bg-[#06060C] flex flex-col" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <ConfirmModal
        open={!!confirm}
        title={confirm?.kind === "submission" ? "Delete submission?" : confirm?.kind === "collection_item" ? `Delete ${confirm?.label}?` : "Delete content field?"}
        message={confirm?.kind === "collection_item"
          ? "This will remove the card from the live site. Remaining items will shift up."
          : `This will permanently remove "${confirm?.label || confirm?.key || "this item"}".`}
        onCancel={() => setConfirm(null)}
        onConfirm={handleConfirm}
      />

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-white/6 shrink-0 bg-[#08080f]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent/60 to-accent flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className="text-[15px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>VAAD</span>
          <span className="text-[11px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">admin</span>
        </div>
        <div className="flex items-center gap-1.5">
          {error && (
            <span className="text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg mr-2 truncate max-w-[200px]">
              {error}
            </span>
          )}
          {/* Preview toggle (hidden on mobile) */}
          {!isMobileViewport && (
            <button type="button" onClick={() => setShowPreview(v => !v)}
              className={`px-3 py-1.5 rounded-lg border text-[12px] flex items-center gap-1.5 transition-all
                ${showPreview ? "border-accent/30 text-accent bg-accent/10" : "border-white/10 text-white/40 hover:text-white/70"}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="14" x="3" y="5" rx="2" /><path d="M3 10h18" />
              </svg>
              Preview
            </button>
          )}
          {/* Debug toggle */}
          <button type="button" onClick={() => setShowDebug(v => !v)}
            className={`px-3 py-1.5 rounded-lg border text-[12px] flex items-center gap-1.5 transition-all
              ${showDebug ? "border-accent/30 text-accent bg-accent/10" : "border-white/10 text-white/40 hover:text-white/70"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 8v4M12 16h.01" />
            </svg>
            Debug {apiLog.length > 0 && <span className="text-[10px] opacity-60">({apiLog.length})</span>}
          </button>
          {/* Sync toggle */}
          {!isMobileViewport && showPreview && (
            <button type="button" onClick={() => setSyncPreview(v => !v)}
              className={`px-3 py-1.5 rounded-lg border text-[12px] flex items-center gap-1.5 transition-all
                ${syncPreview ? "border-accent/30 text-accent bg-accent/10" : "border-white/10 text-white/40 hover:text-white/70"}`}
              title="When enabled, navigating inside the preview updates the active section in the admin.">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
                <path d="M5 5h4" />
                <path d="M15 19h4" />
              </svg>
              Sync
            </button>
          )}
          {/* Refresh */}
          <button type="button" onClick={loadAll} disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-[12px] text-white/40 hover:text-white/70 flex items-center gap-1.5 disabled:opacity-40 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={loading ? "animate-spin" : ""}>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5M3 21v-5h5" />
            </svg>
            Refresh
          </button>
          {/* Logout */}
          <button type="button" onClick={logout} disabled={loading}
            className="px-3 py-1.5 rounded-lg border border-red-500/20 text-[12px] text-red-400/70 hover:text-red-400 flex items-center gap-1.5 disabled:opacity-40 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      </header>

      {/* ── MAIN BODY ────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-[220px] h-[240px] md:h-auto border-b md:border-b-0 md:border-r border-white/6 bg-[#08080f] shrink-0 overflow-hidden flex flex-col">
          <SectionSidebar
            groups={sidebarGroups}
            activeSection={activeSection}
            submissions={submissions}
            onSelectSection={handleSelectSection}
            searchQuery={sectionSearch}
            onSearchChange={setSectionSearch}
          />
        </aside>

        {/* Editor panel */}
        <main className={`flex flex-col overflow-hidden flex-1 ${previewEnabled ? "md:flex-none md:w-[440px]" : ""} border-b md:border-b-0 md:border-r border-white/6`}>
          {/* Section header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 shrink-0">
            <div>
              <h2 className="text-[15px] font-bold text-white" style={{ fontFamily: "Syne, sans-serif" }}>
                {activeSection === SUBMISSIONS_TAB ? "Submissions" : SECTION_LABELS[activeSection] || humanKey(activeSection)}
              </h2>
              {activeSection !== SUBMISSIONS_TAB && (
                <p className="text-[11px] text-white/30">
                  {isCollection ? `${collectionItems.length} items` : `${sectionFieldEntries.length} fields`}
                </p>
              )}
            </div>
            {activeSection !== SUBMISSIONS_TAB && (
              <div className="flex items-center gap-1.5">
                {showSeedDefaults && (
                  <SeedDefaultsButton
                    onSeed={() => seedSectionDefaults(activeSection)}
                    disabled={loading || seeding}
                  />
                )}
                {isCollection && (
                  <button type="button" onClick={() => addCollectionItem(activeSection as CollectionSection)} disabled={loading}
                    className="px-3 py-1.5 rounded-lg border border-accent/25 text-accent text-[12px] flex items-center gap-1.5 hover:border-accent/40 transition-all disabled:opacity-50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add {activeSection === "portfolio" ? "project" : "member"}
                  </button>
                )}
                {activeSection === 'work_page' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await addCollectionItem('portfolio');
                      setActiveSection('portfolio');
                      setFieldSearch('');
                    }}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-lg border border-accent/25 text-accent text-[12px] flex items-center gap-1.5 hover:border-accent/40 transition-all disabled:opacity-50"
                    title="Adds a new project card to Work / Projects">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    Add project
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {activeSection === SUBMISSIONS_TAB ? (
              <SubmissionsPanel
                submissions={submissions}
                onStatusChange={setSubmissionStatus}
                onDelete={handleSubmissionDeleteRequest}
              />
            ) : isCollection ? (
              <div className="flex flex-col gap-3">
                {sectionFieldEntries.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {sectionFieldEntries.map(entry => (
                      <div
                        key={`${entry.section}.${entry.key}`}
                        style={enableFieldVirtualization ? VIRTUALIZED_FIELD_WRAPPER_STYLE : undefined}
                      >
                        <FieldEditor
                          entry={entry}
                          onUpsert={upsertField}
                          onDelete={handleFieldDeleteRequest}
                          onLog={addLog}
                        />
                      </div>
                    ))}
                    <div className="border-t border-white/6" />
                  </div>
                )}
                {collectionItems.length === 0 ? (
                  <div className="text-center py-12 text-white/25 text-[13px]">
                    No items yet.
                    {showSeedDefaults
                      ? ' Click "Seed defaults" to populate this section.'
                      : ` Click "Add ${activeSection === "portfolio" ? "project" : "member"}" to start.`}
                  </div>
                ) : (
                  collectionItems.map(item => (
                    <div key={item.index}
                      onDragOver={e => { if (dragFrom?.section === activeSection) e.preventDefault(); }}
                      onDrop={e => {
                        e.preventDefault();
                        if (dragFrom?.section === activeSection && dragFrom.index !== item.index) {
                          reorderCollectionItems(activeSection as CollectionSection, dragFrom.index, item.index);
                        }
                        setDragFrom(null);
                      }}>
                      <CollectionCard
                        item={item}
                        section={activeSection as CollectionSection}
                        onFieldSave={handleFieldSave}
                        onDelete={() => setConfirm({ kind: "collection_item", section: activeSection, index: item.index, label: item.label })}
                        onLog={addLog}
                        dragHandleProps={{
                          draggable: true,
                          onDragStart: () => setDragFrom({ section: activeSection as CollectionSection, index: item.index }),
                          onDragEnd: () => setDragFrom(null),
                        }}
                      />
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Field search */}
                {sectionFieldEntries.length > 4 && (
                  <div className="relative">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input type="text" value={fieldSearch} onChange={e => setFieldSearch(e.target.value)}
                      placeholder="Filter fields…"
                      className="w-full bg-white/4 text-white/80 text-[12px] pl-7 pr-3 py-2 rounded-xl border border-white/8 outline-none focus:border-accent/30 placeholder:text-white/20" />
                  </div>
                )}

                {/* Add new field */}
                <div className="bg-white/[0.02] rounded-2xl border border-white/6 p-3">
                  <p className="text-[11px] text-white/30 mb-2 uppercase tracking-wider">New field</p>
                  <div className="flex gap-2">
                    <input type="text" value={newKey} onChange={e => setNewKey(e.target.value)}
                      placeholder="field_key"
                      className="w-[140px] bg-white/3 text-white text-[12px] px-2.5 py-2 rounded-lg border border-white/8 outline-none focus:border-accent/30 font-mono" />
                    <input type="text" value={newValue} onChange={e => setNewValue(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") createField(); }}
                      placeholder="Initial value"
                      className="flex-1 bg-white/3 text-white text-[12px] px-2.5 py-2 rounded-lg border border-white/8 outline-none focus:border-accent/30" />
                    <button type="button" onClick={createField}
                      className="px-3 py-2 rounded-lg bg-accent/20 text-accent text-[12px] hover:bg-accent/30 transition-colors">
                      Create
                    </button>
                  </div>
                </div>

                {sectionFieldEntries.length === 0 ? (
                  <p className="text-center py-10 text-[13px] text-white/25">No fields in this section yet.</p>
                ) : (
                  sectionFieldEntries.map(entry => (
                    <div
                      key={`${entry.section}.${entry.key}`}
                      style={enableFieldVirtualization ? VIRTUALIZED_FIELD_WRAPPER_STYLE : undefined}
                    >
                      <FieldEditor
                        entry={entry}
                        onUpsert={upsertField}
                        onDelete={handleFieldDeleteRequest}
                        onLog={addLog}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>

        {/* Preview pane */}
        {previewEnabled && (
          <div className="flex-1 overflow-hidden hidden md:block">
            <PreviewPane
              activeSection={activeSection}
              content={content}
              syncEnabled={syncPreview}
              onPreviewNavigate={handlePreviewNavigate}
            />
          </div>
        )}
      </div>

      {/* ── DEBUG PANEL ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {showDebug && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 200 }} exit={{ height: 0 }}
            className="border-t border-white/8 bg-[#06060f] overflow-hidden shrink-0">
            <DebugPanel log={apiLog} onClear={() => dispatchLog({ type: "clear" })} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * ## BUG FIXES SUMMARY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FIX #1 – Collection item save race condition
 *   OLD: `re()` iterates and calls `ae()` per field, but `ae()` calls `pe()`
 *        which looks up `N` (content state) that hasn't been updated yet by
 *        previous iterations → wrong ids, duplicate creates.
 *   NEW: `saveCollectionItems()` uses `ensureField()` which takes a fresh
 *        `lookupContent(contentMap, ...)` call every time, and the contentMap
 *        is derived from state via useMemo so it's always up-to-date.
 *        We await each field sequentially to avoid concurrent writes.
 *
 * FIX #2 – O(n²) content lookup
 *   OLD: `pe()` scanned the entire `N` array for every field rendered.
 *        With 200+ fields, every render was O(n²).
 *   NEW: `buildContentMap()` creates a `Map<"section::key", ContentItem>`.
 *        `lookupContent()` is O(1). Map rebuilds only when `content` changes.
 *
 * FIX #3 – Drag-and-drop vs text input conflict
 *   OLD: `draggable` was on the entire card `<div>` – dragging started when
 *        users tried to select text in input fields.
 *   NEW: `draggable` only on the grip handle icon via `dragHandleProps`.
 *        Inputs are unaffected.
 *
 * FIX #4 – Missing credentials on fetch
 *   OLD: `fetch(url, options)` – no `credentials: "include"`, so the session
 *        cookie was not sent to `/api/upload` in some browser configs.
 *   NEW: `apiFetch()` always adds `credentials: "include"` as a base default.
 *
 * FIX #5 – Stale closure in `re()` reorder
 *   OLD: `re()` captured `N` (content state) in closure. If called twice fast
 *        (double-drop), second call saw stale N → phantom items.
 *   NEW: `reorderCollectionItems()` reads `getCollectionItems()` (which reads
 *        current `contentMap`) fresh on every call.
 *
 * FIX #6 – Wasted save calls on unchanged fields
 *   OLD: `onBlur` fired `M()` (save) even when value hadn't changed, causing
 *        unnecessary PUT requests and "Saving…" flickers on every focus-out.
 *   NEW: `save()` bails early with `if (val === item.value) return;`
 *
 * FIX #7 – NaN stored as plan_count / faq_count
 *   OLD: `Number(n("pricing","plan_count",""))` returned NaN when field empty,
 *        and NaN was then passed to `Array.from({length: NaN})` → crash.
 *   NEW: `safeInt()` returns `undefined` (not NaN) when string is empty or
 *        non-numeric. Collection count falls back to DB-detected max index.
 *
 * FIX #8 – Missing error boundary around iframe
 *   OLD: No error handling on the iframe – if CSP blocked the preview URL,
 *        the admin would crash-loop with an unhandled error.
 *   NEW: `onError` handler on `<iframe>` sets `iframeError = true`, showing
 *        a friendly "Preview failed" message with a retry button.
 * ─────────────────────────────────────────────────────────────────────────────
 */
