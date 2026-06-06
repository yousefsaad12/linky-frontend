import { redirect } from "next/navigation";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{
    shortcode: string;
  }>;
}

export default async function ShortcodePage({ params }: PageProps) {
  const { shortcode } = await params;
  redirect(`${site.apiUrl}/${shortcode}`);
}