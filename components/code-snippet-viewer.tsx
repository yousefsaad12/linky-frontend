"use client";

import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const codeSnippets = {
  nodejs: `// Node.js - Get redirect without following
const response = await fetch("http://localhost:3000/k", {
  method: "GET",
  redirect: "manual"
});

const targetUrl = response.headers.get("location");
console.log("Redirect Destination:", targetUrl);`,
  dotnet: `using (var client = new HttpClient())
{
    var request = new HttpRequestMessage(HttpMethod.Get, "http://localhost:3000/k");
    var response = await client.SendAsync(request);
    var location = response.Headers.Location;
    Console.WriteLine("Redirecting to: " + location);
}`,
  python: `import requests

# Get target location without executing redirect
response = requests.get(
    "http://localhost:3000/k",
    allow_redirects=False
)

destination = response.headers.get("Location")
print("Redirecting to:", destination)`,
  go: `package main

import (
    "fmt"
    "net/http"
)

func main() {
    client := &http.Client{
        CheckRedirect: func(req *http.Request, via []*http.Request) error {
            return http.ErrUseLastResponse
        },
    }
    
    resp, err := client.Get("http://localhost:3000/k")
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    location := resp.Header.Get("Location")
    fmt.Println("Redirecting to:", location)
}`,
  spring: `// Spring Boot - Get redirect without following
@RestController
public class RedirectController {
    
    @GetMapping("/redirect")
    public ResponseEntity<String> getRedirect() {
        RestTemplate restTemplate = new RestTemplate();
        
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(
            "http://localhost:3000/k",
            HttpMethod.GET,
            entity,
            String.class
        );
        
        String location = response.getHeaders().getLocation().toString();
        return ResponseEntity.ok("Redirecting to: " + location);
    }
}`
};

type Language = "nodejs" | "dotnet" | "python" | "go" | "spring";

const languageLabels = {
  nodejs: "Node.js",
  dotnet: ".NET",
  python: "Python",
  go: "Go",
  spring: "Spring"
};

const languageColors = {
  nodejs: "#68a063",
  dotnet: "#512bd4",
  python: "#ffde57",
  go: "#00add8",
  spring: "#6db33f"
};

export function CodeSnippetViewer() {
  const [activeTab, setActiveTab] = useState<Language>("dotnet");

  const getLanguage = (lang: Language): string => {
    switch (lang) {
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
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10">
        {/* Tab Bar */}
        <div className="flex items-center border-b border-white/10 bg-[#252526]">
          {Object.keys(languageLabels).map((lang) => {
            const language = lang as Language;
            const isActive = activeTab === language;
            return (
              <button
                key={lang}
                onClick={() => setActiveTab(language)}
                className={`
                  px-5 py-3 text-sm font-medium transition-all relative
                  ${isActive 
                    ? 'text-white bg-[#1e1e1e]' 
                    : 'text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]'
                  }
                `}
              >
                {languageLabels[language]}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ backgroundColor: languageColors[language] }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Code Display */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={getLanguage(activeTab)}
            style={vscDarkPlus}
            showLineNumbers={true}
            wrapLongLines={false}
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              background: "transparent",
              fontSize: "0.875rem",
              lineHeight: "1.6",
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: "0.875rem",
                lineHeight: "1.6",
              }
            }}
          >
            {codeSnippets[activeTab]}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
