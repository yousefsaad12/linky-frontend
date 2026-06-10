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
  const hasApiAccess = user?.features?.apiAccess === true;

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
    if (!hasApiAccess) {
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
  }, [hasApiAccess, toast]);

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

  if (!hasApiAccess) {
    return (
      <Card className="p-12 text-center space-y-6 border-foreground/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/10">
          <Key className="h-8 w-8 text-foreground" />
        </div>
        <div className="space-y-3">
          <h2 className="font-display text-2xl text-foreground">API access is a Pro feature</h2>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Upgrade to Pro to create API keys and integrate lnqo into your
            applications with Bearer token authentication.
          </p>
        </div>
        <Button asChild className="rounded-full px-8 h-12 text-base">
          <Link href="/#pricing">View pricing</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight text-foreground">API keys</h2>
          <p className="text-base text-muted-foreground mt-2 leading-relaxed">
            Create keys for programmatic access. Keys are shown once at creation.
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full px-6 h-12"
          onClick={() => setCreateOpen(true)}
          disabled={keys.length >= 5}
        >
          <Plus className="h-5 w-5 mr-2" />
          Create key
        </Button>
      </div>

      <Alert className="border-foreground/20 bg-foreground/5">
        <Key className="h-5 w-5 text-foreground" />
        <AlertTitle className="text-foreground font-medium">Keep keys secret</AlertTitle>
        <AlertDescription className="text-muted-foreground text-base">
          Use Bearer authentication in server-side code only. Never expose keys in
          client-side JavaScript.
        </AlertDescription>
      </Alert>

      {loading ? (
        <div className="text-base text-muted-foreground py-8">Loading keys…</div>
      ) : keys.length === 0 ? (
        <Card className="p-12 text-center space-y-4 border-foreground/10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-foreground/5">
            <Key className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="font-display text-xl text-foreground">No API keys yet</h3>
            <p className="text-base text-muted-foreground">
              Create your first API key to get started with programmatic access.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {keys.map((key) => (
            <Card
              key={key._id}
              className="flex flex-wrap items-center justify-between gap-6 p-6 border-foreground/10 hover:border-foreground/20 transition-colors"
            >
              <div className="min-w-0 space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-lg text-foreground">{key.name}</p>
                  <span className="px-2 py-1 rounded-full bg-foreground/5 text-xs font-mono text-foreground">
                    {key.prefix}…
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Created {formatDate(key.createdAt)} · Last used{" "}
                  {formatDate(key.lastUsedAt)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 px-6 h-11"
                onClick={() => setRevokeTarget(key)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Revoke
              </Button>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle className="text-2xl">Create API key</DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Give your key a name so you can identify it later.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid gap-2">
                <Label htmlFor="key-name" className="text-base font-medium">Key name</Label>
                <Input
                  id="key-name"
                  placeholder="Production server"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  disabled={creating}
                  maxLength={64}
                  required
                  className="text-base h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={creating}
                className="rounded-full h-11 px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating || !keyName.trim()} className="rounded-full h-11 px-6">
                {creating ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showKeyDialog} onOpenChange={setShowKeyDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Save your API key</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Copy this key now. You won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-lg border border-foreground/20 bg-foreground/5 p-4">
            <code className="flex-1 text-sm font-mono break-all text-foreground">
              {newKeyValue}
            </code>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCopyKey}
              className="rounded-full h-11 px-4"
            >
              {copied ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setShowKeyDialog(false)} className="rounded-full h-11 px-6">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Revoke API key?</AlertDialogTitle>
            <AlertDialogDescription className="text-base text-muted-foreground">
              This will immediately invalidate &ldquo;{revokeTarget?.name}
              &rdquo;. Any integrations using this key will stop working.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={revoking} className="rounded-full h-11 px-6">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevoke}
              disabled={revoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full h-11 px-6"
            >
              {revoking ? "Revoking…" : "Revoke key"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
