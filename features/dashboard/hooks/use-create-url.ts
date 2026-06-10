import { useState } from "react";
import { createShortUrl, UrlAuthError, UrlApiError } from "@/lib/url/api";
import { useToast } from "@/hooks/use-toast";

export function useCreateUrl() {
  const [loading, setLoading] = useState(false);
  const [shortCode, setShortCode] = useState("");
  const { toast } = useToast();

  const createUrl = async (url: string) => {
    if (!url.trim()) return;

    setLoading(true);
    try {
      const result = await createShortUrl({ originalUrl: url.trim() }, { suppressToasts: true });
      setShortCode(result.shortCode);
      toast({
        title: "URL created successfully",
        description: (result as any).message || `Short code: ${result.shortCode}`,
      });
      return result;
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
          description: error.message,
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
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createUrl, loading, shortCode };
}
