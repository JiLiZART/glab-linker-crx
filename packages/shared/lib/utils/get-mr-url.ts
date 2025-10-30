export function getMRUrl(url?: string | null) {
  if (!url) {
    return null;
  }

  if (!url.includes('/merge_requests/')) {
    return null;
  }

  console.log('getMRUrl', { url });

  return url;
}
