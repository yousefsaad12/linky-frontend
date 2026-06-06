Reorganization Plan — Proposed Moves

Goal: organize project by Next.js App Router best practices while minimizing breakage.

Proposed canonical structure:

- app/ (keep as-is)
- components/
  - common/ (theme-provider, error-boundary, smaller shared UI glue)
  - ui/ (atomic UI primitives — already present)
  - analytics/ (analytics panels + charts — already present)
  - dashboard/ (dashboard-specific panels — already present)
  - landing/ (landing page sections — already present)
  - auth/ (auth guard)
- lib/ (runtime libraries)
  - analytics/ (keep runtime; dev/ for mocks)
  - auth/
  - url/
  - site.ts, utils.ts
- hooks/ (keep as-is)
- features/ (feature folders)
- types/ (optional: consolidate shared types later)
- archive/ (keep archived files)

Planned non-risky moves (copy-first, then update imports):

- Move `components/theme-provider.tsx` -> `components/common/theme-provider.tsx`
- Move `components/error-boundary.tsx` -> `components/common/error-boundary.tsx`
- Ensure `components/ui/*` remains in `components/ui/` (no change)
- Ensure `lib/analytics/dev/*` stays in place (already moved)

Files already organized (no action):

- components/landing/\*
- components/analytics/\*
- components/dashboard/\*
- hooks/\*
- features/\*
- lib/url/_, lib/auth/_

Next steps after your approval:

1. Create target folders (e.g., `components/common`).
2. Copy files to new locations and update imports across the repo.
3. Run `pnpm tsc --noEmit` to typecheck and `pnpm build` to validate.
4. If build passes, delete originals and commit changes.

If you approve, reply "apply" and I'll perform step 1 (create folders) and step 2 (copy and update imports for the small set above).

If you'd like different moves, list them and I'll adjust the plan.
