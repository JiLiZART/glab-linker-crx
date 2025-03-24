import type { MergeRequestData, Environment } from './types';
import { formatRelative } from 'date-fns';

export function transformMR(data: MergeRequestData, envData?: Environment) {
  if (!data) {
    console.log('transformMRData', data);
    return null;
  }

  const reviewApp = {
    url: envData?.external_url,
    slug: envData?.slug,
    state: envData?.state,
  };

  const mergeBlockers = [];

  if (data?.merge_error) {
    mergeBlockers.push(data.merge_error);
  }

  return {
    projectId: data.project_id,
    iid: data.iid,
    title: data.title || '',
    description: data.description,
    author: {
      name: data.author.name,
      avatar: data.author.avatar_url,
    },
    pipeline: data.pipeline
      ? {
          status: data.pipeline.status,
        }
      : undefined,
    status: data.state,
    sourceBranch: data.source_branch,
    targetBranch: data.target_branch,
    updatedAt: formatRelative(data.updated_at, new Date()),
    changesCount: data.changes_count,
    isDraft: data.draft,
    isInProgress: data.work_in_progress,
    hasConflicts: data.has_conflicts,
    canMerge: data.merge_status === 'can_be_merged',
    youCanMerge: data.user.can_merge,
    reviewApp: envData ? reviewApp : undefined,
    // approvals: {
    //   approvers: [
    //     {
    //       name: 'John Doe',
    //       avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    //     },
    //     {
    //       name: 'Alice Smith',
    //       avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    //     },
    //   ],
    //   required: 2,
    // },

    mergeBlockers,
    // mergeBlockers: ['Pipeline is still running', 'Requires 2 approvals (1 more needed)', 'Branch is out of date'],
  };
}

export type TransformedMR = ReturnType<typeof transformMR>;
