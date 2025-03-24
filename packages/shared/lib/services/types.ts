export interface MergeRequest {
  id: number;
  iid: number;
  project_id: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  updated_at: string;
  merged_by: string;
  merge_user: string;
  merged_at: string;
  closed_by: string;
  closed_at: string;
  target_branch: string;
  source_branch: string;
  user_notes_count: number;
  upvotes: number;
  downvotes: number;
  author: Author;
  assignees: string[];
  assignee: string;
  reviewers: string[];
  source_project_id: number;
  target_project_id: number;
  labels: string[];
  draft: boolean;
  imported: boolean;
  imported_from: string;
  work_in_progress: boolean;
  milestone: string;
  merge_when_pipeline_succeeds: boolean;
  merge_status: string;
  detailed_merge_status: string;
  merge_after: string;
  sha: string;
  merge_commit_sha: string;
  squash_commit_sha: string;
  discussion_locked: string;
  should_remove_source_branch: string;
  force_remove_source_branch: boolean;
  prepared_at: string;
  reference: string;
  references: References;
  web_url: string;
  time_stats: TimeStats;
  squash: boolean;
  squash_on_merge: boolean;
  task_completion_status: TaskCompletionStatus;
  has_conflicts: boolean;
  blocking_discussions_resolved: boolean;
  approvals_before_merge: string;
  subscribed: boolean;
  changes_count: number;
  latest_build_started_at: string;
  latest_build_finished_at: string;
  first_deployed_to_production_at: string;
  pipeline: Pipeline;
  head_pipeline: HeadPipeline;
  diff_refs: DiffRefs;
  merge_error: string;
  first_contribution: boolean;
  user: User2;
}

export interface Author {
  id: number;
  username: string;
  name: string;
  state: string;
  locked: boolean;
  avatar_url: string;
  web_url: string;
}

export interface References {
  short: string;
  relative: string;
  full: string;
}

export interface TimeStats {
  time_estimate: number;
  total_time_spent: number;
  human_time_estimate: string;
  human_total_time_spent: string;
}

export interface TaskCompletionStatus {
  count: number;
  completed_count: number;
}

export interface Pipeline {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
}

export interface HeadPipeline {
  id: number;
  iid: number;
  project_id: number;
  sha: string;
  ref: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  web_url: string;
  before_sha: string;
  tag: boolean;
  yaml_errors: string;
  user: User;
  started_at: string;
  finished_at: string;
  committed_at: string;
  duration: number;
  queued_duration: number;
  coverage: string;
  detailed_status: DetailedStatus;
}

export interface User {
  id: number;
  username: string;
  name: string;
  state: string;
  locked: boolean;
  avatar_url: string;
  web_url: string;
}

export interface DetailedStatus {
  icon: string;
  text: string;
  label: string;
  group: string;
  tooltip: string;
  has_details: boolean;
  details_path: string;
  illustration: string;
  favicon: string;
}

export interface DiffRefs {
  base_sha: string;
  head_sha: string;
  start_sha: string;
}

export interface User2 {
  can_merge: boolean;
}

export interface Environment {
  id: number;
  name: string;
  slug: string;
  external_url: string;
  created_at: string;
  updated_at: string;
  tier: string;
  state: string | 'stopped';
  auto_stop_at: string | null;
  description: string | null;
}
