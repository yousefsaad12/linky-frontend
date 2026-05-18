"use client";

import type { CSSProperties } from "react";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/prism-light";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";

SyntaxHighlighter.registerLanguage("javascript", javascript);

/** Tokens tuned for the inverted developers block (light text on dark bg). */
const CODE_THEME: Record<string, CSSProperties> = {
  'code[class*="language-"]': {
    color: "oklch(0.985 0.002 90 / 0.88)",
    background: "none",
    fontFamily: "var(--font-mono), ui-monospace, monospace",
    fontSize: "0.8125rem",
    lineHeight: "1.625rem",
    textShadow: "none",
    whiteSpace: "pre",
  },
  'pre[class*="language-"]': {
    color: "oklch(0.985 0.002 90 / 0.88)",
    background: "transparent",
    margin: 0,
    padding: 0,
    textShadow: "none",
    fontFamily: "var(--font-mono), ui-monospace, monospace",
    fontSize: "0.8125rem",
    lineHeight: "1.625rem",
    whiteSpace: "pre",
  },
  comment: { color: "oklch(0.985 0.002 90 / 0.38)", fontStyle: "italic" },
  prolog: { color: "oklch(0.985 0.002 90 / 0.38)" },
  punctuation: { color: "oklch(0.985 0.002 90 / 0.55)" },
  property: { color: "oklch(0.82 0.08 200)" },
  tag: { color: "oklch(0.82 0.08 200)" },
  boolean: { color: "oklch(0.82 0.10 80)" },
  number: { color: "oklch(0.82 0.10 80)" },
  constant: { color: "oklch(0.82 0.10 80)" },
  symbol: { color: "oklch(0.82 0.10 80)" },
  selector: { color: "oklch(0.78 0.12 145)" },
  "attr-name": { color: "oklch(0.78 0.12 145)" },
  string: { color: "oklch(0.78 0.14 145)" },
  char: { color: "oklch(0.78 0.14 145)" },
  builtin: { color: "oklch(0.82 0.06 250)" },
  inserted: { color: "oklch(0.78 0.14 145)" },
  operator: { color: "oklch(0.985 0.002 90 / 0.55)" },
  entity: { color: "oklch(0.82 0.08 200)" },
  url: { color: "oklch(0.78 0.14 145)" },
  variable: { color: "oklch(0.85 0.06 280)" },
  atrule: { color: "oklch(0.82 0.08 200)" },
  "attr-value": { color: "oklch(0.78 0.14 145)" },
  function: { color: "oklch(0.82 0.06 250)" },
  "class-name": { color: "oklch(0.82 0.06 250)" },
  keyword: { color: "oklch(0.85 0.06 280)", fontWeight: 500 },
  regex: { color: "oklch(0.78 0.14 145)" },
  important: { color: "oklch(0.85 0.06 280)", fontWeight: 600 },
};

interface CodeSnippetPanelProps {
  code: string;
  panelKey: string;
}

export function CodeSnippetPanel({ code, panelKey }: CodeSnippetPanelProps) {
  return (
    <div className="min-h-[280px] overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <div key={panelKey} className="animate-in fade-in duration-200 min-w-max lg:min-w-0">
        <SyntaxHighlighter
          language="javascript"
          style={CODE_THEME}
          showLineNumbers
          wrapLongLines={false}
          customStyle={{
            margin: 0,
            padding: "2rem",
            background: "transparent",
          }}
          lineNumberContainerStyle={{
            float: "left",
            paddingRight: "0.75rem",
            marginRight: "0.75rem",
            borderRight: "1px solid oklch(0.985 0.002 90 / 0.12)",
            userSelect: "none",
          }}
          lineNumberStyle={{
            color: "oklch(0.985 0.002 90 / 0.32)",
            fontSize: "0.75rem",
            lineHeight: "1.625rem",
            minWidth: "2rem",
            textAlign: "right",
            paddingRight: "0.25rem",
          }}
          codeTagProps={{
            className: "font-mono !bg-transparent",
          }}
        >
          {code.trimEnd()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
