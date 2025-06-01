import type {
  CommitResponse,
  DiffResponse,
  EnvironmentResponse,
  MergeRequestResponse,
  PipelineResponse,
} from './types';

export const GITLAB_BASE = 'https://gitlab.com';

// ${encodeURIComponent(projectId)}

function tryJSONParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export class GitlabApi {
  private token: string;
  private baseUrl: string;

  constructor(token: string, baseUrl?: string) {
    if (!token) {
      throw new Error('GitLab token is required');
    }

    this.token = token;
    this.baseUrl = baseUrl || GITLAB_BASE;
  }

  private async api<Data>(endpoint: string, method: string, body?: Record<string, unknown>): Promise<Data> {
    const response = await fetch(`${this.baseUrl}/api/v4/${endpoint}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`GitLab API error: ${response.statusText}`, { cause: tryJSONParse(await response.text()) });
    }

    return response.json();
  }

  getApiHostname() {
    const url = new URL(this.baseUrl);
    return url.hostname;
  }

  async getProjects() {
    return this.api<unknown[]>('projects', 'GET');
  }

  async getMRCommits(projectId: string | number, mrIid: string | number) {
    return this.api<CommitResponse[]>(
      `projects/${encodeURIComponent(projectId)}/merge_requests/${mrIid}/commits`,
      'GET',
    );
  }

  async getMRPipelines(projectId: string | number, mrIid: string | number) {
    return this.api<PipelineResponse[]>(
      `projects/${encodeURIComponent(projectId)}/merge_requests/${mrIid}/pipelines`,
      'GET',
    );
  }

  async getMRDiff(projectId: string | number, mrIid: string | number) {
    return this.api<DiffResponse[]>(`projects/${encodeURIComponent(projectId)}/merge_requests/${mrIid}/diffs`, 'GET');
  }

  async getMREnvironments(projectId: string | number, ref: string) {
    return this.api<EnvironmentResponse[]>(
      `projects/${encodeURIComponent(projectId)}/environments?search=${encodeURIComponent(ref)}`,
      'GET',
    );
  }

  async getMRList(projectId: string | number) {
    return this.api<MergeRequestResponse[]>(`projects/${encodeURIComponent(projectId)}/merge_requests`, 'GET');
  }

  async getMRById(projectId: string | number, mrIid: string | number) {
    return this.api<MergeRequestResponse>(`projects/${encodeURIComponent(projectId)}/merge_requests/${mrIid}`, 'GET');
  }

  async mergeMR(projectId: string | number, mrIid: string | number) {
    return this.api<MergeRequestResponse>(
      `projects/${encodeURIComponent(projectId)}/merge_requests/${mrIid}/merge`,
      'PUT',
    );
  }

  async closeMR(projectId: string | number, mrIid: string | number) {
    return this.api<MergeRequestResponse>(`projects/${encodeURIComponent(projectId)}/merge_requests/${mrIid}`, 'PUT', {
      state_event: 'close',
    });
  }
}
