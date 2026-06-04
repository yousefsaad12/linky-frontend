"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { site } from "@/lib/site";

export default function AuthButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Button className={className} disabled>
        Loading...
      </Button>
    );
  }

  if (isAuthenticated) {
    return (
      <Button className={className} asChild>
        <a href="/profile">{user?.name ?? user?.email ?? children}</a>
      </Button>
    );
  }

  return (
    <Button className={className} asChild>
      <a href={site.auth.signIn}>{children}</a>
    </Button>
  );
}
