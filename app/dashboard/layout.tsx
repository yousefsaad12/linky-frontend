import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Linky",
  description: "Full analytics for your short links — clicks, breakdowns, and live feed.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
