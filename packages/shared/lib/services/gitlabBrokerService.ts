import type { GitlabConfigItem } from '@extension/storage';
import { gitlabItemsStorage } from '@extension/storage';
import { GitLabService } from './gitlabService';
import {
  adaptGitlabCommits,
  adaptGitlabDiff,
  adaptGitlabMR,
  adaptGitlabPipelines,
  adaptGitlabReviewApp,
} from './adapter';

function isSelfPage(hostname: string) {
  return globalThis.location.hostname == hostname;
}

async function fetchFullMR(url: string | null) {
  if (!url) {
    return;
  }

  const gitlab = await gitlabBrokerService.getInstanceByUrl(url);

  if (!gitlab) {
    return;
  }

  if (isSelfPage(gitlab.getApiHostname())) {
    return;
  }

  const mrRes = await gitlab.fetchMR(url).catch(err => {
    console.log('gitlab.fetchMR', err);
  });

  if (!mrRes) {
    return;
  }

  const data = adaptGitlabMR(mrRes);

  console.log('mr', data);

  return {
    data: data,
    get reivewApp() {
      return gitlab.fetchReviewApp(mrRes?.pipeline?.project_id, mrRes?.pipeline?.ref).then(envRes => {
        return envRes ? adaptGitlabReviewApp(envRes) : undefined;
      });
    },
    get commits() {
      return gitlab.fetchCommits(mrRes?.project_id, mrRes?.iid).then(commitsRes => {
        return commitsRes ? adaptGitlabCommits(commitsRes) : undefined;
      });
    },
    get pipelines() {
      return gitlab.fetchPipelines(mrRes?.project_id, mrRes?.iid).then(pipelinesRes => {
        return pipelinesRes ? adaptGitlabPipelines(pipelinesRes) : undefined;
      });
    },
    get diff() {
      return gitlab.fetchDiff(mrRes?.project_id, mrRes?.iid).then(diffRes => {
        return diffRes ? adaptGitlabDiff(diffRes) : undefined;
      });
    },
  };
}

type MRPRomise = ReturnType<typeof fetchFullMR>;
export type FullMergeRequest = Awaited<MRPRomise>;

const mrPromiseCache = new Map<string, MRPRomise>();

function getCachedFullMR(url: string, forceRefresh?: boolean) {
  if (forceRefresh || !mrPromiseCache.has(url)) {
    mrPromiseCache.set(url, fetchFullMR(url));
  }

  return mrPromiseCache.get(url);
}

function extractHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.split('/')[0];
  }
}

class GitlabBrokerService {
  private instanceCache: Map<string, GitLabService> = new Map();

  async getConfig(url: string): Promise<GitlabConfigItem | null> {
    const host = extractHostname(url);

    const items = await gitlabItemsStorage.get();
    const config = items.find((item: GitlabConfigItem) => item.form?.hostname?.includes(host));

    return config ?? null;
  }

  async getConfigById(id: string): Promise<GitlabConfigItem | null> {
    const items = await gitlabItemsStorage.get();
    const config = items.find((item: GitlabConfigItem) => item.id === id);

    return config ?? null;
  }

  // Get instance by host url
  async getInstanceByUrl(url: string): Promise<GitLabService | null> {
    const host = extractHostname(url);

    // Check cache first
    const cachedInstance = this.findInCache(host);
    if (cachedInstance) {
      return cachedInstance;
    }

    // Try to find in storage
    const config = await this.getConfig(url);
    if (!config?.form?.token) {
      return null;
    }

    return this.createInstance(config);
  }

  // Get instance by id
  async getInstance(id: string): Promise<GitLabService | null> {
    // Check cache first
    const cachedInstance = this.instanceCache.get(id);
    if (cachedInstance) {
      return cachedInstance;
    }

    const config = await this.getConfigById(id);
    if (!config?.form?.token) {
      return null;
    }

    return this.createInstance(config);
  }

  createInstance(config: GitlabConfigItem) {
    const instance = new GitLabService({
      id: config.id,
      name: config.name,
      apiUrl: config?.form?.hostname || '',
      token: config?.form?.token || '',
      config: config?.form,
    });

    this.cacheInstance(instance);

    return instance;
  }

  private cacheInstance(instance: GitLabService): void {
    this.instanceCache.set(instance.id, instance);
  }

  private findInCache(host: string): GitLabService | null {
    for (const instance of this.instanceCache.values()) {
      if (instance.apiUrl.includes(host)) {
        return instance;
      }
    }
    return null;
  }

  public async getFullMR(url: string, forceRefresh?: boolean) {
    return getCachedFullMR(url, forceRefresh);
  }

  public async mergeMR(url: string) {
    const instance = await this.getInstanceByUrl(url);

    if (!instance) {
      return;
    }

    const mr = await getCachedFullMR(url);

    if (!mr) {
      return;
    }

    await instance.mergeMR(mr.data.projectId, mr.data.iid);

    return await getCachedFullMR(url, true);
  }

  public async closeMR(url: string) {
    const instance = await this.getInstanceByUrl(url);

    if (!instance) {
      return;
    }

    const mr = await getCachedFullMR(url);

    if (!mr) {
      return;
    }

    await instance.closeMR(mr.data.projectId, mr.data.iid);

    return await getCachedFullMR(url, true);
  }
}

// Export singleton instance
export const gitlabBrokerService = new GitlabBrokerService();
