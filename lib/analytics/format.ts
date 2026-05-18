const numberFormatter = new Intl.NumberFormat("en-US");

export function formatAnalyticsNumber(n: number) {
  return numberFormatter.format(n);
}

export function truncateUrl(url: string, max = 36) {
  if (url.length <= max) return url;
  return url.slice(0, max - 1) + "…";
}
