"use client";

import React, { useState } from "react";
import { Copy, Check, FileCode, Terminal, Server, Code, Database, Coffee, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export interface CodeSnippets {
  nodejs: string;
  dotnet: string;
  python: string;
  go: string;
  spring: string;
  response: string;
}

interface CodeConsoleProps {
  snippets: CodeSnippets;
  mounted: boolean;
}

type LanguageTab = "nodejs" | "dotnet" | "python" | "go" | "spring" | "response";

export function CodeConsole({ snippets, mounted }: CodeConsoleProps) {
  const [activeTab, setActiveTab] = useState<LanguageTab>("nodejs");
  const [copied, setCopied] = useState(false);

  const getCodeString = () => {
    switch (activeTab) {
      case "nodejs":
        return snippets.nodejs;
      case "dotnet":
        return snippets.dotnet;
      case "python":
        return snippets.python;
      case "go":
        return snippets.go;
      case "spring":
        return snippets.spring;
      case "response":
        return snippets.response;
    }
  };

  const getLanguage = () => {
    switch (activeTab) {
      case "nodejs":
        return "javascript";
      case "dotnet":
        return "csharp";
      case "python":
        return "python";
      case "go":
        return "go";
      case "spring":
        return "java";
      case "response":
        return snippets.response.trim().startsWith("{") ? "json" : "bash";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCodeString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0c0c0e] border border-white/8 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative min-h-[700px]">
      {/* Tab Selector */}
      <div className="px-6 py-4 border-b border-white/8 bg-[#101012] shrink-0 flex items-center justify-between">
        {/* Language Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("nodejs")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all",
              activeTab === "nodejs"
                ? "bg-white/12 text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/5"
            )}
          >
            <Terminal className="h-4.5 w-4.5" />
            Node.js
          </button>
          <button
            onClick={() => setActiveTab("dotnet")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all",
              activeTab === "dotnet"
                ? "bg-white/12 text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/5"
            )}
          >
            <Server className="h-4.5 w-4.5" />
            .NET
          </button>
          <button
            onClick={() => setActiveTab("python")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all",
              activeTab === "python"
                ? "bg-white/12 text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/5"
            )}
          >
            <Coffee className="h-4.5 w-4.5" />
            Python
          </button>
          <button
            onClick={() => setActiveTab("go")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all",
              activeTab === "go"
                ? "bg-white/12 text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/5"
            )}
          >
            <Code className="h-4.5 w-4.5" />
            Go
          </button>
          <button
            onClick={() => setActiveTab("spring")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all",
              activeTab === "spring"
                ? "bg-white/12 text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/5"
            )}
          >
            <Leaf className="h-4.5 w-4.5" />
            Spring
          </button>
          <button
            onClick={() => setActiveTab("response")}
            className={cn(
              "flex items-center gap-2.5 px-5 py-3 text-sm font-semibold rounded-xl transition-all",
              activeTab === "response"
                ? "bg-white/12 text-white"
                : "text-white/35 hover:text-white/65 hover:bg-white/5"
            )}
          >
            <FileCode className="h-4.5 w-4.5" />
            Response
          </button>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-white/6 hover:bg-white/10 border border-white/8 hover:border-white/15 text-white/55 hover:text-white transition-all text-sm font-semibold"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="h-4.5 w-4.5 text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-4.5 w-4.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Snippet Renderer */}
      <div className="flex-1 overflow-y-auto bg-[#0c0c0e] select-text relative">
        {mounted ? (
          <div className="p-6">
            <SyntaxHighlighter
              language={getLanguage()}
              style={vscDarkPlus}
              showLineNumbers={true}
              wrapLongLines={true}
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: "0.875rem",
                lineHeight: "1.6",
                fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                whiteSpace: "pre-wrap",
              }}
              lineNumberContainerStyle={{
                paddingRight: "1.5rem",
                marginRight: "1.5rem",
                borderRight: "1px solid rgba(255, 255, 255, 0.1)",
                userSelect: "none",
              }}
              lineNumberStyle={{
                color: "rgba(255, 255, 255, 0.4)",
                fontSize: "0.8125rem",
                minWidth: "2rem",
                textAlign: "right",
                lineHeight: "1.6",
              }}
              codeTagProps={{
                className: "font-mono !bg-transparent",
                style: {
                  fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                }
              }}
            >
              {getCodeString()}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div className="p-8 animate-pulse space-y-3">
            <div className="h-4 bg-white/5 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
          </div>
        )}
      </div>
    </div>
  );
}
