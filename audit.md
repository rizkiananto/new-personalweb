# Deploy Readiness Audit

Date: 2026-09-03

## Verdict

**Not fully ready** — two blockers center on a leaked API key and a broken job-match pipeline. Per decision below, these are deferred; repo will be made private in the meantime. Everything else is non-blocking cleanup.

## Blockers (deferred — see note)

1. **Leaked API key** — `src/components/section/Profile.tsx:381` hardcodes `Bearer pk_bBqr3n2B5jSu1fKwGFRwWBoE1qyrwxgx` directly in client code. Anyone can pull it from devtools/view-source.
2. **Broken job-match pipeline** — three compounding bugs:
   - `src/lib/api-config.ts:3` reads `process.env.API_BASE_URL`, but `.env.example`/docs define `NEXT_PUBLIC_API_BASE_URL`. The unprefixed var never gets inlined client-side, so in production this silently falls back to `http://localhost:3000` — the feature calls the visitor's own machine and fails.
   - `src/app/api/v1/match-job/route.ts` (meant to keep the real key server-side) is a hardcoded mock that ignores input and returns the same canned JSON.
   - `Profile.tsx` doesn't call that route at all — it hits the external API directly from the browser, which is how the key above ends up leaked in the bundle.
   - Mitigating factor: the "Analyze Job Match" UI is wrapped in `hidden flex` (`Profile.tsx:943`), so it isn't currently reachable by visitors — but the key still ships in the bundle regardless of visibility.

> **Decision (2026-09-03):** Skipping these for now — related to another project that needs fixing first. Repo will be set to private in the meantime as mitigation.

## Should fix soon

- `pnpm lint` is broken — `eslint-plugin-react-hooks` is missing from `node_modules` despite being referenced by `eslint-config-next`. Zero lint coverage currently. (`pnpm build` still completes despite this.)
- `src/app/page.tsx:7` embeds a widget API key directly in a `<script src>` URL — likely a legitimate publishable/widget key, but worth a quick confirmation with whoever issued it.
- `src/components/section/Content.tsx:280-450` — ~170 lines of a "Projects" section (cards, filters, images), wrapped in `hidden p-6 space-y-6` and never rendered. Dead weight in the bundle.
- Console logging left in production paths: `Profile.tsx:386,387,390,402,410,414,454`, `job-match-dialog.tsx:251`, `api-config.ts:24` (this one also logs the API key prefix to console on non-prod loads).
- `next/image` with `fill` on the Actively Building showcase image (`Profile.tsx:608`) has no `sizes` prop and no `priority`, despite being flagged by Next as an LCP candidate in dev console.

## Nice-to-have / minor

- `@radix-ui/react-toggle` in `package.json` is now an unused dependency — `toggle.tsx` was deleted and nothing imports the Radix primitive directly anymore.
- Two independent `<ContactDialog>` instances are mounted (one in `Navbar.tsx`, one in `Profile.tsx`), each with its own local `open` state. Not a bug, just slightly redundant — a shared parent-level state would be cleaner if this grows.
- Turbopack build prints a "multiple lockfiles detected" warning (a stray `pnpm-lock.yaml` one directory above the project root is being picked up as workspace root). Cosmetic — could pin `turbopack.root` in `next.config.ts` to silence it.

## Dead code found

- `Content.tsx:280-450` — ~170 lines of Projects-listing JSX, unreachable (`hidden` wrapper).
- `Profile.tsx:943` onward — the job-match "Personaice.com" form UI, unreachable (`hidden flex` wrapper), plus its associated dead/broken API call chain above.
- `@radix-ui/react-toggle` dependency — unused since `toggle.tsx` deletion.

## Confirmed clean

- No stale references to the deleted `Sidebar` / `switcher-custom.tsx` / `toggle.tsx` / `Footer.tsx` files after the recent rename/cleanup.
- `tsc --noEmit` passes with zero errors.
- `pnpm build` completes successfully end-to-end (6/6 static pages generated).
