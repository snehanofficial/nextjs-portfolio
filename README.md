# Dynamic Portfolio Platform

A production-oriented portfolio platform built on `next@16.2.4` with a server-first App Router architecture, Prisma/PostgreSQL content models, Auth.js credentials auth, Cloudinary-backed asset management, and lead capture with Resend notifications.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Auth.js / NextAuth credentials auth
- Prisma 7 with PostgreSQL
- Cloudinary for media and file storage
- Resend for lead notification emails

## What’s Included

### Public site

- Homepage driven by `SiteSettings`, `PageSection`, featured `Project`, `Skill`, and `Resume` data
- Project listing page and dynamic project detail pages
- Resume download page
- Contact form backed by a Server Action and persisted `Lead` records
- SEO metadata plus generated `robots.txt` and `sitemap.xml`

### Protected admin

- Credentials sign-in for a seeded admin user
- CRUD-style management flows for projects, skills, homepage content, and resume replacement
- Lead review dashboard with status updates and notes
- Server Action mutations with Zod validation and cache-tag refreshes

### Asset model

- Dedicated `Asset` table for Cloudinary-backed files
- Relations from `Project`, `Skill`, and `Resume` instead of raw asset URLs
- Safe orphan cleanup utilities for replace/delete workflows

## Project Structure

```text
app/
  (public)/
  (admin)/
  api/
components/
  admin/
  forms/
  ui/
generated/
  prisma/
lib/
  actions/
  auth/
  dal/
  services/
  validation/
prisma/
types/
```

## Environment

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme123
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=portfolio@example.com
LEAD_NOTIFICATION_EMAIL=you@example.com
```

## Local Setup

```bash
pnpm install
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed
pnpm run dev
```

## Validation Commands

```bash
pnpm run typecheck
pnpm run lint
pnpm run build
```

## Notes

- Prisma 7 in this repo uses the generated client at `generated/prisma` plus the required `@prisma/adapter-pg` driver adapter.
- Public content reads are cache-tagged with Next 16 Cache Components primitives.
- Admin pages render dynamically behind Suspense boundaries to stay compatible with `cacheComponents: true`.
