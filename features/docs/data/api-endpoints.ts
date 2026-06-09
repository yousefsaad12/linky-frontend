import { site } from "@/lib/site";
import type { Endpoint } from "../types";

const bearerHeader = {
  name: "Authorization",
  type: "string",
  required: true,
  description:
    "Pro API: Bearer token from an API key. Format: Bearer <API_KEY>. Dashboard requests use the session cookie instead.",
};

const cookieNote =
  "Dashboard (browser): send requests with credentials so the httpOnly JWT cookie is included. Pro API: use Authorization: Bearer <API_KEY> from API keys created in the dashboard.";

export const API_ENDPOINTS: Endpoint[] = [
  {
    id: "redirect-link",
    category: "redirect",
    method: "GET",
    path: "/:shortCode",
    title: "Redirect Short URL",
    description:
      "Resolves a shortened link and redirects the browser to the destination URL. Click analytics (device, browser, region, referrer) are recorded asynchronously. Public — no authentication required.",
    authRequired: false,
    queryParams: [
      {
        name: "shortCode",
        type: "string",
        required: true,
        description:
          "The unique short identifier (path segment). Example: GET {baseUrl}/abc123",
      },
    ],
    responseDescription:
      "HTTP 302 Found redirect to the original destination URL. No JSON body. Cache-Control headers prevent intermediary caches from swallowing analytics.",
  },
  {
    id: "create-link",
    category: "url",
    method: "POST",
    path: "/api/v1/url",
    title: "Create Short URL",
    description: `Creates a shortened link for the authenticated user. ${cookieNote} Free plan: up to 100 links; Pro: unlimited. Returns 403 when the link quota is exceeded.`,
    authRequired: true,
    headers: [
      bearerHeader,
      {
        name: "Content-Type",
        type: "string",
        required: true,
        description: "Must be application/json",
      },
    ],
    bodyParams: [
      {
        name: "originalUrl",
        type: "string",
        required: true,
        description:
          "Full destination URL including http:// or https:// protocol.",
      },
    ],
    responseDescription:
      "201 Created with status success and data containing the url document and absolute shortUrl.",
  },
  {
    id: "list-urls",
    category: "url",
    method: "GET",
    path: "/api/v1/url",
    title: "List Short URLs",
    description: `Returns all short links owned by the authenticated user. ${cookieNote}`,
    authRequired: true,
    headers: [bearerHeader],
    responseDescription:
      "200 OK with status success and data as an array of URL documents (shortCode, originalUrl, clicks, timestamps).",
  },
  {
    id: "delete-url",
    category: "url",
    method: "DELETE",
    path: "/api/v1/url/:shortCode",
    title: "Delete Short URL",
    description: `Permanently deletes a short link and its click records. ${cookieNote}`,
    authRequired: true,
    headers: [bearerHeader],
    queryParams: [
      {
        name: "shortCode",
        type: "string",
        required: true,
        description: "Short code of the link to delete.",
      },
    ],
    responseDescription: "204 No Content on success. 404 if the link is not found.",
  },
  {
    id: "analytics-overview",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/overview",
    title: "Analytics Overview",
    description: `Aggregated KPIs, click timeline, top links, and breakdowns for all owned links. ${cookieNote} Free plan click history is limited to 30 days — responses may include clamped: true when a longer period was requested.`,
    authRequired: true,
    headers: [bearerHeader],
    queryParams: [
      {
        name: "period",
        type: "string",
        required: false,
        description: "Time range: 24h, 7d, or 30d. Default: 30d",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Max top links to return. Default: 5, max: 50",
      },
    ],
    responseDescription:
      "200 OK with period, optional clamped flag, summary KPIs, timeline, topLinks, and breakdowns.",
  },
  {
    id: "analytics-top-links",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/top-links",
    title: "Top Performing Links",
    description: `Links ranked by clicks in the selected period. ${cookieNote}`,
    authRequired: true,
    headers: [bearerHeader],
    queryParams: [
      {
        name: "period",
        type: "string",
        required: false,
        description: "Time range: 24h, 7d, or 30d. Default: 30d",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Max items. Default: 10, max: 50",
      },
    ],
    responseDescription:
      "200 OK with results count, period, optional clamped, and data array ordered by clicks descending.",
  },
  {
    id: "analytics-links",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/links",
    title: "Paginated Links Table",
    description: `Paginated list of short links with sort options. ${cookieNote}`,
    authRequired: true,
    headers: [bearerHeader],
    queryParams: [
      {
        name: "page",
        type: "integer",
        required: false,
        description: "Page index. Default: 1",
      },
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Links per page. Default: 20, max: 100",
      },
      {
        name: "sort",
        type: "string",
        required: false,
        description:
          "Sort field: clicks (highest first) or createdAt (newest first). Default: createdAt",
      },
    ],
    responseDescription:
      "200 OK with page, totalPages, total, results, and data array.",
  },
  {
    id: "analytics-recent-clicks",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/recent-clicks",
    title: "Recent Clicks Feed",
    description: `Latest click events with device and region metadata. ${cookieNote} History window depends on plan (30d free, 365d pro).`,
    authRequired: true,
    headers: [bearerHeader],
    queryParams: [
      {
        name: "limit",
        type: "integer",
        required: false,
        description: "Max events. Default: 20, max: 100",
      },
      {
        name: "shortCode",
        type: "string",
        required: false,
        description: "Filter to a single short code.",
      },
    ],
    responseDescription:
      "200 OK with results count and data array of click documents.",
  },
  {
    id: "analytics-link-detail",
    category: "analytics",
    method: "GET",
    path: "/api/v1/analytics/links/:shortCode",
    title: "Link Specific Breakdown",
    description: `Per-link analytics: timeline and environment breakdowns. ${cookieNote} City breakdown requires Pro. Free plans may receive clamped: true for periods beyond 30 days.`,
    authRequired: true,
    headers: [bearerHeader],
    queryParams: [
      {
        name: "shortCode",
        type: "string",
        required: true,
        description: "Short code to analyze.",
      },
      {
        name: "period",
        type: "string",
        required: false,
        description: "Time range: 24h, 7d, or 30d. Default: 30d",
      },
    ],
    responseDescription:
      "200 OK with url metadata, summary, timeline, breakdowns, and optional clamped flag.",
  },
];

/** Shown in docs intro — full API base URL */
export const API_BASE_URL = site.apiUrl;
