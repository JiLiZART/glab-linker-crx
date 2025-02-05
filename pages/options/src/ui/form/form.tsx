import React, { useState } from 'react';
import { Plus, ExternalLink } from 'lucide-react';
import { Card, Button, Input, Checkbox, MergeRequestCard } from '@extension/ui';
import { useForm, FormProvider } from 'react-hook-form';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';

export type OptionsFormValues = {
  apiUrl: string;
  gitlabToken: string;
};

export const OptionsForm = () => {
  const gitlabToken = useStorage(gitlabTokenStorage);
  const apiUrl = useStorage(gitlabApiUrlStorage);
  const methods = useForm<OptionsFormValues>({
    defaultValues: {
      apiUrl,
      gitlabToken,
    },
  });

  const [saved, setSaved] = useState(false);

  const onSubmit = async (data: OptionsFormValues) => {
    const { apiUrl, gitlabToken } = data;

    await gitlabTokenStorage.setToken(gitlabToken);
    await gitlabApiUrlStorage.setUrl(apiUrl);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const requiredScopes = ['api', 'read_repository', 'write_repository', 'read_api'];

  const mrOptions = {
    title: 'MR title',
    description: 'MR description',
    author: {
      name: 'mr author',
      avatar: 'https://gravatar.com/avatar/36d803afe961f510eec02619de496271?s=400&d=robohash&r=x',
    },
    sourceBranch: 'feature/XXX-123123-new-thing',
    targetBranch: 'development',
    updatedAt: new Date().toISOString(),
    changesCount: 999,
    hasConflicts: true,
    status: 'merged',
    isDraft: true,
    isInProgress: true,
    pipeline: {
      status: 'running',
    },

    canMerge: true,
    youCanMerge: false,
    mergeBlockers: ['merge blocker 1', 'merge blocker 2'],
    reviewApp: {
      url: 'https://google.com',
      slug: 'google',
      state: 'available',
    },
    onMerge: async () => {},
    onClose: async () => {},
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">GitLab Instance Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Hostname</label>
              <Input placeholder="e.g. gitlab.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Access Token</label>
              <Input type="password" placeholder="Your GitLab access token" />
              <div className="mt-2 text-sm text-gray-600">
                <a
                  href="https://gitlab.com/-/profile/personal_access_tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  Create access token
                  <ExternalLink className="ml-1 size-3" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Required API Scopes:</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
                {requiredScopes.map(scope => (
                  <li key={scope}>{scope}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Display Settings</h2>
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

          <MergeRequestCard {...mrOptions} />
        </Card>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button type="submit">Save Settings</Button>
            {saved && <span className="text-sm font-medium text-green-600">Success saved!</span>}
          </div>

          <Button variant="destructive">Remove Instance</Button>
        </div>
      </form>
    </FormProvider>
  );
};
