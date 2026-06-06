Reorg Mapping — Applied Copies

Copied files:

- `components/theme-provider.tsx` -> `components/common/theme-provider.tsx`
- `components/error-boundary.tsx` -> `components/common/error-boundary.tsx`

Status:

- Originals left in place for now. Remove originals after CI/build validates.

Next suggested step: update imports across the repo to use `components/common/*`.
