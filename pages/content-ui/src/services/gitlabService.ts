const GITLAB_API_BASE = 'https://gitlab.com/api/v4';

function mrToApiUrl(mrUrl: string) {
  // Extract project path and MR ID from the URL
  const urlPattern = /https:\/\/gitlab\.com\/(.+?)\/-\/merge_requests\/(\d+)/;
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

  private async makeRequest(endpoint: string, method: string, body?: any) {
    const response = await fetch(`${GITLAB_API_BASE}${endpoint}`, {
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

  async getMRByUrl(url: string) {
    return this.makeRequest(mrToApiUrl(url), 'GET');
  }

  async mergeMR(projectId: string, mrIid: string) {
    return this.makeRequest(`/projects/${projectId}/merge_requests/${mrIid}/merge`, 'PUT');
  }

  async closeMR(projectId: string, mrIid: string) {
    return this.makeRequest(`/projects/${projectId}/merge_requests/${mrIid}`, 'PUT', { state_event: 'close' });
  }
}
