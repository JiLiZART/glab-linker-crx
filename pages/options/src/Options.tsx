import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Input, RadioGroup, RadioGroupItem, Textarea, Card, Checkbox, MergeRequestCard } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';
import { Plus, ExternalLink, User, MessageSquare, Settings, Server } from 'lucide-react';

import { ApiUrlInput } from './ui/ApiUrlInput';
import { ApiTokenInput } from './ui/ApiTokenInput';
import '@src/Options.css';
// import { OptionsForm, OptionsFormValues } from './ui/form/form';

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

const Options = () => {
  const requiredScopes = ['api', 'read_repository', 'write_repository', 'read_api'];
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl gap-6">
        <div className="min-h-screen w-64 shrink-0 border-r bg-white">
          <div className="border-b p-4">
            <div className="mb-1 flex items-center gap-2 px-2">
              <img src="/icon.svg" className="size-10 text-gray-500" alt="Gitlab MR Linker Options" />

              <h2 className="text-sm font-semibold">Gitlab Linker</h2>
            </div>
          </div>
          <div className="p-3">
            <div className="mb-3">
              <div className="mb-2 flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Server className="size-4 text-gray-500" />
                  <h3 className="text-sm font-medium text-gray-600">GitLab Instances</h3>
                </div>
              </div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="h-9 w-full justify-start rounded-lg text-sm font-normal hover:bg-gray-100">
                  gitlab.com
                </Button>
                <Button
                  variant="ghost"
                  className="h-9 w-full justify-start rounded-lg text-sm font-normal hover:bg-gray-100">
                  company.gitlab.com
                </Button>
              </div>
            </div>
            <Button variant="secondary" className="h-9 w-full justify-start text-sm">
              <Plus className="mr-2 size-4" />
              Add Instance
            </Button>
          </div>
        </div>
        <div className="flex-1 space-y-6 py-6 pr-6">
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
            <h2 className="mb-4 text-lg font-semibold">URL Pattern Settings</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="mb-2 block text-sm font-medium">Include Patterns</label>
                <Textarea
                  placeholder="Enter URL patterns to include (one per line)
Example:
*
*.gitlab.com
company.gitlab.com/*"
                  className="h-[120px] font-mono text-sm"
                  defaultValue="*"
                />
                <p className="mt-2 text-sm text-gray-600">Default is * (matches all URLs)</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Exclude Patterns</label>
                <Textarea
                  placeholder="Enter URL patterns to exclude (one per line)
Example:
*.gitlab.com/private/*
internal.gitlab.com/*"
                  className="h-[120px] font-mono text-sm"
                />
                <p className="mt-2 text-sm text-gray-600">Leave empty to exclude nothing</p>
              </div>
            </div>
          </Card>
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
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Position Settings</h2>
            <RadioGroup defaultValue="right-top">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-sm font-medium">Static Position</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left-top" id="left-top" />
                      <label htmlFor="left-top" className="text-sm font-medium">
                        Left Top
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right-top" id="right-top" />
                      <label htmlFor="right-top" className="text-sm font-medium">
                        Right Top
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left-bottom" id="left-bottom" />
                      <label htmlFor="left-bottom" className="text-sm font-medium">
                        Left Bottom
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right-bottom" id="right-bottom" />
                      <label htmlFor="right-bottom" className="text-sm font-medium">
                        Right Bottom
                      </label>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <h3 className="mb-3 text-sm font-medium">Dynamic Position</h3>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="near-cursor" id="near-cursor" />
                    <label htmlFor="near-cursor" className="text-sm font-medium">
                      Near Cursor
                    </label>
                  </div>
                  <p className="ml-6 mt-1 text-sm text-gray-600">Popup will appear near the mouse cursor position</p>
                </div>
              </div>
            </RadioGroup>
          </Card>
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Advanced Settings</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="prefetch-links" />
                  <label htmlFor="prefetch-links" className="text-sm font-medium">
                    Prefetch links
                  </label>
                </div>
                <p className="ml-6 mt-1 text-sm text-gray-600">
                  Automatically prefetch GitLab links in the background for faster navigation
                </p>
              </div>
            </div>
          </Card>
          <div className="flex items-center gap-4">
            <Button onClick={handleSave}>Save Settings</Button>
            {saved && <span className="text-sm font-medium text-green-600">Success saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

type FormValues = {
  apiUrl: string;
  gitlabToken: string;
};

const OptionsOld = () => {
  const gitlabToken = useStorage(gitlabTokenStorage);
  const apiUrl = useStorage(gitlabApiUrlStorage);
  const methods = useForm<FormValues>({
    defaultValues: {
      apiUrl,
      gitlabToken,
    },
  });

  const [saved, setSaved] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const { apiUrl, gitlabToken } = data;

    await gitlabTokenStorage.setToken(gitlabToken);
    await gitlabApiUrlStorage.setUrl(apiUrl);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Gitlab Linker Options</h1>

          <ApiUrlInput />

          <ApiTokenInput />

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none">
              Save
            </Button>
            {saved && <span className="text-sm font-medium text-green-500">Successfully saved!</span>}
          </div>

          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <h2 className="mb-2 text-sm font-medium text-gray-700">Required permission for token:</h2>
            <ul className="list-inside list-disc text-sm text-gray-600">
              <li>api</li>
              <li>read_api</li>
              <li>read_repository</li>
              <li>write_repository</li>
            </ul>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error occurred</div>);
