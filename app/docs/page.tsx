"use client";

import { useState, useEffect } from "react";
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
import { CodeConsole } from "@/features/docs/components/code-console";
import { API_ENDPOINTS, CODE_SNIPPETS_MAP, useDocsScroll } from "@/features/docs";
import type { DocsCategory } from "@/features/docs";

export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  
  const sections = ["introduction", "authentication", ...API_ENDPOINTS.map(e => e.id)];
  const { activeSection, scrollToSection } = useDocsScroll(sections);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      title: "Shorten Links",
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
      <section id="introduction" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-white/5 scroll-mt-24">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/30 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-white/50" />
            Getting Started
          </span>
          <h2 className="text-4xl font-display tracking-tight text-white font-medium animate-in fade-in slide-in-from-bottom-2 duration-300">
            Introduction
          </h2>
          <div className="space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              Welcome to the {site.name} API reference documentation. Our developer platform is designed to help you shorten URLs, query click metrics, and integrate premium link-level data into your own services in real-time.
            </p>
            <p>
              The API is structured around REST principles. It has predictable resource-oriented URLs, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-mono text-white font-medium">Base API URL</h4>
            <p className="text-xs font-mono text-white/50 bg-black/40 border border-white/10 p-3 rounded-lg overflow-x-auto selection:bg-white/10">
              {site.apiUrl}
            </p>
            <p className="text-xs text-white/40 leading-relaxed">
              All requests must be made over HTTPS. HTTP requests will be automatically redirected to secure connections.
            </p>
          </div>
        </div>
        <div className="lg:col-span-5 hidden lg:block" />
      </section>

      {/* SECTION: AUTHENTICATION */}
      <section id="authentication" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-white/5 scroll-mt-24">
        <div className="lg:col-span-7 space-y-6">
          <span className="inline-flex items-center gap-2 text-xs font-mono text-white/30 uppercase tracking-wider">
            <Lock className="h-3.5 w-3.5 text-white/50" />
            Security
          </span>
          <h2 className="text-4xl font-display tracking-tight text-white font-medium">
            Authentication
          </h2>
          <div className="space-y-4 text-white/70 text-sm leading-relaxed">
            <p>
              Most API requests require developer-level authentication. You can obtain your personal API keys directly within the {site.name} Developer Dashboard.
            </p>
            <p>
              Authenticate your requests by passing your API key in the <code className="font-mono text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Authorization</code> HTTP header.
            </p>
          </div>

          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-2">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider font-semibold">Important Security Notice</span>
            <p className="text-xs text-white/60 leading-relaxed">
              Keep your API keys completely private. Do not commit keys to public repositories or expose them in client-side applications (like single-page React codebases running on public web browsers).
            </p>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono text-white/40 mb-1">Header Example</div>
          <div className="bg-[#181818] border border-white/5 rounded-xl overflow-hidden shadow-xl">
            <div className="px-4 py-2 border-b border-white/5 bg-[#1e1e1e] flex items-center justify-between">
              <span className="text-[10px] font-mono text-white/40">HTTP Headers</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-xs font-mono text-white/80 whitespace-pre">
                Authorization: Bearer <span className="text-amber-400">YOUR_API_KEY</span>{"\n"}
                Content-Type: application/json
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: ENDPOINTS */}
      <div className="space-y-20">
        {API_ENDPOINTS.map(endpoint => {
          const snippets = CODE_SNIPPETS_MAP[endpoint.id];
          return (
            <section key={endpoint.id} id={endpoint.id} className="scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">

                {/* Left Column: API parameters/descriptions */}
                <div className="lg:col-span-5">
                  <EndpointDocs endpoint={endpoint} />
                </div>

                {/* Right Column: Code block console */}
                <div className="lg:col-span-7">
                  {snippets && (
                    <CodeConsole
                      snippets={snippets}
                      mounted={mounted}
                    />
                  )}
                </div>

              </div>
            </section>
          );
        })}
      </div>
    </DocsShell>
  );
}
