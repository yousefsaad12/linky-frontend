/** lnqo — developer-first link analytics (matches URLShortener backend) */

// For browser requests, use empty string to go through Vercel proxy (same domain)
// For server-side requests, use the full Azure URL directly
const apiUrl =
  typeof window !== "undefined"
    ? "" // ✅ browser: same-origin proxy → no cookie blocking
    : process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:3000"; // server-side

export const site = {
  name: "lnqo",
  tagline: "Create short links. Track every click.",
  description:
    "Shorten links, serve instant redirects, and track every click with simple, production-grade APIs and realtime analytics.",
  apiUrl,
  auth: {
    signIn: "/api/v1/auth/google", // ✅ relative URL — goes through Vercel proxy
  },
  links: {
    dashboard: "/dashboard",
    analyticsDocs: "/docs",
    github: "https://github.com/yousefsaad12",
  },
} as const;