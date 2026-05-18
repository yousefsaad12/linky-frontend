import { AlertCircle, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function DashboardLoading({ label = "Loading analytics…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-[320px] flex-col items-center justify-center gap-3 border border-foreground/10 bg-background p-12"
      aria-busy
      aria-live="polite"
    >
      <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
      <p className="text-sm font-mono text-muted-foreground">{label}</p>
    </div>
  );
}

export function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex min-h-[280px] flex-col items-center justify-center gap-4 border border-foreground/10 bg-background p-10 text-center"
      role="alert"
    >
      <AlertCircle className="h-10 w-10 text-foreground/40" />
      <div>
        <p className="font-display text-lg">Could not load dashboard</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Button type="button" variant="outline" className="rounded-full" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

export function DashboardAuthRequired() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="rounded-2xl border border-foreground/10 bg-background p-10">
        <LogIn className="mx-auto mb-4 h-10 w-10 text-foreground/50" />
        <h1 className="font-display text-3xl tracking-tight">Sign in to view analytics</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your click data is scoped to your account. Connect with Google to open the dashboard.
        </p>
        <Button className="mt-6 w-full rounded-full bg-foreground text-background" asChild>
          <a href={site.auth.signIn}>Continue with Google</a>
        </Button>
        <p className="mt-4 text-xs font-mono text-muted-foreground">
          <Link href="/" className="underline-offset-4 hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
