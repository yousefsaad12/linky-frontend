"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Key, Plus, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/hooks/use-auth";
import {
  AuthApiError,
  createApiKey,
  listApiKeys,
  revokeApiKey,
  type ApiKeySummary,
} from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

function formatDate(value?: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export function ApiKeysPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPro = user?.plan === "pro";

  const [keys, setKeys] = useState<ApiKeySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<ApiKeySummary | null>(null);
  const [revoking, setRevoking] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadKeys = useCallback(async () => {
    if (!isPro) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await listApiKeys();
      setKeys(data);
    } catch (error) {
      toast({
        title: "Failed to load API keys",
        description:
          error instanceof AuthApiError ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isPro, toast]);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setCreating(true);
    try {
      const result = await createApiKey(keyName.trim());
      setNewKeyValue(result.key);
      setShowKeyDialog(true);
      setCreateOpen(false);
      setKeyName("");
      await loadKeys();
    } catch (error) {
      toast({
        title: "Failed to create API key",
        description:
          error instanceof AuthApiError ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeTarget) return;
    const id = revokeTarget._id;
    setRevoking(true);
    try {
      await revokeApiKey(id);
      toast({ title: "API key revoked" });
      setRevokeTarget(null);
      await loadKeys();
    } catch (error) {
      toast({
        title: "Failed to revoke API key",
        description:
          error instanceof AuthApiError ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setRevoking(false);
    }
  };

  const handleCopyKey = async () => {
    if (!newKeyValue) return;
    await navigator.clipboard.writeText(newKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    return (
      <div className="text-sm text-muted-foreground">Loading account…</div>
    );
  }

  if (!isPro) {
    return (
      <Card className="p-8 text-center space-y-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-foreground/5">
          <Key className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="font-display text-xl">API access is a Pro feature</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Upgrade to Pro to create API keys and integrate lnqo into your
            applications with Bearer token authentication.
          </p>
        </div>
        <Button asChild className="rounded-full">
          <Link href="/#pricing">View pricing</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl tracking-tight">API keys</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create keys for programmatic access. Keys are shown once at creation.
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full"
          onClick={() => setCreateOpen(true)}
          disabled={keys.length >= 5}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create key
        </Button>
      </div>

      <Alert>
        <Key className="h-4 w-4" />
        <AlertTitle>Keep keys secret</AlertTitle>
        <AlertDescription>
          Use Bearer authentication in server-side code only. Never expose keys in
          client-side JavaScript.
        </AlertDescription>
      </Alert>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading keys…</div>
      ) : keys.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted-foreground">
          No API keys yet. Create one to get started.
        </Card>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <Card
              key={key._id}
              className="flex flex-wrap items-center justify-between gap-4 p-4"
            >
              <div className="min-w-0 space-y-1">
                <p className="font-medium truncate">{key.name}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {key.prefix}…
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Created {formatDate(key.createdAt)} · Last used{" "}
                  {formatDate(key.lastUsedAt)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full text-destructive hover:text-destructive"
                onClick={() => setRevokeTarget(key)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Revoke
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create API key</DialogTitle>
              <DialogDescription>
                Give your key a name so you can identify it later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="key-name">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="Production server"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  disabled={creating}
                  maxLength={64}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating || !keyName.trim()}>
                {creating ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Save your API key</DialogTitle>
            <DialogDescription>
              Copy this key now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
            <code className="flex-1 text-xs font-mono break-all">
              {newKeyValue}
            </code>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyKey}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setShowKeyDialog(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately invalidate &ldquo;{revokeTarget?.name}
              &rdquo;. Any integrations using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {revoking ? "Revoking…" : "Revoke key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
