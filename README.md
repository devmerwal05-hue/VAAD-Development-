# VAAD Development

Marketing site and lightweight admin CMS for VAAD Development, built with React, Vite, Vercel serverless functions, and Supabase.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Vercel Functions for content, contact, uploads, and admin session auth
- Supabase Postgres + Storage

## Local setup

1. Copy `.env.example` to `.env`.
2. Fill in the required values:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_UPLOADS_BUCKET`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `SITE_URL`
   - `ALLOWED_ORIGINS`
3. Run the schema in [supabase/schema.sql](supabase/schema.sql).
4. Install dependencies with `npm install`.
5. Start the API (Vercel Functions) with `vercel dev --listen 3000`.
6. Start the frontend with `npm run dev`.

## Supabase setup

- Run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor.
- The script creates:
  - `public.site_content`
  - `public.contact_submissions_v2`
  - a public storage bucket named `vaad-assets`
- If you want a different bucket name, change the SQL and set `SUPABASE_UPLOADS_BUCKET` to match.
- Public content reads use the anon key and the `site_content` select policy.
- Admin mutations and contact submission writes use the service-role key on the server only.

## Admin flow

- `POST /api/admin/session` verifies `ADMIN_PASSWORD` (fallback: `2025`) and sets an `HttpOnly` admin session cookie.
- `GET /api/admin/session` checks whether the cookie is valid.
- `DELETE /api/admin/session` clears the cookie.
- The browser no longer stores the admin password in `localStorage`.

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
