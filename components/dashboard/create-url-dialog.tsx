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
import { Label } from "@/components/ui/label";
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
      const data: CreateUrlRequest = { originalUrl: originalUrl.trim() };
      const result = await createShortUrl(data);
      
      toast({
        title: "URL created successfully",
        description: `Short code: ${result.shortCode}`,
      });
      
      setOpen(false);
      setOriginalUrl("");
      
      // Refresh the page to show the new link
      window.location.reload();
    } catch (error) {
      if (error instanceof UrlAuthError) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create URLs",
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
        <Button size="sm" className="rounded-full">
          <Plus className="h-4 w-4 mr-2" />
          Create URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create short URL</DialogTitle>
            <DialogDescription>
              Enter the destination URL you want to shorten.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Destination URL</Label>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
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
