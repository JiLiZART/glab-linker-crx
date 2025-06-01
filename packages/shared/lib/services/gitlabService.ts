import { GitlabApi } from './gitlabApi';
import { GitlabCache } from './gitlabCache';
import type { EnvironmentResponse, MergeRequestResponse } from './types';
import type { GitlabConfigItem } from '@extension/storage';

export function getMRUrl(url?: string) {
  if (!url) {
    return null;
  }

  if (!url.includes('/merge_requests/')) {
    return null;
  }

  return url;
}

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

type GitlabInstanceConfig = {
  id: string;
  name: string;
  apiUrl: string;
  token: string;
  config: GitlabConfigItem['form'];
};

export class GitLabService {
  private __api?: GitlabApi;
  private __cache?: GitlabCache;
  private __config?: GitlabConfigItem['form'];

  public apiUrl: string;
  private __token: string;
  public id: string;
  public name: string;

  constructor(item: GitlabInstanceConfig) {
    this.apiUrl = item.apiUrl;
    this.__token = item.token;
    this.id = item.id;
    this.name = item.name;
    this.__config = item.config;
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

  get config() {
    return this.__config;
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

  async getMRList(projectId: string | number): Promise<MergeRequestResponse[]> {
    const cached = this.cache.get<MergeRequestResponse[]>(projectId);
    if (cached) return cached;

    const data = await this.api.getMRList(projectId);
    this.cache.set(projectId, data);

    return data;
  }

  async fetchMR(url: string) {
    const { projectId, mrIid } = extractMRFromUrl(url, this.getApiHostname());

    const cached = this.cache.get<MergeRequestResponse>(projectId, mrIid);
    if (cached) return cached;

    const data = await this.api.getMRById(projectId, mrIid);
    this.cache.updateMR(data);

    return data;
  }

  async fetchCommits(projectId: string | number, mrIid: string | number) {
    return await this.api.getMRCommits(projectId, mrIid);
  }

  async fetchPipelines(projectId: string | number, mrIid: string | number) {
    return await this.api.getMRPipelines(projectId, mrIid);
  }

  async fetchDiff(projectId: string | number, mrIid: string | number) {
    return await this.api.getMRDiff(projectId, mrIid);
  }

  async fetchReviewApp(projectId: string | number, ref: string): Promise<EnvironmentResponse | undefined> {
    const envs = await this.getMREnvironments(projectId, ref);

    return envs.find((env: { external_url?: string }) => env.external_url);
  }

  async mergeMR(projectId: string | number, mrIid: string | number): Promise<MergeRequestResponse> {
    const data = await this.api.mergeMR(projectId, mrIid);
    this.cache.updateMR(data);

    return data;
  }

  async closeMR(projectId: string | number, mrIid: string | number): Promise<MergeRequestResponse> {
    const data = await this.api.closeMR(projectId, mrIid);
    this.cache.updateMR(data);

    return data;
  }
}
