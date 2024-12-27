const GITLAB_API_BASE = 'https://gitlab.com/api/v4';

export class GitLabService {
  private token: string;

  constructor(token: string) {
    this.token = token;
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

  async mergeMR(projectId: string, mrIid: string) {
    return this.makeRequest(`/projects/${projectId}/merge_requests/${mrIid}/merge`, 'PUT');
  }

  async closeMR(projectId: string, mrIid: string) {
    return this.makeRequest(`/projects/${projectId}/merge_requests/${mrIid}`, 'PUT', { state_event: 'close' });
  }
}
