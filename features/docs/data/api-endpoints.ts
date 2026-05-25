import { site } from "@/lib/site";
import type { Endpoint } from "../types";

export const API_ENDPOINTS: Endpoint[] = [
  {
    id: "redirect-link",
    category: "redirect",
    method: "GET",
    path: "/:shortCode",
    title: "Redirect Short URL",
    description: "Resolves a shortened link and redirects the user's browser to the destination URL. In the background, Linky captures detailed click analytics including geographic region, referrer, browser, operating system, and device type.",
    authRequired: false,
    queryParams: [
      {
        name: "shortCode",
        type: "string",
        required: true,
        description: "The unique 4 to 8 character identifier corresponding to the shortened URL."
      }
    ],
    responseDescription: "HTTP status 302 Found redirecting the browser to the original destination. Includes cache control headers to prevent intermediary caches from swallowing analytics tracking.",
  },
  {
    id: "create-link",
    category: "url",
    method: "POST",
    path: "/api/v1/url",
    title: "Create Short URL",
    description: "Generates a shortened version of any long URL. Authenticated developers can pass custom paths and track creations. Each short link gets automatic HTTPS and instant edge propagation.",
    authRequired: true,
    headers: [
      {
        name: "Authorization",
        type: "string",
        required: true,
        description: "Standard HTTP Bearer authorization token. Format: Bearer <API_KEY>"
      },
      {
        name: "Content-Type",
        type: "string",
        required: true,
        description: "Must be set to application/json"
      }
    ],
    bodyParams: [
      {
        name: "originalUrl",
        type: "string",
        required: true,
        description: "The full destination URL to shorten. Must include http:// or https:// protocol prefix."
      }
    ],
    responseDescription: "Returns a JSON object detailing the shortened URL metadata, tracking identifier, and absolute links.",
  },
  {
    id: "analytics-overview",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/overview",
    title: "Analytics Overview",
    description: "Fetches aggregated performance metrics across all shortened links created by the developer. Includes high-level KPIs, chronological click timeline charts, and geographical and device breakdowns.",
    authRequired: true,
    headers: [
      {
        name: "Authorization",
        type: "string",
        required: true,
        description: "Bearer <API_KEY>"
      }
    ],
    queryParams: [
      {
        name: "period",
        type: "string",
        required: false,
        description: "Time range filter. Options: '24h', '7d', '30d', '90d', 'all'. Default: '7d'"
      }
    ],
    responseDescription: "Returns aggregated click totals, active counts, recent click rate changes, and top country/device arrays.",
  },
  {
    id: "analytics-top-links",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/top-links",
    title: "Top Performing Links",
    description: "Retrieves a ranking of shortened URLs sorted by highest total click activity. Perfect for populating dashboard leaderboard widgets or highlighting trending links.",
    authRequired: true,
    headers: [
      {
        name: "Authorization",
        type: "string",
        required: true,
        description: "Bearer <API_KEY>"
      }
    ],
    queryParams: [
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Max number of items to return. Default: 10"
      }
    ],
    responseDescription: "Returns an array of links ordered by clicks descending.",
  },
  {
    id: "analytics-links",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/links",
    title: "Retrieve Links List",
    description: "Returns a paginated list of all short links created by the developer. Perfect for creating links list panels with search, page shifting, and performance sort parameters.",
    authRequired: true,
    headers: [
      {
        name: "Authorization",
        type: "string",
        required: true,
        description: "Bearer <API_KEY>"
      }
    ],
    queryParams: [
      {
        name: "page",
        type: "integer",
        required: false,
        description: "Page index to retrieve. Default: 1"
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Links per page. Default: 20"
      },
      {
        name: "sort",
        type: "string",
        required: false,
        description: "Order field. Options: 'clicks' (highest clicks first) or 'createdAt' (newest links first). Default: 'clicks'"
      }
    ],
    responseDescription: "Returns a paginated payload including links list and total page numbers.",
  },
  {
    id: "analytics-recent-clicks",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/recent-clicks",
    title: "Recent Clicks Feed",
    description: "Retrieves a feed of the most recent clicks recorded. Used for plotting live activity feeds or monitoring real-time incoming redirects with full metadata descriptors.",
    authRequired: true,
    headers: [
      {
        name: "Authorization",
        type: "string",
        required: true,
        description: "Bearer <API_KEY>"
      }
    ],
    queryParams: [
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Maximum logs to return. Default: 20. Max: 100"
      }
    ],
    responseDescription: "Returns a flat chronological array of click events with client environments.",
  },
  {
    id: "analytics-link-detail",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/links/:shortCode",
    title: "Link Specific Breakdown",
    description: "Drills into the analytics for a single short link. Returns timeline charts and user environment breakdowns for the selected short code.",
    authRequired: true,
    headers: [
      {
        name: "Authorization",
        type: "string",
        required: true,
        description: "Bearer <API_KEY>"
      }
    ],
    queryParams: [
      {
        name: "shortCode",
        type: "string",
        required: true,
        description: "The short code to examine."
      },
      {
        name: "period",
        type: "string",
        required: false,
        description: "Time range filter. Options: '24h', '7d', '30d', '90d', 'all'. Default: '7d'"
      }
    ],
    responseDescription: "Returns details of the shortened resource, along with aggregated sums and nested arrays of demographics.",
  }
];
