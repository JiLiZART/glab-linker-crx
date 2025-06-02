import type {
  CommitResponse,
  DiffResponse,
  EnvironmentResponse,
  MergeRequestResponse,
  PipelineResponse,
} from './types';

export function adaptGitlabReviewApp(res?: EnvironmentResponse) {
  return {
    url: res?.external_url,
    slug: res?.slug,
    state: res?.state,
  };
}

export type ReviewAppModel = ReturnType<typeof adaptGitlabReviewApp>;

export function adaptGitlabCommits(gitlabCommits: CommitResponse[]) {
  return gitlabCommits.map(commit => ({
    id: commit.id,
    sha: commit.id,
    message: commit.title || commit.message,
    description: commit.message,
    author: {
      id: commit.author_name,
      name: commit.author_name,
      avatarUrl: undefined, // GitLab API doesn't provide avatar in commit data
    },
    date: commit.created_at,
    url: commit.web_url,
  }));
}

export type CommitModel = ReturnType<typeof adaptGitlabCommits>;

export function adaptGitlabPipelines(gitlabPipelines: PipelineResponse[]) {
  return gitlabPipelines.map(pipeline => {
    // Calculate duration in seconds
    const startDate = new Date(pipeline.created_at);
    const endDate = new Date(pipeline.updated_at);
    const durationInSeconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    const durationString = `${minutes}m ${seconds}s`;

    // Map status
    let status: 'success' | 'failed' | 'running' | 'pending' | 'canceled' = 'pending';
    switch (pipeline.status) {
      case 'success':
        status = 'success';
        break;
      case 'failed':
        status = 'failed';
        break;
      case 'running':
        status = 'running';
        break;
      case 'canceled':
        status = 'canceled';
        break;
      default:
        status = 'pending';
    }

    return {
      id: pipeline.id.toString(),
      status,
      url: pipeline.web_url,
      triggeredBy: {
        id: 'user-1', // Not provided in this API response
        name: 'Pipeline Trigger', // Not provided in this API response
        avatarUrl: `/placeholder.svg?height=40&width=40`,
      },
      startedAt: pipeline.created_at,
      duration: durationString,
      stages: [
        { name: 'build', status },
        { name: 'test', status },
        { name: 'lint', status },
        { name: 'deploy', status },
      ],
    };
  });
}

export type PipelineModel = ReturnType<typeof adaptGitlabPipelines>;

export function adaptGitlabDiff(gitlabDiff: DiffResponse[]) {
  // Count statistics
  let added = 0;
  let removed = 0;
  let modified = 0;
  let totalAdditions = 0;
  let totalDeletions = 0;

  const files = gitlabDiff.map(diff => {
    // Parse the diff to count additions and deletions
    const diffLines = diff.diff.split('\n');
    let additions = 0;
    let deletions = 0;

    diffLines.forEach((line: string) => {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        additions++;
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        deletions++;
      }
    });

    totalAdditions += additions;
    totalDeletions += deletions;

    // Determine file status
    let status: 'added' | 'modified' | 'deleted' = 'modified';
    if (diff.new_file) {
      status = 'added';
      added++;
    } else if (diff.deleted_file) {
      status = 'deleted';
      removed++;
    } else {
      modified++;
    }

    return {
      path: diff.new_path,
      diff: diff.diff,
      status,
      additions,
      deletions,
    };
  });

  return {
    totalFiles: files.length,
    additions: totalAdditions,
    deletions: totalDeletions,
    added,
    removed,
    modified,
    files,
  };
}

export type ChangeModel = ReturnType<typeof adaptGitlabDiff>;

export function adaptGitlabMR(gitlabMR: MergeRequestResponse) {
  // Determine merge status
  let status: 'can_merge' | 'cannot_merge' | 'conflicts' | 'draft' = 'cannot_merge';
  const mergeBlockers: string[] = [];

  if (gitlabMR.has_conflicts) {
    status = 'conflicts';
    mergeBlockers.push('Merge conflicts must be resolved');
  } else if (gitlabMR.merge_status === 'can_be_merged') {
    if (gitlabMR.detailed_merge_status === 'not_approved') {
      status = 'cannot_merge';
      mergeBlockers.push('Requires approval before merging');
    } else {
      status = 'can_merge';
    }
  } else if (gitlabMR.draft || gitlabMR.work_in_progress) {
    status = 'draft';
    mergeBlockers.push('Draft merge request cannot be merged');
  }

  // Check task completion
  if (
    gitlabMR.task_completion_status &&
    gitlabMR.task_completion_status.count > 0 &&
    gitlabMR.task_completion_status.completed_count < gitlabMR.task_completion_status.count
  ) {
    mergeBlockers.push(
      `${gitlabMR.task_completion_status.completed_count}/${gitlabMR.task_completion_status.count} tasks completed`,
    );
  }

  // Map pipeline status
  let pipelineStatus: 'success' | 'failed' | 'running' | 'pending' | 'canceled' = 'pending';
  if (gitlabMR.head_pipeline) {
    switch (gitlabMR.head_pipeline.status) {
      case 'success':
        pipelineStatus = 'success';
        break;
      case 'failed':
        pipelineStatus = 'failed';
        mergeBlockers.push('Pipeline must succeed before merging');
        break;
      case 'running':
        pipelineStatus = 'running';
        mergeBlockers.push('Pipeline is still running');
        break;
      case 'canceled':
        pipelineStatus = 'canceled';
        mergeBlockers.push('Pipeline was canceled');
        break;
      default:
        pipelineStatus = 'pending';
        mergeBlockers.push('Pipeline is pending');
    }
  }

  // Create mock reviewers based on labels
  const mockReviewers = gitlabMR.labels.map((label: string, index: number) => ({
    id: `reviewer-${index}`,
    name: `${label} Reviewer`,
    avatarUrl: '/placeholder.svg?height=40&width=40',
  }));

  // Create mock approvers (empty in this case since it's not approved)
  // const mockApprovers = []

  // Create mock pipelines based on the MR
  // const pipelines = []
  //
  // if (gitlabMR.head_pipeline) {
  //   pipelines.push({
  //     id: gitlabMR.head_pipeline.id.toString(),
  //     status: pipelineStatus,
  //     url: gitlabMR.head_pipeline.web_url,
  //     triggeredBy: {
  //       id: gitlabMR.author.id.toString(),
  //       name: gitlabMR.author.name,
  //       avatarUrl: gitlabMR.author.avatar_url,
  //     },
  //     startedAt: gitlabMR.head_pipeline.started_at,
  //     duration: `${gitlabMR.head_pipeline.duration}s`,
  //     stages: [
  //       { name: "build", status: pipelineStatus },
  //       { name: "test", status: pipelineStatus },
  //       { name: "lint", status: pipelineStatus },
  //       { name: "deploy", status: pipelineStatus },
  //     ],
  //   })
  // }

  // Create mock changes based on the MR
  // const changesCount = Number.parseInt(String(gitlabMR.changes_count)) || 0
  // const mockChanges = {
  //   totalFiles: changesCount,
  //   additions: changesCount * 20, // Estimate
  //   deletions: changesCount * 5, // Estimate
  //   added: Math.floor(changesCount * 0.6), // Estimate
  //   removed: Math.floor(changesCount * 0.1), // Estimate
  //   modified: Math.floor(changesCount * 0.3), // Estimate
  //   files: [
  //     {
  //       path: "src/es/components/AliasRegion.cpp",
  //       status: "modified",
  //       additions: 45,
  //       deletions: 15,
  //     },
  //     {
  //       path: "src/es/components/AliasRegion.h",
  //       status: "modified",
  //       additions: 10,
  //       deletions: 5,
  //     },
  //     {
  //       path: "src/es/components/RegionOptimizer.cpp",
  //       status: "added",
  //       additions: 120,
  //       deletions: 0,
  //     },
  //     {
  //       path: "src/es/components/RegionOptimizer.h",
  //       status: "added",
  //       additions: 50,
  //       deletions: 0,
  //     },
  //     {
  //       path: "test/es/components/AliasRegionTest.cpp",
  //       status: "modified",
  //       additions: 35,
  //       deletions: 10,
  //     },
  //     {
  //       path: "test/es/components/RegionOptimizerTest.cpp",
  //       status: "added",
  //       additions: 80,
  //       deletions: 0,
  //     },
  //     {
  //       path: "docs/components/alias-region.md",
  //       status: "modified",
  //       additions: 25,
  //       deletions: 5,
  //     },
  //   ],
  // }

  // Create the adapted MR object
  return {
    id: gitlabMR.iid.toString(),
    iid: gitlabMR.iid.toString(),
    projectId: gitlabMR.project_id.toString(),
    title: gitlabMR.title,
    description: gitlabMR.description,
    status,
    canMerge: status === 'can_merge',
    mergeBlockers,
    pipelineStatus,
    author: {
      id: gitlabMR.author.id.toString(),
      name: gitlabMR.author.name,
      avatarUrl: gitlabMR.author.avatar_url,
    },
    reviewers: [],
    approvers: [],
    // reviewers: mockReviewers,
    // approvers: mockApprovers,
    requiredApprovals: 1,
    createdAt: gitlabMR.created_at,
    updatedAt: gitlabMR.updated_at,
    sourceBranch: gitlabMR.source_branch,
    targetBranch: gitlabMR.target_branch,
    url: gitlabMR.web_url,
  };
}

export type MergeRequestModel = ReturnType<typeof adaptGitlabMR>;
