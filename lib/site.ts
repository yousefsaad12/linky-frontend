/** lnqo — developer-first link analytics */

const isServer = typeof window === "undefined";

const apiUrl = isServer
  ? process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "http://localhost:3000"
  : ""; // ✅ empty string forces browser to use Vercel proxy

export const site = {
  name: "lnqo",
  tagline: "Create short links. Track every click.",
  description:
    "Shorten links, serve instant redirects, and track every click with simple, production-grade APIs and realtime analytics.",
  apiUrl,
  auth: {
    signIn: "/api/v1/auth/google", // ✅ relative URL
  },
  links: {
    dashboard: "/dashboard",
    analyticsDocs: "/docs",
    github: "https://github.com/yousefsaad12",
  },
} as const;