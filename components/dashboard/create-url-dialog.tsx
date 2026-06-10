"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, Plus } from "lucide-react";

import { createShortUrl, type CreateUrlRequest } from "@/lib/url";
import { UrlAuthError, UrlApiError } from "@/lib/url";
import { useToast } from "@/hooks/use-toast";

export function CreateUrlDialog() {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdShortUrl, setCreatedShortUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setLoading(true);

    try {
      const data: CreateUrlRequest = {
        originalUrl: originalUrl.trim(),
      };

      const result = await createShortUrl(data);

      toast({
        title: "URL created successfully",
        description: result.shortUrl,
      });

      setOriginalUrl("");
      setCreatedShortUrl(result.shortUrl);
      setCopied(false);

      // ❌ NO refreshUser
      // ❌ NO window.location.reload()

      // (optional best practice: trigger local UI update instead)
    } catch (error) {
      if (error instanceof UrlAuthError) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create URLs",
          variant: "destructive",
        });
      } else if (
        error instanceof UrlApiError &&
        error.status === 403 &&
        error.message.toLowerCase().includes("link limit")
      ) {
        toast({
          title: "Link limit reached",
          description: (
            <span>
              {error.message}{" "}
              <a href="/#pricing" className="underline font-medium">
                Upgrade to Pro
              </a>
            </span>
          ),
          variant: "destructive",
        });
      } else if (error instanceof UrlApiError) {
        toast({
          title: "Failed to create URL",
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
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!createdShortUrl) return;
    const fullUrl = `https://lnqo.vercel.app/${createdShortUrl}`;
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setCreatedShortUrl("");
          setCopied(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create URL
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create short URL</DialogTitle>
          <DialogDescription>
            Enter the destination URL you want to shorten.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Destination URL</label>

            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {createdShortUrl ? (
            <div className="rounded-lg border border-foreground/10 bg-foreground/[0.03] p-3">
              <p className="mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Short URL
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <code
                  className="min-w-0 flex-1 truncate rounded-md border border-foreground/10 bg-background px-3 py-2 text-xs"
                  title={createdShortUrl}
                >
                  {createdShortUrl}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? "Copied" : "Copy URL"}
                </Button>
              </div>
            </div>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={loading || !originalUrl.trim()}>
              {loading ? "Creating..." : createdShortUrl ? "Create another" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
