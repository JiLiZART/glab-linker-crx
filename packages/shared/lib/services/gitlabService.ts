import { extractMRFromUrl } from 'lib/utils/extract-mr-from-url';
import { GitlabApi } from './gitlabApi';
import type { EnvironmentResponse, MergeRequestResponse } from './types';

type GitlabInstanceConfig = {
  id: string;
  name: string;
  apiUrl: string;
  token: string;
};

export class GitLabService {
  private __api?: GitlabApi;

  public apiUrl: string;
  private __token: string;
  public id: string;
  public name: string;

  constructor(item: GitlabInstanceConfig) {
    this.apiUrl = item.apiUrl;
    this.__token = item.token;
    this.id = item.id;
    this.name = item.name;
  }

  get api() {
    if (!this.__api) {
      this.__api = new GitlabApi(this.__token, this.apiUrl);
    }

    return this.__api;
  }

  apiHostname() {
    return this.api.getApiHostname();
  }

  async projects() {
    return this.api.getProjects();
  }

  async mrEnvironments(projectId: string | number, ref: string) {
    return this.api.getMREnvironments(projectId, ref);
  }

  async mrList(projectId: string | number): Promise<MergeRequestResponse[]> {

    return this.api.getMRList(projectId);
  }

  async mr(url: string) {
    const { projectId, mrIid } = extractMRFromUrl(url, this.apiHostname());

    return this.api.getMRById(projectId, mrIid);
  }

  async commits(projectId: string | number, mrIid: string | number) {
    return await this.api.getMRCommits(projectId, mrIid);
  }

  async pipelines(projectId: string | number, mrIid: string | number) {
    return await this.api.getMRPipelines(projectId, mrIid);
  }

  async diff(projectId: string | number, mrIid: string | number) {
    return await this.api.getMRDiff(projectId, mrIid);
  }

  async reviewApp(projectId: string | number, ref: string): Promise<EnvironmentResponse | undefined> {
    const envs = await this.mrEnvironments(projectId, ref);

    return envs.find((env: { external_url?: string }) => env.external_url);
  }

  async mrMerge(projectId: string | number, mrIid: string | number): Promise<MergeRequestResponse> {
    return this.api.mergeMR(projectId, mrIid);
  }

  async mrClose(projectId: string | number, mrIid: string | number): Promise<MergeRequestResponse> {
    return this.api.closeMR(projectId, mrIid)
  }
}
