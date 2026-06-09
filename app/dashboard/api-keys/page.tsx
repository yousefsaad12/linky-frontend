"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ApiKeysPanel } from "@/components/dashboard/api-keys-panel";

export default function ApiKeysPage() {
  return (
    <DashboardShell
      title="API keys"
      subtitle="Manage programmatic access to the lnqo API"
      minimal
    >
      <ApiKeysPanel />
    </DashboardShell>
  );
}
