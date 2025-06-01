export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

export type MergeRequestStatusType = 'can_merge' | 'cannot_merge' | 'conflicts' | 'draft';
export type PipelineStatusType = 'success' | 'failed' | 'running' | 'pending' | 'canceled';

export interface Commit {
  id: string;
  sha: string;
  message: string;
  author: User;
  date: string;
}

export interface PipelineStage {
  name: string;
  status: PipelineStatusType;
}

export interface Pipeline {
  id: string;
  status: PipelineStatusType;
  url: string;
  triggeredBy: User;
  startedAt: string;
  duration: string;
  stages: PipelineStage[];
}

export interface FileChange {
  path: string;
  status: 'added' | 'modified' | 'deleted' | string;
  additions: number;
  deletions: number;
}

export interface Change {
  totalFiles: number;
  additions: number;
  deletions: number;
  added: number;
  removed: number;
  modified: number;
  files: FileChange[];
}

export interface MergeRequest {
  id: string;
  iid: string;
  projectId: string;
  title: string;
  description: string;
  status: MergeRequestStatusType;
  canMerge: boolean;
  mergeBlockers?: string[];
  pipelineStatus: PipelineStatusType;
  author: User;
  reviewers: User[];
  approvers: User[];
  requiredApprovals: number;
  createdAt: string;
  updatedAt: string;
  sourceBranch: string;
  targetBranch: string;
  reviewAppUrl: string;
  web_url?: string;
  // commits: Commit[]
  // pipelines: Pipeline[]
  // changes: Change
}
