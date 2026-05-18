# Linky — Landing UI

Marketing site for [Linky](../URLShortener): developer-first link analytics.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NEXT_PUBLIC_API_URL` to your API (default `http://localhost:3000`). Sign-in buttons redirect to Google OAuth on the backend.

On the API, set `CLIENT_URL` to this app's origin (e.g. `http://localhost:3000` if Next runs on 3000 — use another port if the API uses 3000).

## Stack

Next.js, Tailwind, shadcn/ui
