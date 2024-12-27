export interface MergeRequestInfo {
  title: string;
  pipelineStatus: 'success' | 'failed' | 'running' | 'pending' | 'canceled' | null;
  author: string;
  updatedAt: string;
}
