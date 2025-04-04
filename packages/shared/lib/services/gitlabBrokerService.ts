import type { GitlabConfigItem } from '@extension/storage';
import { gitlabItemsStorage } from '@extension/storage';
import { GitLabService } from './gitlabService';

class GitlabBrokerService {
  private instanceCache: Map<string, GitLabService> = new Map();

  // Get instance by host url
  async getInstanceByUrl(url: string): Promise<GitLabService | null> {
    const host = this.extractHostname(url);

    // Check cache first
    const cachedInstance = this.findInCache(host);
    if (cachedInstance) {
      return cachedInstance;
    }

    // Try to find in storage
    const items = await gitlabItemsStorage.get();
    const config = items.find((item: GitlabConfigItem) => item.apiUrl?.includes(host));

    if (!config?.apiUrl || !config.token) {
      return null;
    }

    const instance = this.createInstance(config);
    this.cacheInstance(instance);

    return instance;
  }

  // Get instance by id
  async getInstance(id: string): Promise<GitLabService | null> {
    // Check cache first
    const cachedInstance = this.instanceCache.get(id);
    if (cachedInstance) {
      return cachedInstance;
    }

    const config = await gitlabItemsStorage.findById(id);
    if (!config?.apiUrl || !config.token) {
      return null;
    }

    const instance = this.createInstance(config);
    this.cacheInstance(instance);

    return instance;
  }

  private createInstance(config: GitlabConfigItem) {
    return new GitLabService({
      id: config.id,
      name: config.name,
      apiUrl: config.apiUrl!,
      token: config.token!,
    });
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

  private extractHostname(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return url.split('/')[0];
    }
  }
}

// Export singleton instance
export const gitlabBrokerService = new GitlabBrokerService();
