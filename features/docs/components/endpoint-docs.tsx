"use client";

import React from "react";
import { Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function EndpointDocs({ endpoint }: EndpointDocsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn(
            "text-xs font-mono font-semibold px-2.5 py-1 rounded border leading-none tracking-wide",
            endpoint.method === "POST" 
              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          )}>
            {endpoint.method}
          </span>
          <code className="text-sm font-mono text-white font-medium bg-white/5 border border-white/10 px-2 py-0.5 rounded">
            {endpoint.path}
          </code>
          {endpoint.authRequired ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
              <Lock className="h-2.5 w-2.5" />
              Auth Key Req.
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-white/10 text-white/50 border border-white/5 px-2 py-0.5 rounded">
              <Globe className="h-2.5 w-2.5" />
              Public Access
            </span>
          )}
        </div>
        <h3 className="text-2xl font-display tracking-tight text-white font-medium pt-2">
          {endpoint.title}
        </h3>
        <p className="text-white/70 text-sm leading-relaxed">
          {endpoint.description}
        </p>
      </div>

      {/* Headers Table */}
      {endpoint.headers && endpoint.headers.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-mono text-white/40 uppercase tracking-widest">HTTP Headers</h4>
          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-3 font-mono text-white/40 font-medium">Header Name</th>
                  <th className="p-3 font-mono text-white/40 font-medium">Type</th>
                  <th className="p-3 font-mono text-white/40 font-medium text-right">Required</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.headers.map(h => (
                  <tr key={h.name} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">
                    <td className="p-3">
                      <div className="font-mono text-white font-medium">{h.name}</div>
                      <div className="text-[11px] text-white/50 mt-1 leading-normal">{h.description}</div>
                    </td>
                    <td className="p-3 font-mono text-white/40">{h.type}</td>
                    <td className="p-3 text-right">
                      <span className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded",
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
      )}

      {/* Query Params Table */}
      {endpoint.queryParams && endpoint.queryParams.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Query Parameters</h4>
          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-3 font-mono text-white/40 font-medium">Parameter</th>
                  <th className="p-3 font-mono text-white/40 font-medium">Type</th>
                  <th className="p-3 font-mono text-white/40 font-medium text-right">Required</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.queryParams.map(q => (
                  <tr key={q.name} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">
                    <td className="p-3">
                      <div className="font-mono text-white font-medium">{q.name}</div>
                      <div className="text-[11px] text-white/50 mt-1 leading-normal">{q.description}</div>
                    </td>
                    <td className="p-3 font-mono text-white/40">{q.type}</td>
                    <td className="p-3 text-right">
                      <span className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded",
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
      )}

      {/* Request Body Params Table */}
      {endpoint.bodyParams && endpoint.bodyParams.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-mono text-white/40 uppercase tracking-widest">JSON Request Body</h4>
          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="p-3 font-mono text-white/40 font-medium">Field</th>
                  <th className="p-3 font-mono text-white/40 font-medium">Type</th>
                  <th className="p-3 font-mono text-white/40 font-medium text-right">Required</th>
                </tr>
              </thead>
              <tbody>
                {endpoint.bodyParams.map(b => (
                  <tr key={b.name} className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.01]">
                    <td className="p-3">
                      <div className="font-mono text-white font-medium">{b.name}</div>
                      <div className="text-[11px] text-white/50 mt-1 leading-normal">{b.description}</div>
                    </td>
                    <td className="p-3 font-mono text-white/40">{b.type}</td>
                    <td className="p-3 text-right">
                      <span className={cn(
                        "font-mono text-[10px] px-1.5 py-0.5 rounded",
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
      )}

      {/* Response Fields Description */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[11px] font-mono text-white/40 uppercase tracking-widest">Response Details</h4>
        <p className="text-white/60 text-xs leading-relaxed pl-2 border-l border-white/10">
          {endpoint.responseDescription}
        </p>
      </div>
    </div>
  );
}
