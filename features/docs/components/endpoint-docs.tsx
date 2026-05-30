"use client";

import React, { useEffect, useState } from "react";
import { Lock, Globe, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { createHighlighter } from "shiki";



export interface ParamInfo {

  name: string;

  type: string;

  required: boolean;

  description: string;

}



export interface Endpoint {

  id: string;

  category: "redirect" | "url" | "analytics";

  method: "GET" | "POST";

  path: string;

  title: string;

  description: string;

  authRequired: boolean;

  headers?: ParamInfo[];

  queryParams?: ParamInfo[];

  bodyParams?: ParamInfo[];

  responseDescription: string;

}



interface EndpointDocsProps {
  endpoint: Endpoint;
}

export function getCodeExample(endpoint: Endpoint, lang: 'javascript' | 'python' | 'curl' | 'go' | 'java' | 'dotnet' = 'javascript'): string {
  const { method, path, authRequired, bodyParams, queryParams } = endpoint;
  
  let example = "";
  
  if (lang === 'javascript') {
    if (method === "GET") {
      example += `const response = await fetch("${path}`;
      if (queryParams && queryParams.length > 0) {
        const params = queryParams
          .filter(p => p.required)
          .map(p => `${p.name}=VALUE`)
          .join("&");
        if (params) example += `?${params}`;
      }
      example += `"`;
      if (authRequired) {
        example += `,\n  {\n`;
        example += `    headers: {\n`;
        example += `      "Authorization": "Bearer YOUR_API_KEY"\n`;
        example += `    }\n`;
        example += `  }\n`;
      }
      example += `);\n\n`;
      example += `const data = await response.json();\n`;
      example += `console.log(data);`;
    } else if (method === "POST") {
      example += `const response = await fetch("${path}"\n`;
      example += `  , {\n`;
      example += `    method: "POST",\n`;
      example += `    headers: {\n`;
      if (authRequired) {
        example += `      "Authorization": "Bearer YOUR_API_KEY",\n`;
      }
      example += `      "Content-Type": "application/json"\n`;
      example += `    },\n`;
      if (bodyParams && bodyParams.length > 0) {
        example += `    body: JSON.stringify({\n`;
        bodyParams.forEach((param, i) => {
          example += `      "${param.name}": "VALUE"${i < bodyParams.length - 1 ? ",\n" : "\n"}`;
        });
        example += `    })\n`;
      }
      example += `  }\n`;
      example += `);\n\n`;
      example += `const data = await response.json();\n`;
      example += `console.log(data);`;
    }
  } else if (lang === 'python') {
    if (method === "GET") {
      example += `import requests\n\n`;
      example += `url = "${path}"\n`;
      if (authRequired) {
        example += `headers = {"Authorization": "Bearer YOUR_API_KEY"}\n`;
        example += `response = requests.get(url, headers=headers)\n`;
      } else {
        example += `response = requests.get(url)\n`;
      }
      example += `\n`;
      example += `data = response.json()\n`;
      example += `print(data)`;
    } else if (method === "POST") {
      example += `import requests\n\n`;
      example += `url = "${path}"\n`;
      example += `headers = {\n`;
      if (authRequired) {
        example += `    "Authorization": "Bearer YOUR_API_KEY",\n`;
      }
      example += `    "Content-Type": "application/json"\n`;
      example += `}\n`;
      if (bodyParams && bodyParams.length > 0) {
        example += `data = {\n`;
        bodyParams.forEach((param, i) => {
          example += `    "${param.name}": "VALUE"${i < bodyParams.length - 1 ? ",\n" : "\n"}`;
        });
        example += `}\n`;
        example += `response = requests.post(url, headers=headers, json=data)\n`;
      } else {
        example += `response = requests.post(url, headers=headers)\n`;
      }
      example += `\n`;
      example += `result = response.json()\n`;
      example += `print(result)`;
    }
  } else if (lang === 'curl') {
    if (method === "GET") {
      example += `curl -X GET "${path}"`;
      if (authRequired) {
        example += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
      }
    } else if (method === "POST") {
      example += `curl -X POST "${path}"`;
      if (authRequired) {
        example += ` \\\n  -H "Authorization: Bearer YOUR_API_KEY"`;
      }
      example += ` \\\n  -H "Content-Type: application/json"`;
      if (bodyParams && bodyParams.length > 0) {
        example += ` \\\n  -d '{`;
        bodyParams.forEach((param, i) => {
          example += `\n    "${param.name}": "VALUE"${i < bodyParams.length - 1 ? "," : ""}`;
        });
        example += `\n  }'`;
      }
    }
  } else if (lang === 'go') {
    if (method === "GET") {
      example += `package main\n\n`;
      example += `import (\n`;
      example += `    "fmt"\n`;
      example += `    "io"\n`;
      example += `    "net/http"\n`;
      example += `)\n\n`;
      example += `func main() {\n`;
      example += `    req, _ := http.NewRequest("GET", "${path}", nil)\n`;
      if (authRequired) {
        example += `    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")\n`;
      }
      example += `    \n`;
      example += `    client := &http.Client{}\n`;
      example += `    resp, err := client.Do(req)\n`;
      example += `    if err != nil {\n`;
      example += `        fmt.Println("Error:", err)\n`;
      example += `        return\n`;
      example += `    }\n`;
      example += `    defer resp.Body.Close()\n`;
      example += `    \n`;
      example += `    body, _ := io.ReadAll(resp.Body)\n`;
      example += `    fmt.Println(string(body))\n`;
      example += `}\n`;
    } else if (method === "POST") {
      example += `package main\n\n`;
      example += `import (\n`;
      example += `    "bytes"\n`;
      example += `    "encoding/json"\n`;
      example += `    "fmt"\n`;
      example += `    "io"\n`;
      example += `    "net/http"\n`;
      example += `)\n\n`;
      example += `func main() {\n`;
      if (bodyParams && bodyParams.length > 0) {
        example += `    data := map[string]string{\n`;
        bodyParams.forEach((param, i) => {
          example += `        "${param.name}": "VALUE"${i < bodyParams.length - 1 ? ",\n" : "\n"}`;
        });
        example += `    }\n`;
        example += `    jsonData, _ := json.Marshal(data)\n`;
        example += `    req, _ := http.NewRequest("POST", "${path}", bytes.NewBuffer(jsonData))\n`;
      } else {
        example += `    req, _ := http.NewRequest("POST", "${path}", nil)\n`;
      }
      example += `    \n`;
      example += `    req.Header.Set("Content-Type", "application/json")\n`;
      if (authRequired) {
        example += `    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")\n`;
      }
      example += `    \n`;
      example += `    client := &http.Client{}\n`;
      example += `    resp, err := client.Do(req)\n`;
      example += `    if err != nil {\n`;
      example += `        fmt.Println("Error:", err)\n`;
      example += `        return\n`;
      example += `    }\n`;
      example += `    defer resp.Body.Close()\n`;
      example += `    \n`;
      example += `    body, _ := io.ReadAll(resp.Body)\n`;
      example += `    fmt.Println(string(body))\n`;
      example += `}\n`;
    }
  } else if (lang === 'java') {
    if (method === "GET") {
      example += `import java.net.URI;\n`;
      example += `import java.net.http.HttpClient;\n`;
      example += `import java.net.http.HttpRequest;\n`;
      example += `import java.net.http.HttpResponse;\n\n`;
      example += `public class Main {\n`;
      example += `    public static void main(String[] args) {\n`;
      example += `        HttpClient client = HttpClient.newHttpClient();\n`;
      example += `        \n`;
      example += `        HttpRequest request = HttpRequest.newBuilder()\n`;
      example += `            .uri(URI.create("${path}"))\n`;
      if (authRequired) {
        example += `            .header("Authorization", "Bearer YOUR_API_KEY")\n`;
      }
      example += `            .GET()\n`;
      example += `            .build();\n`;
      example += `        \n`;
      example += `        try {\n`;
      example += `            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n`;
      example += `            System.out.println(response.body());\n`;
      example += `        } catch (Exception e) {\n`;
      example += `            e.printStackTrace();\n`;
      example += `        }\n`;
      example += `    }\n`;
      example += `}\n`;
    } else if (method === "POST") {
      example += `import java.net.URI;\n`;
      example += `import java.net.http.HttpClient;\n`;
      example += `import java.net.http.HttpRequest;\n`;
      example += `import java.net.http.HttpResponse;\n`;
      example += `import java.net.http.HttpRequest.BodyPublishers;\n\n`;
      example += `public class Main {\n`;
      example += `    public static void main(String[] args) {\n`;
      example += `        HttpClient client = HttpClient.newHttpClient();\n`;
      example += `        \n`;
      example += `        HttpRequest request = HttpRequest.newBuilder()\n`;
      example += `            .uri(URI.create("${path}"))\n`;
      example += `            .header("Content-Type", "application/json")\n`;
      if (authRequired) {
        example += `            .header("Authorization", "Bearer YOUR_API_KEY")\n`;
      }
      if (bodyParams && bodyParams.length > 0) {
        example += `            .POST(BodyPublishers.ofString("{`;
        bodyParams.forEach((param, i) => {
          example += `\\\"${param.name}\\\": \\\"VALUE\\\"${i < bodyParams.length - 1 ? `,` : ``}`;
        });
        example += `}"))\n`;
      } else {
        example += `            .POST(BodyPublishers.noBody())\n`;
      }
      example += `            .build();\n`;
      example += `        \n`;
      example += `        try {\n`;
      example += `            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());\n`;
      example += `            System.out.println(response.body());\n`;
      example += `        } catch (Exception e) {\n`;
      example += `            e.printStackTrace();\n`;
      example += `        }\n`;
      example += `    }\n`;
      example += `}\n`;
    }
  } else if (lang === 'dotnet') {
    if (method === "GET") {
      example += `using System;\n`;
      example += `using System.Net.Http;\n`;
      example += `using System.Threading.Tasks;\n\n`;
      example += `class Program {\n`;
      example += `    static async Task Main() {\n`;
      example += `        using var client = new HttpClient();\n`;
      if (authRequired) {
        example += `        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");\n`;
      }
      example += `        \n`;
      example += `        var response = await client.GetAsync("${path}");\n`;
      example += `        \n`;
      example += `        var content = await response.Content.ReadAsStringAsync();\n`;
      example += `        Console.WriteLine(content);\n`;
      example += `    }\n`;
      example += `}\n`;
    } else if (method === "POST") {
      example += `using System;\n`;
      example += `using System.Net.Http;\n`;
      example += `using System.Text;\n`;
      example += `using System.Threading.Tasks;\n`;
      example += `using Newtonsoft.Json;\n\n`;
      example += `class Program {\n`;
      example += `    static async Task Main() {\n`;
      example += `        using var client = new HttpClient();\n`;
      example += `        client.DefaultRequestHeaders.Add("Content-Type", "application/json");\n`;
      if (authRequired) {
        example += `        client.DefaultRequestHeaders.Add("Authorization", "Bearer YOUR_API_KEY");\n`;
      }
      example += `        \n`;
      if (bodyParams && bodyParams.length > 0) {
        example += `        var data = new {\n`;
        bodyParams.forEach((param, i) => {
          example += `            ${param.name} = "VALUE"${i < bodyParams.length - 1 ? ",\n" : "\n"}`;
        });
        example += `        };\n`;
        example += `        var json = JsonConvert.SerializeObject(data);\n`;
        example += `        var content = new StringContent(json, Encoding.UTF8, "application/json");\n`;
        example += `        \n`;
        example += `        var response = await client.PostAsync("${path}", content);\n`;
      } else {
        example += `        var response = await client.PostAsync("${path}", null);\n`;
      }
      example += `        \n`;
      example += `        var responseContent = await response.Content.ReadAsStringAsync();\n`;
      example += `        Console.WriteLine(responseContent);\n`;
      example += `    }\n`;
      example += `}\n`;
    }
  }
  
  return example;
}

function getJsonResponse(endpoint: Endpoint): string {
  const { id, category, method } = endpoint;
  
  let response = "";
  
  if (id === "redirect-link") {
    response += `{\n`;
    response += `  "status": "redirect",\n`;
    response += `  "destination": "https://example.com/original-url",\n`;
    response += `  "shortCode": "abc123",\n`;
    response += `  "clicks": 42\n`;
    response += `}`;
  } else if (id === "create-link") {
    response += `{\n`;
    response += `  "success": true,\n`;
    response += `  "shortUrl": "https://linky.app/abc123",\n`;
    response += `  "shortCode": "abc123",\n`;
    response += `  "originalUrl": "https://example.com/very-long-url",\n`;
    response += `  "createdAt": "2024-01-15T10:30:00Z"\n`;
    response += `}`;
  } else if (id === "analytics-overview") {
    response += `{\n`;
    response += `  "totalClicks": 1250,\n`;
    response += `  "activeLinks": 45,\n`;
    response += `  "topCountries": ["US", "UK", "DE"],\n`;
    response += `  "topDevices": ["mobile", "desktop"],\n`;
    response += `  "period": "7d"\n`;
    response += `}`;
  } else if (id === "analytics-top-links") {
    response += `[\n`;
    response += `  {\n`;
    response += `    "shortCode": "abc123",\n`;
    response += `    "shortUrl": "https://linky.app/abc123",\n`;
    response += `    "clicks": 342,\n`;
    response += `    "createdAt": "2024-01-10T08:00:00Z"\n`;
    response += `  },\n`;
    response += `  {\n`;
    response += `    "shortCode": "def456",\n`;
    response += `    "shortUrl": "https://linky.app/def456",\n`;
    response += `    "clicks": 287,\n`;
    response += `    "createdAt": "2024-01-12T14:30:00Z"\n`;
    response += `  }\n`;
    response += `]`;
  } else if (id === "analytics-links") {
    response += `{\n`;
    response += `  "links": [\n`;
    response += `    {\n`;
    response += `      "shortCode": "abc123",\n`;
    response += `      "shortUrl": "https://linky.app/abc123",\n`;
    response += `      "clicks": 342,\n`;
    response += `      "createdAt": "2024-01-10T08:00:00Z"\n`;
    response += `    }\n`;
    response += `  ],\n`;
    response += `  "total": 45,\n`;
    response += `  "page": 1,\n`;
    response += `  "limit": 20\n`;
    response += `}`;
  } else if (id === "analytics-recent-clicks") {
    response += `[\n`;
    response += `  {\n`;
    response += `    "shortCode": "abc123",\n`;
    response += `    "clickedAt": "2024-01-15T10:30:00Z",\n`;
    response += `    "country": "US",\n`;
    response += `    "device": "mobile",\n`;
    response += `    "browser": "Chrome"\n`;
    response += `  },\n`;
    response += `  {\n`;
    response += `    "shortCode": "def456",\n`;
    response += `    "clickedAt": "2024-01-15T10:29:00Z",\n`;
    response += `    "country": "UK",\n`;
    response += `    "device": "desktop",\n`;
    response += `    "browser": "Firefox"\n`;
    response += `  }\n`;
    response += `]`;
  } else if (id === "analytics-link-detail") {
    response += `{\n`;
    response += `  "shortCode": "abc123",\n`;
    response += `  "shortUrl": "https://linky.app/abc123",\n`;
    response += `  "originalUrl": "https://example.com/original",\n`;
    response += `  "totalClicks": 342,\n`;
    response += `  "clicksOverTime": [\n`;
    response += `    {"date": "2024-01-10", "clicks": 45},\n`;
    response += `    {"date": "2024-01-11", "clicks": 67},\n`;
    response += `    {"date": "2024-01-12", "clicks": 89}\n`;
    response += `  ],\n`;
    response += `  "countries": {"US": 120, "UK": 85, "DE": 45},\n`;
    response += `  "devices": {"mobile": 200, "desktop": 142}\n`;
    response += `}`;
  }
  
  return response;
}

export function EndpointDocs({ endpoint }: EndpointDocsProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");
  const [highlightedJson, setHighlightedJson] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLang, setSelectedLang] = useState<'javascript' | 'python' | 'curl' | 'go' | 'java' | 'dotnet'>('javascript');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const handleCopyCode = async () => {
    const code = getCodeExample(endpoint, selectedLang);
    await navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyJson = async () => {
    const json = getJsonResponse(endpoint);
    await navigator.clipboard.writeText(json);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  useEffect(() => {
    async function highlightCode() {
      try {
        const highlighter = await createHighlighter({
          themes: ['vitesse-dark'],
          langs: ['javascript', 'python', 'bash', 'typescript', 'go', 'java', 'csharp', 'json']
        });
        
        const code = getCodeExample(endpoint, selectedLang);
        const lang = selectedLang === 'curl' ? 'bash' : selectedLang === 'dotnet' ? 'csharp' : selectedLang;
        const html = highlighter.codeToHtml(code, {
          lang,
          theme: 'vitesse-dark'
        });
        
        const jsonResponse = getJsonResponse(endpoint);
        const jsonHtml = highlighter.codeToHtml(jsonResponse, {
          lang: 'json',
          theme: 'vitesse-dark'
        });
        
        setHighlightedCode(html);
        setHighlightedJson(jsonHtml);
      } catch (error) {
        console.error('Failed to highlight code:', error);
        setHighlightedCode(`<pre class="text-[10px] lg:text-xs font-mono text-white/80 whitespace-pre">${getCodeExample(endpoint, selectedLang)}</pre>`);
        setHighlightedJson(`<pre class="text-[10px] lg:text-xs font-mono text-white/80 whitespace-pre">${getJsonResponse(endpoint)}</pre>`);
      } finally {
        setIsLoading(false);
      }
    }

    highlightCode();
  }, [endpoint, selectedLang]);

  return (

    <div className="space-y-4 lg:space-y-6">

      <div className="space-y-2 lg:space-y-3">

        <div className="flex flex-wrap items-center gap-2 lg:gap-3">

          <span className={cn(

            "text-[10px] lg:text-xs font-mono font-semibold px-2 lg:px-2.5 py-1 rounded border leading-none tracking-wide",

            endpoint.method === "POST" 

              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"

              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"

          )}>

            {endpoint.method}

          </span>

          <code className="text-[10px] lg:text-sm font-mono text-white font-medium bg-white/5 border border-white/10 px-1.5 lg:px-2 py-0.5 rounded">

            {endpoint.path}

          </code>

          {endpoint.authRequired ? (

            <span className="inline-flex items-center gap-1 text-[9px] lg:text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 lg:px-2 py-0.5 rounded">

              <Lock className="h-2 w-2 lg:h-2.5 lg:w-2.5" />

              <span className="hidden sm:inline">Auth Key Req.</span>

              <span className="sm:hidden">Auth</span>

            </span>

          ) : (

            <span className="inline-flex items-center gap-1 text-[9px] lg:text-[10px] font-mono bg-white/10 text-white/50 border border-white/5 px-1.5 lg:px-2 py-0.5 rounded">

              <Globe className="h-2 w-2 lg:h-2.5 lg:w-2.5" />

              <span className="hidden sm:inline">Public Access</span>

              <span className="sm:hidden">Public</span>

            </span>

          )}

        </div>

        <h3 className="text-xl lg:text-2xl font-display tracking-tight text-white font-medium pt-1 lg:pt-2">

          {endpoint.title}

        </h3>

        <p className="text-white/70 text-[11px] sm:text-xs lg:text-sm leading-relaxed">
          {endpoint.description}
        </p>
      </div>

      {/* Simple Code Example with Syntax Highlighting */}
      <div className="space-y-2 lg:space-y-3">
        <h4 className="text-[10px] lg:text-[11px] font-mono text-white/40 uppercase tracking-widest">Example</h4>
        <div className="bg-[#181818] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="px-3 lg:px-4 py-2 border-b border-white/5 bg-[#1e1e1e] flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">{endpoint.method} Request</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="text-[9px] lg:text-[10px] font-mono px-2 py-1 rounded transition-colors text-white/40 hover:text-white/60 hover:bg-white/5 flex items-center gap-1"
              >
                {copiedCode ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedCode ? 'Copied' : 'Copy'}
              </button>
              <div className="flex gap-1">
              {(['javascript', 'python', 'curl', 'go', 'java', 'dotnet'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={cn(
                    "text-[9px] lg:text-[10px] font-mono px-2 py-1 rounded transition-colors",
                    selectedLang === lang
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/60 hover:bg-white/5"
                  )}
                >
                  {lang === 'javascript' ? 'Node.js' : lang === 'python' ? 'Python' : lang === 'curl' ? 'cURL' : lang === 'go' ? 'Go' : lang === 'java' ? 'Java' : '.NET'}
                </button>
              ))}
              </div>
            </div>
          </div>
          <div className="p-3 lg:p-4 overflow-x-auto">
            {isLoading ? (
              <pre className="text-[10px] lg:text-xs font-mono text-white/80 whitespace-pre">
                {getCodeExample(endpoint, selectedLang)}
              </pre>
            ) : (
              <div 
                className="text-[10px] lg:text-xs [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0"
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            )}
          </div>
        </div>
      </div>

      {/* JSON Response Example */}
      <div className="space-y-2 lg:space-y-3">
        <h4 className="text-[10px] lg:text-[11px] font-mono text-white/40 uppercase tracking-widest">Response</h4>
        <div className="bg-[#181818] border border-white/5 rounded-xl overflow-hidden shadow-xl">
          <div className="px-3 lg:px-4 py-2 border-b border-white/5 bg-[#1e1e1e] flex items-center justify-between">
            <span className="text-[10px] font-mono text-white/40">JSON Response</span>
            <button
              onClick={handleCopyJson}
              className="text-[9px] lg:text-[10px] font-mono px-2 py-1 rounded transition-colors text-white/40 hover:text-white/60 hover:bg-white/5 flex items-center gap-1"
            >
              {copiedJson ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copiedJson ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="p-3 lg:p-4 overflow-x-auto">
            {isLoading ? (
              <pre className="text-[10px] lg:text-xs font-mono text-white/80 whitespace-pre">
                {getJsonResponse(endpoint)}
              </pre>
            ) : (
              <div 
                className="text-[10px] lg:text-xs [&>pre]:!bg-transparent [&>pre]:!p-0 [&>pre]:!m-0"
                dangerouslySetInnerHTML={{ __html: highlightedJson }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Headers Table */}

      {endpoint.headers && endpoint.headers.length > 0 && (

        <div className="space-y-2 lg:space-y-3">

          <h4 className="text-[10px] lg:text-[11px] font-mono text-white/40 uppercase tracking-widest">HTTP Headers</h4>

          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">

            <div className="overflow-x-auto">

              <table className="w-full border-collapse text-left text-[10px] lg:text-xs">

                <thead>

                  <tr className="border-b border-white/5 bg-white/[0.02]">

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium">Header Name</th>

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium">Type</th>

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium text-right">Required</th>

                  </tr>

                </thead>

                <tbody>

                  {endpoint.headers.map(h => (

                    <tr key={h.name} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">

                      <td className="p-2 lg:p-3">

                        <div className="font-mono text-white font-medium text-[10px] lg:text-xs">{h.name}</div>

                        <div className="text-[10px] lg:text-[11px] text-white/50 mt-0.5 lg:mt-1 leading-normal">{h.description}</div>

                      </td>

                      <td className="p-2 lg:p-3 font-mono text-white/40 text-[10px] lg:text-xs">{h.type}</td>

                      <td className="p-2 lg:p-3 text-right">

                        <span className={cn(

                          "font-mono text-[9px] lg:text-[10px] px-1 lg:px-1.5 py-0.5 rounded",

                          h.required ? "bg-red-500/15 text-red-400" : "bg-white/10 text-white/50"

                        )}>

                          {h.required ? "yes" : "no"}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}



      {/* Query Params Table */}

      {endpoint.queryParams && endpoint.queryParams.length > 0 && (

        <div className="space-y-2 lg:space-y-3">

          <h4 className="text-[10px] lg:text-[11px] font-mono text-white/40 uppercase tracking-widest">Query Parameters</h4>

          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">

            <div className="overflow-x-auto">

              <table className="w-full border-collapse text-left text-[10px] lg:text-xs">

                <thead>

                  <tr className="border-b border-white/5 bg-white/[0.02]">

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium">Parameter</th>

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium">Type</th>

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium text-right">Required</th>

                  </tr>

                </thead>

                <tbody>

                  {endpoint.queryParams.map(q => (

                    <tr key={q.name} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">

                      <td className="p-2 lg:p-3">

                        <div className="font-mono text-white font-medium text-[10px] lg:text-xs">{q.name}</div>

                        <div className="text-[10px] lg:text-[11px] text-white/50 mt-0.5 lg:mt-1 leading-normal">{q.description}</div>

                      </td>

                      <td className="p-2 lg:p-3 font-mono text-white/40 text-[10px] lg:text-xs">{q.type}</td>

                      <td className="p-2 lg:p-3 text-right">

                        <span className={cn(

                          "font-mono text-[9px] lg:text-[10px] px-1 lg:px-1.5 py-0.5 rounded",

                          q.required ? "bg-red-500/15 text-red-400" : "bg-white/10 text-white/50"

                        )}>

                          {q.required ? "yes" : "no"}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}



      {/* Request Body Params Table */}

      {endpoint.bodyParams && endpoint.bodyParams.length > 0 && (

        <div className="space-y-2 lg:space-y-3">

          <h4 className="text-[10px] lg:text-[11px] font-mono text-white/40 uppercase tracking-widest">JSON Request Body</h4>

          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">

            <div className="overflow-x-auto">

              <table className="w-full border-collapse text-left text-[10px] lg:text-xs">

                <thead>

                  <tr className="border-b border-white/5 bg-white/[0.02]">

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium">Field</th>

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium">Type</th>

                    <th className="p-2 lg:p-3 font-mono text-white/40 font-medium text-right">Required</th>

                  </tr>

                </thead>

                <tbody>

                  {endpoint.bodyParams.map(b => (

                    <tr key={b.name} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">

                      <td className="p-2 lg:p-3">

                        <div className="font-mono text-white font-medium text-[10px] lg:text-xs">{b.name}</div>

                        <div className="text-[10px] lg:text-[11px] text-white/50 mt-0.5 lg:mt-1 leading-normal">{b.description}</div>

                      </td>

                      <td className="p-2 lg:p-3 font-mono text-white/40 text-[10px] lg:text-xs">{b.type}</td>

                      <td className="p-2 lg:p-3 text-right">

                        <span className={cn(

                          "font-mono text-[9px] lg:text-[10px] px-1 lg:px-1.5 py-0.5 rounded",

                          b.required ? "bg-red-500/15 text-red-400" : "bg-white/10 text-white/50"

                        )}>

                          {b.required ? "yes" : "no"}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      )}



      {/* Response Fields Description */}

      <div className="space-y-2 lg:space-y-3 pt-1 lg:pt-2">

        <h4 className="text-[10px] lg:text-[11px] font-mono text-white/40 uppercase tracking-widest">Response Details</h4>

        <p className="text-white/60 text-[11px] sm:text-xs leading-relaxed pl-2 border-l border-white/10">

          {endpoint.responseDescription}

        </p>

      </div>

    </div>

  );

}

