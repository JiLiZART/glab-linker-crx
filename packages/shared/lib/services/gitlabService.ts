import { GitlabApi } from './gitlabApi';
import { GitlabCache } from './gitlabCache';
import type { Environment, MergeRequest } from './types';

function extractMRFromUrl(mrUrl: string, hostname: string) {
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

type GitlabInstanceConfig = {
  id: string;
  name: string;
  apiUrl: string;
  token: string;
};

export class GitLabService {
  private __api?: GitlabApi;
  private __cache?: GitlabCache;

  public apiUrl: string;
  private __token: string;
  public id: string;
  public name: string;

  constructor(config: GitlabInstanceConfig) {
    this.apiUrl = config.apiUrl;
    this.__token = config.token;
    this.id = config.id;
    this.name = config.name;
  }

  get api() {
    if (!this.__api) {
      this.__api = new GitlabApi(this.__token, this.apiUrl);
    }

    return this.__api;
  }

  get cache() {
    if (!this.__cache) {
      this.__cache = new GitlabCache();
    }

    return this.__cache;
  }

  getApiHostname() {
    return this.api.getApiHostname();
  }

  async getProjects() {
    return this.api.getProjects();
  }

  async getMREnvironments(projectId: string | number, ref: string) {
    return this.api.getMREnvironments(projectId, ref);
  }

  async getMRList(projectId: string | number): Promise<MergeRequest[]> {
    const cached = this.cache.get<MergeRequest[]>(projectId);
    if (cached) return cached;

    const data = await this.api.getMRList(projectId);
    this.cache.set(projectId, data);

    return data;
  }

  async getMRByUrl(url: string): Promise<MergeRequest> {
    const { projectId, mrIid } = extractMRFromUrl(url, this.getApiHostname());

    const cached = this.cache.get<MergeRequest>(projectId, mrIid);
    if (cached) return cached;

    const data = await this.api.getMRById(projectId, mrIid);
    this.cache.updateMR(data);

    return data;
  }

  async getMRReviewApp(projectId: string | number, ref: string): Promise<Environment | undefined> {
    const envs = await this.getMREnvironments(projectId, ref);

    return envs.find((env: { external_url?: string }) => env.external_url);
  }

  async mergeMR(projectId: string | number, mrIid: string | number): Promise<MergeRequest> {
    const data = await this.api.mergeMR(projectId, mrIid);
    this.cache.updateMR(data);

    return data;
  }

  async closeMR(projectId: string | number, mrIid: string | number): Promise<MergeRequest> {
    const data = await this.api.closeMR(projectId, mrIid);
    this.cache.updateMR(data);

    return data;
  }
}
