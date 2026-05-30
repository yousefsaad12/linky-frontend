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
import { API_ENDPOINTS, DocsScrollProvider } from "@/features/docs";
import type { DocsCategory } from "@/features/docs";
import { DocsContent } from "@/app/docs/docs-content";

export default function DocsPage() {
  const sections = ["introduction", "authentication", ...API_ENDPOINTS.map(e => e.id)];

  return (
    <DocsScrollProvider sections={sections}>
      <DocsContent />
    </DocsScrollProvider>
  );
}
