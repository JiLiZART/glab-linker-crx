import type { MergeRequest } from './types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class GitlabCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly TTL: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    this.TTL = ttl;
  }

  private getKey(projectId: string | number, mrIid?: string | number): string {
    return mrIid ? `${projectId}-${mrIid}` : `${projectId}`;
  }

  get<T>(projectId: string | number, mrIid?: string | number): T | null {
    const key = this.getKey(projectId, mrIid);
    const entry = this.cache.get(key);

    if (!entry) return null;
    if (!this.isValid(entry.timestamp)) return null;

    return entry.data as T;
  }

  set<T>(projectId: string | number, data: T, mrIid?: string | number): void {
    const key = this.getKey(projectId, mrIid);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  updateMR(mr: MergeRequest): void {
    this.set(mr.project_id, mr, mr.iid);
  }

  private isValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.TTL;
  }
}
