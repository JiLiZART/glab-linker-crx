
export function extractMRFromUrl(mrUrl: string, hostname: string) {
  // Extract project path and MR ID from the URL
  // const urlPattern = /https:\/\/gitlab\.com\/(.+?)\/-\/merge_requests\/(\d+)/;
  const urlPattern = new RegExp(`https://${hostname}/(.+?)/-/merge_requests/(\\d+)`);
  const match = mrUrl.match(urlPattern);

  if (!match) {
    throw new Error('Invalid Merge Request URL format.');
  }

  const projectId = match[1];
  const mrIid = match[2];

  // Construct the API URL
  return {
    projectId,
    mrIid,
  };
}
