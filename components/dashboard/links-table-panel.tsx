"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { AnalyticsLinkRow, AnalyticsLinksTableResponse } from "@/lib/analytics/types";
import { formatAnalyticsNumber, truncateUrl } from "@/lib/analytics/format";
import { cn } from "@/lib/utils";
import { CreateUrlDialog } from "@/components/dashboard/create-url-dialog";
import { deleteUrl } from "@/lib/url";
import { UrlAuthError, UrlApiError } from "@/lib/url";
import { useToast } from "@/hooks/use-toast";

interface LinksTablePanelProps {
  table: AnalyticsLinksTableResponse;
  sort: "clicks" | "createdAt";
  onSortChange: (sort: "clicks" | "createdAt") => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function LinksTablePanel({
  table,
  sort,
  onSortChange,
  onPageChange,
  loading,
}: LinksTablePanelProps) {
  const { toast } = useToast();

  const handleDelete = async (shortCode: string) => {
    try {
      await deleteUrl(shortCode);
      toast({
        title: "URL deleted",
        description: `Short code ${shortCode} has been deleted`,
      });
      // Refresh the page to show updated links
      window.location.reload();
    } catch (error) {
      if (error instanceof UrlAuthError) {
        toast({
          title: "Authentication required",
          description: "Please sign in to delete URLs",
          variant: "destructive",
        });
      } else if (error instanceof UrlApiError) {
        toast({
          title: "Failed to delete URL",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    }
  };
  return (
    <div className="space-y-px">
      <div className="flex flex-wrap items-center justify-between gap-4 border border-foreground/10 bg-background p-4 lg:p-5">
        <div>
          <h2 className="font-display text-xl">All links</h2>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            {formatAnalyticsNumber(table.total)} total · page {table.page} of{" "}
            {table.totalPages}
          </p>
        </div>
        <div className="flex gap-2">
          <CreateUrlDialog />
          <div className="flex gap-1">
            <SortButton
              active={sort === "clicks"}
              onClick={() => onSortChange("clicks")}
            >
              By clicks
            </SortButton>
            <SortButton
              active={sort === "createdAt"}
              onClick={() => onSortChange("createdAt")}
            >
              By created
            </SortButton>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "border-x border-b border-foreground/10 bg-background overflow-x-auto",
          loading && "opacity-60 pointer-events-none",
        )}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-foreground/10">
              <th className="p-4 font-normal">Short code</th>
              <th className="p-4 font-normal">Destination</th>
              <th className="p-4 font-normal text-right">Clicks</th>
              <th className="p-4 font-normal text-right">Created</th>
              <th className="p-4 font-normal w-10" />
            </tr>
          </thead>
          <tbody>
            {table.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                  No links yet. Create your first short URL via the API.
                </td>
              </tr>
            ) : (
              table.data.map((row) => (
                <LinkRow key={row.shortCode} row={row} onDelete={handleDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {table.totalPages > 1 ? (
        <div className="flex items-center justify-between border border-foreground/10 bg-background px-4 py-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full font-mono text-xs"
            disabled={table.page <= 1}
            onClick={() => onPageChange(table.page - 1)}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </Button>
          <span className="text-xs font-mono text-muted-foreground">
            Page {table.page} / {table.totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full font-mono text-xs"
            disabled={table.page >= table.totalPages}
            onClick={() => onPageChange(table.page + 1)}
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function LinkRow({ row, onDelete }: { row: AnalyticsLinkRow; onDelete: (shortCode: string) => Promise<void> }) {
  const created = new Date(row.createdAt);
  const createdLabel = Number.isNaN(created.getTime())
    ? "—"
    : created.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <tr className="border-b border-foreground/5 last:border-0 hover:bg-foreground/[0.02]">
      <td className="p-4 font-mono">
        <Link
          href={`/dashboard/links/${encodeURIComponent(row.shortCode)}`}
          className="hover:underline underline-offset-4"
        >
          {row.shortCode}
        </Link>
      </td>
      <td className="p-4 max-w-[280px] truncate text-muted-foreground" title={row.originalUrl}>
        {truncateUrl(row.originalUrl, 48)}
      </td>
      <td className="p-4 text-right tabular-nums font-medium">
        {formatAnalyticsNumber(row.clicks)}
      </td>
      <td className="p-4 text-right text-muted-foreground text-xs font-mono">
        {createdLabel}
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/dashboard/links/${encodeURIComponent(row.shortCode)}`}
            className="inline-flex text-muted-foreground hover:text-foreground"
            aria-label={`View analytics for ${row.shortCode}`}
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                aria-label={`Delete ${row.shortCode}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete URL</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the short URL <span className="font-mono">{row.shortCode}</span>? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(row.shortCode)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </td>
    </tr>
  );
}

function SortButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-xs font-mono transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:bg-foreground/5",
      )}
    >
      {children}
    </button>
  );
}
