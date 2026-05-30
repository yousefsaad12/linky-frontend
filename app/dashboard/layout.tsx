import type { Metadata } from "next";
import { AuthGuard } from "@/components/auth/auth-guard";

export const metadata: Metadata = {
  title: "Dashboard — Linky",
  description: "Full analytics for your short links — clicks, breakdowns, and live feed.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
