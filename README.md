# VAAD Development

Marketing site and lightweight admin CMS for VAAD Development, built with React, Vite, Vercel serverless functions, and Supabase.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Vercel Functions for content, contact, uploads, and admin session auth
- Supabase Postgres + Storage

## Local setup

### Node version

For the smoothest local `vercel dev` experience on Windows, use Node 22 LTS.
This repo includes version hints in `.nvmrc` and `.node-version`.

1. Copy `.env.example` to `.env`.
2. Fill in the required values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_UPLOADS_BUCKET`
  - `SUPABASE_ADMIN_ROLE` (default: `admin`)
  - `ADMIN_PASSWORD` (required; set a strong value)
    - Backward-compatible aliases are also supported: `ADMIN_PASS`, `ADMIN_PANEL_PASSWORD`, `VITE_ADMIN_PASSWORD`
  - `ADMIN_SESSION_MAX_AGE_SECONDS` (default: `28800`)
   - `ADMIN_SESSION_SECRET`
   - `SITE_URL`
   - `ALLOWED_ORIGINS`
3. Run the schema in [supabase/schema.sql](supabase/schema.sql).
4. Install dependencies with `npm install`.
5. Start the local dev server (includes Vercel Functions under `/api`) with `vercel dev --local --yes --listen 3000`.
  - Open the site at `http://localhost:3000/` (admin at `/admin`).
  - Sign in to `/admin` with the password from `ADMIN_PASSWORD`.

Optional (frontend-only): You can run `npm run dev` to start Vite on `http://127.0.0.1:5173/`, but admin/content APIs require `vercel dev`.

## Supabase setup

- Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor.
- The script creates:
  - `public.site_content`
  - `public.contact_submissions_v2`
  - `public.admin_audit_logs`
  - a public storage bucket named `vaad-assets`
- If you want a different bucket name, change the SQL and set `SUPABASE_UPLOADS_BUCKET` to match.
- Public content reads use the anon key and the `site_content` select policy.
- RLS is enabled on all admin-managed tables; admin mutation/read policies require the Supabase role set by `SUPABASE_ADMIN_ROLE`.
- Admin API writes still execute with the service-role key server-side to avoid exposing privileged keys to the client.

## Admin flow

- `GET /api/admin/session` issues/checks a signed admin cookie session and returns a CSRF token.
- `POST /api/admin/session` validates the configured admin password and starts a signed `HttpOnly` session.
- `DELETE /api/admin/session` clears the session and rotates CSRF state.
- `GET /api/admin/audit?limit=50` returns recent admin actions for operational review.
- `POST /api/client-log` ingests deduplicated browser warn/error telemetry for runtime diagnostics.
- Mutating admin API routes require `X-CSRF-Token` and the `HttpOnly` session cookie.
- Admin mutations are written to `public.admin_audit_logs` with actor, action, and request metadata.

## Resilience behavior

- Public routes stay available if CMS fetches fail.
- The content provider retries failed fetches, then falls back to safe defaults or cached content.
- Route-level and app-level React error boundaries prevent single-component crashes from taking down the full site.
- Admin write operations include optimistic concurrency checks (`expected_updated_at`) to surface edit conflicts clearly.

## Debugging tips and common pitfalls

- Check browser console entries prefixed with `[VAAD:*]` for structured client diagnostics.
- Client warn/error events are also forwarded to `/api/client-log`; inspect Vercel Runtime Logs for `[client_log]` entries.
- If admin login loops or fails, verify:
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `SITE_URL`
  - `ALLOWED_ORIGINS`
- If API routes return HTML instead of JSON, run through Vercel runtime (`vercel dev`) instead of Vite-only dev mode.
- If audit entries do not persist, re-run [supabase/schema.sql](supabase/schema.sql) and confirm `public.admin_audit_logs` exists.
- Conflict errors (`409`) mean another session updated the same field; refresh content and retry.

## Monitoring setup (Vercel + Supabase)

- Vercel:
  - Use Runtime Logs to inspect function errors and latency for `/api/content`, `/api/contact`, `/api/admin/*`.
  - Enable Web Analytics + Speed Insights for route-level performance regressions.
  - Add alerting on elevated function error rate and p95 duration.
- Supabase:
  - Use Logs > Postgres for failed queries and timeouts.
  - Track table growth and index usage for `site_content`, `contact_submissions_v2`, and `admin_audit_logs`.
  - Set alerts for connection saturation and abnormal write spikes.
- Recommended habit:
  - Correlate incident windows across Vercel Runtime Logs and Supabase query logs before applying fixes.

## Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repo into Vercel.
3. Add every variable from `.env.example` to the Vercel project settings.
4. Set `SITE_URL` to the final production domain.
5. Redeploy after the env vars and Supabase schema are in place.

## Notes

- Until Supabase env vars are configured, the public site still renders with component fallbacks, but admin/content APIs will not be fully functional.
- Uploaded images are stored in Supabase Storage instead of base64 blobs in Postgres.
- Static SEO defaults live in [index.html](index.html); per-route metadata is set client-side through [src/hooks/usePageMetadata.ts](src/hooks/usePageMetadata.ts).
