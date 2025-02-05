import { Card, Checkbox, MergeRequestCard } from '@extension/ui';

const mergePreviewData = {
  title: 'MR title',
  description: 'MR Description',
  author: {
    name: 'John Doe',
    avatar: 'Avatar url',
  },
  sourceBranch: 'foo-long-branch-name',
  targetBranch: 'releases/main',
  updatedAt: new Date().toISOString(),
  changesCount: 9999,
  hasConflicts: true,
  status: 'opened', // 'opened' | 'merged' | 'closed' | string;
  isDraft: true,
  isInProgress: true,
  pipeline: {
    status: 'running', // 'running' | 'success' | 'failed' | 'pending' | string;
  },
  approvals: {
    approvers: [{ name: 'Foo Bar', avatar: '#' }],
    required: 2,
  },
  reviewers: [
    { name: 'Reviewer 1', avatar: '#' },
    { name: 'Reviewer 2', avatar: '#' },
  ],
  canMerge: true,
  youCanMerge: true,
  mergeBlockers: ['Merge Blocker 1', 'Merge Blocker 2'],
  reviewApp: {
    url: '#',
    slug: 'review-app-slug-XXX-999-111',
    state: 'available',
  },
  onMerge: () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(undefined);
        alert('Merged');
      }, 3000);
    }),
  onClose: () =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(undefined);
        alert('Closed!');
      }, 3000);
    }),
};

export const DisplaySettings = () => {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Display Settings</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="show-description" />
            <label htmlFor="show-description" className="text-sm font-medium">
              Show description
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-avatar" />
            <label htmlFor="show-avatar" className="text-sm font-medium">
              Show avatar
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="show-merge" />
            <label htmlFor="show-merge" className="text-sm font-medium">
              Show merge buttons
            </label>
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-medium">Preview</h3>

          <div className="bg-gray-50 p-4">
            <MergeRequestCard {...mergePreviewData} />
          </div>
        </div>
      </div>
    </Card>
  );
};
