# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start dev server (Next.js)
pnpm dev-turbo        # Start dev server with Turbopack
pnpm build            # Production build (Turbopack)
pnpm lint             # Run ESLint
pnpm docker:build     # Build Docker image via script
pnpm docker:push      # Push image to GHCR
```

No test runner is configured in this project.

## Environment

Copy `.env.example` to `.env.local`:
- `NEXT_PUBLIC_API_BASE_URL` — base URL for external API calls
- `NEXT_PUBLIC_API_KEY` — bearer token for API auth

## Architecture

**Next.js 15 App Router** with TypeScript strict mode. Path alias `@/*` maps to `src/*`.

### State & Data Flow

- `src/contexts/RootContext.tsx` is the single global context — it manages language (EN/ID), view mode, selected tool filters, and mobile detection. Most interactive components consume this context.
- `src/data.ts` holds all static content and translations (bilingual EN/ID). Adding new copy means editing this file.
- `src/types.ts` defines all shared TypeScript interfaces (`Tool`, `JobMatchResult`, `LanguageLabel`, translation shapes, etc.).

### Component Layout

- `src/app/home.tsx` — the main `Portfolio` client component; handles high-level layout state and renders the section components.
- `src/components/section/` — major UI sections (Navbar, Sidebar, Content, Footer).
- `src/components/ui/` — shadcn/ui primitives (don't modify these directly; re-run shadcn CLI to update).

### API

- `src/app/api/v1/match-job/` — Next.js Route Handler for job-candidate matching. Uses `src/lib/api-config.ts` for auth headers.
- External API calls use Axios via `src/lib/api-config.ts`, which injects `NEXT_PUBLIC_API_KEY` as a Bearer token.

### Styling

Tailwind CSS v4 via PostCSS. Global styles and CSS variables are in `src/app/globals.css`. The shadcn/ui config (`components.json`) uses the **New York** style variant with Lucide icons.

## Deployment

The app is containerized with a multi-stage Dockerfile (node:20-alpine) and deployed to a VPS via GitHub Actions (`.github/workflows/deploy.yml`). The workflow builds and pushes to `ghcr.io/rizkiananto/new-personalweb:latest`, then SSHs into the VPS to pull and restart via Docker Compose. Nginx reverse-proxies port 3003 → container 3000. Nginx config and deployment helper scripts live in `nginx/` and `scripts/`.
