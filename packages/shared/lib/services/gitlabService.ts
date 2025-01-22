export const GITLAB_API_BASE = 'https://gitlab.com/api/v4';

// const hostname = 'gitlab.bitmware.com';
// const urlPattern = new RegExp(`https://${hostname}/(.+?)/-/merge_requests/(\d+)`);

// const url = 'https://gitlab.bitmware.com/hodl/content/debifi/debifi-akh-panel/-/merge_requests/2';

// url.match(urlPattern);

function mrToApiUrl(hostname: string, mrUrl: string) {
  // Extract project path and MR ID from the URL
  // const urlPattern = /https:\/\/gitlab\.com\/(.+?)\/-\/merge_requests\/(\d+)/;
  const urlPattern = new RegExp(`https://${hostname}/(.+?)/-/merge_requests/(\\d+)`);
  const match = mrUrl.match(urlPattern);

  if (!match) {
    throw new Error('Invalid Merge Request URL format.');
  }

  const projectPath = match[1];
  const mergeRequestId = match[2];

  // Construct the API URL
  return `/projects/${encodeURIComponent(projectPath)}/merge_requests/${mergeRequestId}`;
}

export class GitLabService {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl?: string) {
    this.token = token;
    this.baseUrl = baseUrl || GITLAB_API_BASE;
  }

  private async makeRequest(endpoint: string, method: string, body?: Record<string, unknown>) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`GitLab API error: ${response.statusText}`);
    }

    return response.json();
  }

  getApiHostname() {
    const url = new URL(this.baseUrl);
    return url.hostname;
  }

  async getMRByUrl(url: string) {
    return this.makeRequest(mrToApiUrl(this.getApiHostname(), url), 'GET');
  }

  async mergeMR(projectId: string | number, mrIid: string | number) {
    return this.makeRequest(`/projects/${projectId}/merge_requests/${mrIid}/merge`, 'PUT');
  }

  async closeMR(projectId: string | number, mrIid: string | number) {
    return this.makeRequest(`/projects/${projectId}/merge_requests/${mrIid}`, 'PUT', { state_event: 'close' });
  }
}
