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
import { Plus } from "lucide-react";

import { createShortUrl, type CreateUrlRequest } from "@/lib/url";
import { UrlAuthError, UrlApiError } from "@/lib/url";
import { useToast } from "@/hooks/use-toast";

export function CreateUrlDialog() {
  const [open, setOpen] = useState(false);
  const [originalUrl, setOriginalUrl] = useState("");
  const [loading, setLoading] = useState(false);

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
        description: `Short code: ${result.shortCode}`,
      });

      setOriginalUrl("");
      setOpen(false);

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}