import { Card, Checkbox } from '@extension/ui';
import { MergeRequestCard } from '@extension/shared';
import { useFormValues } from '@src/form';
import type { OptionsFormControl } from '@src/types';
import { Controller } from 'react-hook-form';

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

function MergeRequestPreview() {
  const values = useFormValues();

  return (
    <div>
      <h3 className="mb-3 text-sm font-medium">Preview</h3>
      <div className="bg-gray-50 p-4">
        <MergeRequestCard
          {...mergePreviewData}
          showAvatar={values.showAvatar}
          showMerge={values.showMerge}
          showDescription={values.showDescription}
        />
      </div>
    </div>
  );
}

export const DisplaySettings = ({ control }: { control: OptionsFormControl }) => {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Display Settings</h2>
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-4">
          <Controller
            name="showDescription"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-description"
                  ref={field.ref}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  checked={field.value}
                  defaultChecked={true}
                />
                <label htmlFor="show-description" className="text-sm font-medium">
                  Show description
                </label>
              </div>
            )}
          />

          <Controller
            name="showAvatar"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-avatar"
                  ref={field.ref}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  checked={field.value}
                  defaultChecked={true}
                />
                <label htmlFor="show-avatar" className="text-sm font-medium">
                  Show avatar
                </label>
              </div>
            )}
          />

          <Controller
            name="showMerge"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-merge"
                  ref={field.ref}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  checked={field.value}
                  defaultChecked={true}
                />
                <label htmlFor="show-merge" className="text-sm font-medium">
                  Show merge buttons
                </label>
              </div>
            )}
          />
        </div>
        <MergeRequestPreview />
      </div>
    </Card>
  );
};
