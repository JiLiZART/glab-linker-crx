
export function getMRUrl(url?: string) {
  if (!url) {
    return null;
  }

  if (!url.includes('/merge_requests/')) {
    return null;
  }

  return url;
}
