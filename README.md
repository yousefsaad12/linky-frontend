# lnqo Web

Next.js frontend for lnqo, a developer-first URL shortener and link analytics product.

The backend API lives in `D:\URLShortener`.

## What It Includes

- Marketing landing page
- Google OAuth sign-in entry points
- Protected analytics dashboard
- KPI overview, click timeline, top links, and breakdown panels
- Paginated links table with sorting and delete confirmation
- Per-link analytics detail pages
- Live click feed with visibility-aware auto-refresh
- Link comparison view
- API key management for Pro users
- Profile, quota, and plan usage views
- Developer API docs with multi-language examples

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Radix UI primitives
- lucide-react icons
- shadcn-style local UI components
- Recharts dependency plus custom SVG analytics chart components
- Vercel Analytics

## Project Structure

```text
URL Frontend/
  app/
    page.tsx                         Landing page
    layout.tsx                       Root metadata, fonts, analytics, toaster
    [shortcode]/page.tsx             Frontend short-code redirect bridge
    dashboard/
      layout.tsx                     Auth-protected dashboard layout
      page.tsx                       Main dashboard tabs
      api-keys/page.tsx              API key management
      profile/page.tsx               Dashboard profile route
      links/[shortCode]/page.tsx     Per-link analytics route
    docs/page.tsx                    Developer docs route
    profile/page.tsx                 Profile page route
  components/
    landing/                         Landing page sections
    dashboard/                       Dashboard shell, panels, profile, quota, API keys
    analytics/                       Charts, KPI grid, tables, breakdowns
    auth/                            Auth guard
    ui/                              Local UI primitives
  features/
    dashboard/hooks/                 Dashboard data and create URL hooks
    docs/                            Docs data and components
  hooks/
    use-auth.ts                      Shared auth/session hook
    use-toast.ts
    use-mobile.ts
  lib/
    auth/                            Auth API client and types
    url/                             URL API client
    analytics/                       Analytics API client, types, normalization, formatting
    site.ts                          App/API config
```

## Requirements

- Node.js 18+
- pnpm
- Running lnqo backend API

## Environment Variables

Create `.env` or `.env.local` in this frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` should point to the backend origin, not the frontend origin.

The backend must also allow this frontend origin in CORS and should set:

```env
FRONTEND_URL=http://localhost:3001
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

Adjust ports to match your local setup.

## Install

```bash
pnpm install
```

## Run

Development:

```bash
pnpm dev
```

Production build:

```bash
pnpm build
pnpm start
```

Lint:

```bash
pnpm lint
```

## Backend Integration

The app reads backend URLs from `lib/site.ts`.

Important API clients:

- `lib/auth/api.ts` calls `/api/v1/auth/me`, `/logout`, and `/api-keys`.
- `lib/url/api.ts` calls `/api/v1/url`.
- `lib/analytics/api.ts` calls `/api/v1/analytics/*`.

All browser API requests use `credentials: "include"` so the backend HTTP-only `jwt` cookie is sent.

`next.config.mjs` also defines a rewrite:

```js
source: "/api/:path*"
destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`
```

The current clients mostly call `site.apiUrl` directly, so make sure CORS is configured correctly on the backend.

## Main Routes

| Route | Purpose |
| ----- | ------- |
| `/` | Landing page |
| `/dashboard` | Analytics dashboard overview |
| `/dashboard?tab=links` | Links table |
| `/dashboard?tab=compare` | Link comparison |
| `/dashboard?tab=live` | Recent click feed |
| `/dashboard/links/:shortCode` | Single-link analytics |
| `/dashboard/api-keys` | API key management |
| `/dashboard/profile` | Dashboard profile route |
| `/profile` | Profile page |
| `/docs` | API documentation |
| `/:shortcode` | Redirects to backend `/:shortcode` |

## Auth Flow

1. The user clicks sign in.
2. The browser goes to `${NEXT_PUBLIC_API_URL}/api/v1/auth/google`.
3. The backend completes Google OAuth.
4. The backend sets an HTTP-only `jwt` cookie.
5. The backend redirects to `FRONTEND_URL`.
6. The frontend calls `/api/v1/auth/me` through `getCurrentUser()`.

Protected dashboard pages are wrapped by `components/auth/auth-guard.tsx`.

## Dashboard Data Flow

`app/dashboard/page.tsx` owns view state:

- active tab from `?tab=`
- selected analytics period
- links page and sort
- live feed auto-refresh toggle

`features/dashboard/hooks/use-dashboard-data.ts` loads:

- overview and recent clicks
- paginated links table
- live feed
- comparison data

The dashboard uses dynamic imports for heavier panels and avoids live-feed refreshes while the browser tab is hidden.

## API Key Management

`components/dashboard/api-keys-panel.tsx` lets Pro users:

- list active API keys
- create a named key
- copy the newly created key once
- revoke an existing key

The frontend never persists API keys after the one-time reveal.

## Developer Docs

The docs UI is built from:

- `features/docs/data/api-endpoints.ts`
- `features/docs/components/endpoint-docs.tsx`
- `app/docs/docs-content.tsx`

It renders endpoint metadata, parameter tables, sample responses, copy buttons, and examples for JavaScript, Python, cURL, Go, Java, and .NET.

## Styling

Global styles live in:

- `app/globals.css`
- `styles/globals.css`

Reusable UI primitives live under `components/ui`.

## Notes for Local Development

- Start the backend first.
- Confirm `NEXT_PUBLIC_API_URL` points to the backend.
- Confirm backend CORS allows the frontend origin.
- For OAuth cookies across different origins, the backend uses secure `sameSite: "none"` cookies, so production should run over HTTPS.
- In local HTTP development, cookie behavior may differ by browser and environment.

## Known Maintenance Items

- Replace full page reloads after link deletion with local state refresh.
- Consider moving the module-level auth singleton in `hooks/use-auth.ts` to context or `useSyncExternalStore`.
- Align API clients around either direct backend calls or the Next rewrite path.

## License

Private application frontend for lnqo.
