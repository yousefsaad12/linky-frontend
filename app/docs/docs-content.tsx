"use client";

import {
  BookOpen,
  Compass,
  Link as LinkIcon,
  BarChart3,
  Sparkles,
  Lock
} from "lucide-react";
import { site } from "@/lib/site";
import { DocsShell } from "@/features/docs/components/docs-shell";
import { EndpointDocs } from "@/features/docs/components/endpoint-docs";
import { API_ENDPOINTS, useDocsScrollContext } from "@/features/docs";


export function DocsContent() {
  const { activeSection, scrollToSection } = useDocsScrollContext();

  const categories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="h-3 w-3" />,
      items: [
        { id: "introduction", label: "Introduction" },
        { id: "authentication", label: "Authentication" },
      ],
    },
    {
      title: "Redirect Routing",
      icon: <Compass className="h-3 w-3" />,
      items: API_ENDPOINTS.filter(e => e.category === "redirect").map(e => ({
        id: e.id,
        label: e.title,
      })),
    },
    {
      title: "Links & API Keys",
      icon: <LinkIcon className="h-3 w-3" />,
      items: API_ENDPOINTS.filter(e => e.category === "url").map(e => ({
        id: e.id,
        label: e.title,
      })),
    },
    {
      title: "Link Analytics",
      icon: <BarChart3 className="h-3 w-3" />,
      items: API_ENDPOINTS.filter(e => e.category === "analytics").map(e => ({
        id: e.id,
        label: e.title,
      })),
    },
  ];

  return (
    <DocsShell
      activeSection={activeSection}
      onSectionClick={scrollToSection}
      categories={categories}
    >
      {/* SECTION: INTRODUCTION */}
      <section id="introduction" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-12 lg:pb-16 border-b border-white/5 scroll-mt-24">
        <div className="lg:col-span-7 space-y-4 lg:space-y-6">
          <span className="inline-flex items-center gap-2 text-[10px] lg:text-xs font-mono text-white/30 uppercase tracking-wider">
            <Sparkles className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-white/50" />
            Getting Started
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-white font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
            Introduction
          </h2>
          <div className="space-y-3 lg:space-y-4 text-white/70 text-xs sm:text-sm leading-relaxed">
            <p>
    Build URL shortening and analytics directly into your applications.
    Create short links, track engagement, and access detailed click data
    through a fast and reliable API.
  </p>

  <p>
    Designed around REST principles, the lnqo API features predictable
    endpoints, JSON responses, bearer token authentication, and standard
    HTTP response codes for a seamless integration experience.
  </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 lg:p-5 space-y-2 lg:space-y-3">
            <h4 className="text-[10px] lg:text-xs font-mono text-white font-medium">Base API URL</h4>
            <p className="text-[10px] lg:text-xs font-mono text-white/50 bg-black/40 border border-white/10 p-2 lg:p-3 rounded-lg overflow-x-auto selection:bg-white/10">
              {site.apiUrl}
            </p>
            <p className="text-[10px] lg:text-xs text-white/40 leading-relaxed">
              All requests must be made over HTTPS. HTTP requests will be automatically redirected to secure connections.
            </p>
          </div>
        </div>
        <div className="lg:col-span-5 hidden lg:block" />
      </section>

      {/* SECTION: AUTHENTICATION */}
      <section id="authentication" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 pb-12 lg:pb-16 border-b border-white/5 scroll-mt-24">
        <div className="lg:col-span-7 space-y-4 lg:space-y-6">
          <span className="inline-flex items-center gap-2 text-[10px] lg:text-xs font-mono text-white/30 uppercase tracking-wider">
            <Lock className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-white/50" />
            Security
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display tracking-tight text-white font-medium">
            Authentication
          </h2>
          <div className="space-y-3 lg:space-y-4 text-white/70 text-xs sm:text-sm leading-relaxed">
            <p>
              lnqo supports two authentication modes. Use the one that matches how
              you are calling the API.
            </p>
            <p>
              <strong className="text-white font-medium">Dashboard (cookie)</strong>{" "}
              — When you sign in with Google, the API sets an httpOnly{" "}
              <code className="font-mono text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10">jwt</code>{" "}
              cookie. The {site.name} dashboard sends this automatically with{" "}
              <code className="font-mono text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10">credentials: &quot;include&quot;</code>.
              Cookie auth is required to manage API keys.
            </p>
            <p>
              <strong className="text-white font-medium">Pro API (Bearer)</strong>{" "}
              — Server-side integrations use an API key in the{" "}
              <code className="font-mono text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Authorization</code>{" "}
              header. Create keys from the{" "}
              <a href="/dashboard/api-keys" className="text-white underline underline-offset-2 hover:text-white/80">
                dashboard API keys page
              </a>{" "}
              (Pro plan only).
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 lg:p-5 space-y-3">
            <h4 className="text-[10px] lg:text-xs font-mono text-white font-medium uppercase tracking-wider">Plan limits</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] lg:text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/40 font-mono">
                    <th className="py-2 pr-4 font-medium">Feature</th>
                    <th className="py-2 pr-4 font-medium">Free</th>
                    <th className="py-2 font-medium">Pro</th>
                  </tr>
                </thead>
                <tbody className="text-white/70">
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Short links</td>
                    <td className="py-2 pr-4">100</td>
                    <td className="py-2">Unlimited</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">Click history</td>
                    <td className="py-2 pr-4">30 days</td>
                    <td className="py-2">365 days</td>
                  </tr>
                  <tr className="border-b border-white/5">
                    <td className="py-2 pr-4">City analytics</td>
                    <td className="py-2 pr-4">—</td>
                    <td className="py-2">Included</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">REST API (Bearer)</td>
                    <td className="py-2 pr-4">—</td>
                    <td className="py-2">Included</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] lg:text-xs text-white/40 leading-relaxed">
              Exceeding link limits returns HTTP 403 with a message like{" "}
              <code className="font-mono text-white/60">Link limit reached (100). Upgrade to Pro for unlimited links.</code>{" "}
              Pro-only features return 403 when called on a Free plan.
            </p>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 lg:p-5 space-y-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">Important Security Notice</span>
            <p className="text-[10px] lg:text-xs text-white/60 leading-relaxed">
              Keep your API keys completely private. Do not commit keys to public repositories or expose them in client-side applications (like single-page React codebases running on public web browsers).
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2 lg:space-y-3">
            <div className="text-[10px] lg:text-xs font-mono text-white/40 mb-1">Pro API (Bearer)</div>
            <div className="bg-[#181818] border border-white/5 rounded-xl overflow-hidden shadow-xl">
              <div className="px-3 lg:px-4 py-2 border-b border-white/5 bg-[#1e1e1e] flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40">HTTP Headers</span>
              </div>
              <div className="p-3 lg:p-4 overflow-x-auto">
                <pre className="text-[10px] lg:text-xs font-mono text-white/80 whitespace-pre">
                  Authorization: Bearer <span className="text-amber-400">YOUR_API_KEY</span>{"\n"}
                  Content-Type: application/json
                </pre>
              </div>
            </div>
          </div>
          <div className="space-y-2 lg:space-y-3">
            <div className="text-[10px] lg:text-xs font-mono text-white/40 mb-1">Dashboard (cookie)</div>
            <div className="bg-[#181818] border border-white/5 rounded-xl overflow-hidden shadow-xl">
              <div className="px-3 lg:px-4 py-2 border-b border-white/5 bg-[#1e1e1e] flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/40">fetch example</span>
              </div>
              <div className="p-3 lg:p-4 overflow-x-auto">
                <pre className="text-[10px] lg:text-xs font-mono text-white/80 whitespace-pre">
{`fetch("${site.apiUrl}/api/v1/auth/me", {
  credentials: "include"
})`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ENDPOINTS */}
      <div className="space-y-12 lg:space-y-20">
        {API_ENDPOINTS.map(endpoint => (
          <section key={endpoint.id} id={endpoint.id} className="scroll-mt-24">
            <div className="max-w-4xl">
              <EndpointDocs endpoint={endpoint} />
            </div>
          </section>
        ))}
      </div>
    </DocsShell>
  );
}
