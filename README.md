# lnqo — Landing UI

Marketing site for [lnqo](../URLShortener): developer-first link analytics.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Set `NEXT_PUBLIC_API_URL` to your API (default: Azure backend). Sign-in buttons redirect to Google OAuth on the backend.

On the API, set `CLIENT_URL` to this app's origin.

## Stack

Next.js, Tailwind, shadcn/ui
