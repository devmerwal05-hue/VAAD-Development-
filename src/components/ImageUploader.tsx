import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Clipboard, Image as ImageIcon, Link2, Loader2, Trash2, Upload, X } from 'lucide-react';
import { getErrorMessage } from '../lib/getErrorMessage';

interface ImageUploaderProps {
  compact?: boolean;
  onChange: (url: string) => void;
  value: string;
}

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return '';
  const raw = document.cookie || '';
  if (!raw) return '';

  const target = `${name}=`;
  for (const part of raw.split(';')) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(target)) continue;
    return decodeURIComponent(trimmed.slice(target.length));
  }

  return '';
}

async function resolveAdminCsrfToken() {
  let token = getCookieValue('vaad_admin_csrf');
  if (token) return token;

  try {
    const response = await fetch('/api/admin/session', {
      method: 'GET',
      credentials: 'include',
    });
    const payload = (await response.json().catch(() => null)) as { csrfToken?: unknown } | null;
    if (payload && typeof payload.csrfToken === 'string' && payload.csrfToken) {
      token = payload.csrfToken;
    }
  } catch {
    // Ignore and fall back to cookie check below.
  }

  if (!token) token = getCookieValue('vaad_admin_csrf');
  return token;
}

export default function ImageUploader({ value, onChange, compact = false }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [justUploaded, setJustUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File too large. Maximum 5MB.');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Unable to read the file.'));
        reader.readAsDataURL(file);
      });

      const csrfToken = await resolveAdminCsrfToken();

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken
            ? { 'X-CSRF-Token': csrfToken }
            : {}),
        },
        credentials: 'include',
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type,
          data: dataUrl,
        }),
      });

      const payload = (await response.json()) as { error?: string; url?: string };
      if (!response.ok || !payload.url) {
        throw new Error(payload.error || 'Upload failed.');
      }

      onChange(payload.url);
      setJustUploaded(true);
      window.setTimeout(() => setJustUploaded(false), 3000);
    } catch (error) {
      setUploadError(getErrorMessage(error));
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  useEffect(() => {
    async function handlePaste(event: ClipboardEvent) {
      const activeInsideDropzone = dropRef.current?.contains(document.activeElement);
      const hovered = dropRef.current?.matches(':hover');

      if (!activeInsideDropzone && !hovered) return;

      const items = event.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          event.preventDefault();
          const file = item.getAsFile();
          if (file) await uploadFile(file);
          return;
        }
      }
    }

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [uploadFile]);

  const hasImage = Boolean(value);

  function handleUrlSubmit() {
    const nextUrl = urlInput.trim();
    if (!nextUrl) return;
    onChange(nextUrl);
    setUrlInput('');
    setShowUrlInput(false);
  }

  return (
    <div ref={dropRef} className="flex flex-col gap-2">
      {hasImage && (
        <div className="relative group rounded-[10px] overflow-hidden border border-[rgba(255,255,255,0.06)] inline-flex">
          <img
            src={value}
            alt="Current upload"
            className={compact ? 'h-[60px] w-auto object-cover' : 'h-[120px] w-auto max-w-full object-cover'}
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
            loading="lazy"
            decoding="async"
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-[rgba(0,0,0,0.7)] text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove uploaded image"
          >
            <Trash2 size={12} />
          </button>
          {justUploaded && (
            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px]">
              <Check size={10} />
              Uploaded
            </div>
          )}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setDragging(false);
        }}
        onDrop={async (event) => {
          event.preventDefault();
          event.stopPropagation();
          setDragging(false);

          if (event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
              await uploadFile(file);
              return;
            }
          }

          const droppedText = event.dataTransfer.getData('text');
          if (droppedText && (droppedText.startsWith('http://') || droppedText.startsWith('https://') || droppedText.startsWith('/'))) {
            onChange(droppedText);
          }
        }}
        onClick={() => {
          if (!uploading) fileInputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (!uploading) fileInputRef.current?.click();
          }
        }}
        className={`relative rounded-[10px] border-2 border-dashed transition-all duration-200 cursor-pointer ${
          dragging
            ? 'border-accent bg-[rgba(124,111,247,0.08)]'
            : uploading
              ? 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)]'
              : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(124,111,247,0.3)] hover:bg-[rgba(255,255,255,0.02)]'
        } ${compact ? 'px-3 py-3' : 'px-4 py-5'}`}
        aria-label="Upload an image"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void uploadFile(file);
            }
            event.target.value = '';
          }}
        />

        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin text-accent" />
            <span className="text-[13px] text-text-secondary">Uploading...</span>
          </div>
        ) : dragging ? (
          <div className="flex items-center justify-center gap-2">
            <Upload size={16} className="text-accent" />
            <span className="text-[13px] text-accent">Drop image here</span>
          </div>
        ) : (
          <div className={`flex ${compact ? 'items-center gap-3' : 'flex-col items-center gap-2'}`}>
            <div className={`flex items-center gap-2 ${compact ? '' : 'mb-1'}`}>
              <Upload size={compact ? 13 : 16} className="text-text-tertiary" />
              <span className={`${compact ? 'text-[12px]' : 'text-[13px]'} text-text-secondary`}>
                {compact ? 'Drop, paste, or click' : 'Drag an image here, paste a screenshot, or click to browse'}
              </span>
            </div>
            {!compact && (
              <div className="flex items-center gap-3 text-[11px] text-text-tertiary">
                <span className="flex items-center gap-1">
                  <ImageIcon size={10} />
                  PNG, JPG, WebP, SVG
                </span>
                <span>.</span>
                <span className="flex items-center gap-1">
                  <Clipboard size={10} />
                  Ctrl+V works here
                </span>
                <span>.</span>
                <span>Max 5MB</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowUrlInput((current) => !current)}
          className="flex items-center gap-1 text-[11px] text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <Link2 size={11} />
          {showUrlInput ? 'Hide URL input' : 'Use URL instead'}
        </button>
      </div>

      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleUrlSubmit();
            }}
            placeholder="https://... or /images/..."
            className="flex-1 bg-[rgba(255,255,255,0.03)] text-cyan text-[13px] px-3 py-2 rounded-[8px] border border-[rgba(255,255,255,0.06)] outline-none focus:border-[rgba(124,111,247,0.5)]"
            style={{ fontFamily: 'JetBrains Mono' }}
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            className="px-3 py-2 rounded-[8px] bg-accent hover:bg-accent-dark text-white text-[12px] transition-colors"
          >
            Set
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <X size={11} />
          {uploadError}
        </p>
      )}
    </div>
  );
}
