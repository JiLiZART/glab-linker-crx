import type { InstanceConfig } from '@extension/storage';
import { instancesStorage } from '@extension/storage';
import { GitLabService } from './gitlabService';
import {
  adaptGitlabCommits,
  adaptGitlabDiff,
  adaptGitlabMR,
  adaptGitlabPipelines,
  adaptGitlabReviewApp,
} from './adapter';
import { extractHostname } from '../utils/extract-hostname';
import { isSelfPage } from '../utils/is-self-page';
import { asCached } from '../utils/promise-cache';

async function fetchFullMR(url: string | null) {
  if (!url) {
    return;
  }

  const gitlab = await glabBroker.byUrl(url);

  if (!gitlab) {
    return;
  }

  if (isSelfPage(gitlab.apiHostname())) {
    return;
  }

  const mrRes = await gitlab.mr(url).catch(err => {
    console.log('gitlab.fetchMR', err);
    debugger;
    return null;
  });

  if (!mrRes) {
    return;
  }

  const data = adaptGitlabMR(mrRes);

  console.log('mr', data);

  return {
    data: data,
    reivewApp() {
      return gitlab
        .reviewApp(mrRes?.pipeline?.project_id, mrRes?.pipeline?.ref)
        .then(envRes => {
          return envRes ? adaptGitlabReviewApp(envRes) : undefined;
        })
        .catch(err => {
          console.log('gitlab.fetchReviewApp', err);
          debugger;
          return undefined;
        });
    },
    commits() {
      return gitlab
        .commits(mrRes?.project_id, mrRes?.iid)
        .then(commitsRes => {
          return commitsRes ? adaptGitlabCommits(commitsRes) : undefined;
        })
        .catch(err => {
          console.log('gitlab.fetchCommits', err);
          debugger;
          return undefined;
        });
    },
    pipelines() {
      return gitlab
        .pipelines(mrRes?.project_id, mrRes?.iid)
        .then(pipelinesRes => {
          return pipelinesRes ? adaptGitlabPipelines(pipelinesRes) : undefined;
        })
        .catch(err => {
          console.log('gitlab.fetchPipelines', err);
          debugger;
          return undefined;
        });
    },
    diff() {
      return gitlab
        .diff(mrRes?.project_id, mrRes?.iid)
        .then(diffRes => {
          return diffRes ? adaptGitlabDiff(diffRes) : undefined;
        })
        .catch(err => {
          console.log('gitlab.fetchDiff', err);
          debugger;
          return undefined;
        });
    },
  };
}

type MRPRomise = ReturnType<typeof fetchFullMR>;
export type FullMergeRequest = Awaited<MRPRomise>;

class GitlabBrokerService {
  private pool: Map<string, GitLabService> = new Map();

  async config(url: string): Promise<InstanceConfig | null> {
    const host = extractHostname(url);

    const items = await instancesStorage.items();
    const config = items.find((item: InstanceConfig) => item?.hostname?.includes(host));

    return config ?? null;
  }

  async configById(id: string): Promise<InstanceConfig | null> {
    const items = await instancesStorage.items();
    const config = items.find((item: InstanceConfig) => item.id === id);

    return config ?? null;
  }

  // Get instance by host url
  async byUrl(url: string): Promise<GitLabService | null> {
    // Check cache first
    const instance = this.poolByHost(extractHostname(url));

    if (instance) {
      return instance;
    }

    // Try to find in storage
    const config = await this.config(url);

    if (!config?.token) {
      return null;
    }

    return this.create(config);
  }

  // Get instance by id
  async instance(id: string): Promise<GitLabService | null> {
    // Check cache first
    const instance = this.pool.get(id);

    if (instance) {
      return instance;
    }

    const config = await this.configById(id);

    if (!config?.token) {
      return null;
    }

    return this.create(config);
  }

  create(config: InstanceConfig) {
    const instance = new GitLabService({
      id: config.id,
      name: config.name,
      apiUrl: config?.hostname || '',
      token: config?.token || '',
    });

    this.pool.set(instance.id, instance);

    return instance;
  }

  private poolByHost(host: string): GitLabService | null {
    for (const instance of this.pool.values()) {
      if (instance.apiUrl.includes(host)) {
        return instance;
      }
    }
    return null;
  }

  public async mr(url: string, forceRefresh?: boolean) {
    return asCached(url, () => fetchFullMR(url), forceRefresh);
  }

  public async mrMerge(url: string) {
    const instance = await this.byUrl(url);

    if (!instance) {
      return;
    }

    const mr = await this.mr(url);

    if (!mr) {
      return;
    }

    await instance.mrMerge(mr.data.projectId, mr.data.iid);

    return await asCached(url, () => fetchFullMR(url), true);
  }

  public async mrClose(url: string) {
    const instance = await this.byUrl(url);

    if (!instance) {
      return;
    }

    const mr = await this.mr(url);

    if (!mr) {
      return;
    }

    await instance.mrClose(mr.data.projectId, mr.data.iid);

    return await asCached(url, () => fetchFullMR(url), true);

  }
}

// Export singleton instance
export const glabBroker = new GitlabBrokerService();
