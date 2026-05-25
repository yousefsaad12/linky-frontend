"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Link as LinkIcon,
  BarChart3,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SidebarCategory {
  title: string;
  icon: React.ReactNode;
  items: { id: string; label: string }[];
}

interface DocsShellProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionClick: (id: string) => void;
  categories: SidebarCategory[];
}

export function DocsShell({
  children,
  activeSection,
  onSectionClick,
  categories,
}: DocsShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionClick = (id: string) => {
    setMobileMenuOpen(false);
    onSectionClick(id);
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#eeeeee] font-sans antialiased selection:bg-white/10 selection:text-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              #ffffff 40px,
              #ffffff 41px
            )`,
          }}
        />
      </div>

      {/* Main Glassmorphic Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#111111]/85 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
            <span className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="font-display text-xl tracking-tight font-medium text-white">
                {site.name} API
              </span>
              <span className="text-[10px] font-mono bg-white/10 text-white/70 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold">
                v1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-mono text-white/70 hover:text-white transition-colors hidden sm:inline-block"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-white text-black hover:bg-white/90 text-xs font-semibold px-4 py-2 rounded-full transition"
            >
              Developer Console
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white/70 hover:text-white lg:hidden border border-white/10 rounded-md transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex z-10 relative">
        {/* Navigation Sidebar - Desktop */}
        <aside className="w-64 shrink-0 hidden lg:block border-r border-white/5 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto px-6 py-8 select-none">
          <div className="space-y-8">
            {categories.map((category) => (
              <div key={category.title}>
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2 font-semibold">
                  {category.icon}
                  {category.title}
                </h4>
                <ul className="space-y-1.5">
                  {category.items.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleSectionClick(item.id)}
                        className={cn(
                          "w-full text-left text-xs font-mono py-1 rounded transition-colors flex items-center justify-between",
                          activeSection === item.id 
                            ? "text-white font-semibold" 
                            : "text-white/50 hover:text-white/80"
                        )}
                      >
                        <span className="truncate">{item.label}</span>
                        {activeSection === item.id && (
                          <span className="w-1 h-1 rounded-full bg-white" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 bg-black/90 z-30 lg:hidden overflow-y-auto p-8 animate-in fade-in duration-200">
            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.title}>
                  <h4 className="text-xs font-mono text-white/30 uppercase tracking-wider mb-4 flex items-center gap-2 font-semibold">
                    {category.icon}
                    {category.title}
                  </h4>
                  <div className="grid grid-cols-1 gap-2 pl-2">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSectionClick(item.id)}
                        className={cn(
                          "text-left text-sm py-1.5 font-mono flex items-center justify-between transition-colors",
                          activeSection === item.id ? "text-white font-semibold" : "text-white/60 hover:text-white"
                        )}
                      >
                        {item.label}
                        {activeSection === item.id && <span className="w-1 h-1 rounded-full bg-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documentation Content Center & Code Panels */}
        <main className="flex-1 min-w-0 px-6 py-8 lg:px-12 lg:py-10 space-y-16">
          {children}
        </main>
      </div>

      <footer className="border-t border-white/5 bg-[#0f0f0f] py-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl tracking-tight font-medium text-white">
              {site.name}
            </span>
            <span className="text-[10px] font-mono text-white/30">
              API reference
            </span>
          </div>

          <div className="flex items-center gap-8 text-xs text-white/40 font-mono">
            <Link href="/" className="hover:text-white transition-colors">
              Homepage
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <a
              href={site.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              GitHub
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
