/** lnqo — developer-first link analytics (matches URLShortener backend) */

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

export const site = {
  name: "lnqo",
  tagline: "Create short links. Track every click.",
  description:
    "Shorten links, serve instant redirects, and track every click with simple, production-grade APIs and realtime analytics.",
  apiUrl,
  auth: {
    signIn: `${apiUrl}/api/v1/auth/google`,
  },
  links: {
    dashboard: "/dashboard",
    analyticsDocs: "/docs",
    github: "https://github.com/yousefsaad12",
  },
} as const;
