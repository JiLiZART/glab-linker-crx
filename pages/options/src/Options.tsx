import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Input, RadioGroup, RadioGroupItem, Textarea, Card, Checkbox } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';
import { Plus, ExternalLink, User, MessageSquare, Settings, Server } from "lucide-react";
import { MergeRequestCard } from '@extension/ui';

import { ApiUrlInput } from './ui/ApiUrlInput';
import { ApiTokenInput } from './ui/ApiTokenInput';
import '@src/Options.css';
// import { OptionsForm, OptionsFormValues } from './ui/form/form';

const mergePreviewData = {
  title: "MR title",
  description: 'MR Description',
  author: {
    name: 'John Doe',
    avatar: 'Avatar url'
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
    status: 'running' // 'running' | 'success' | 'failed' | 'pending' | string;
  },
  approvals: {
    approvers: [{ name: 'Foo Bar', avatar: '#' }],
    required: 2,
  },
  reviewers: [
    { name: 'Reviewer 1', avatar: '#' },
    { name: 'Reviewer 2', avatar: '#' }
  ],
  canMerge: true,
  youCanMerge: true,
  mergeBlockers: ['Merge Blocker 1', 'Merge Blocker 2'],
  reviewApp: {
    url: '#',
    slug: 'review-app-slug-XXX-999-111',
    state: 'available',
  },
  onMerge: () => new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
      alert('Merged')
    }, 3000)
  }),
  onClose: () => new Promise((resolve) => {
    setTimeout(() => {
      resolve(undefined);
      alert('Closed!')
    }, 3000)
  })
}

const Options = () => {
  const requiredScopes = ["api", "read_repository", "write_repository", "read_api"];
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return <div className="flex w-full min-h-screen bg-gray-50">
    <div className="flex w-full max-w-6xl mx-auto gap-6">
      <div className="w-64 shrink-0 bg-white border-r min-h-screen">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2 px-2 mb-1">
            <img src="/icon.svg" className='w-10 h-10 text-gray-500' alt="Gitlab MR Linker Options" />

            <h2 className="font-semibold text-sm">Gitlab Linker</h2>
          </div>
        </div>
        <div className="p-3">
          <div className="mb-3">
            <div className="flex items-center justify-between px-2 mb-2">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-gray-500" />
                <h3 className="text-sm font-medium text-gray-600">
                  GitLab Instances
                </h3>
              </div>
            </div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start text-sm font-normal hover:bg-gray-100 rounded-lg h-9">
                gitlab.com
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm font-normal hover:bg-gray-100 rounded-lg h-9">
                company.gitlab.com
              </Button>
            </div>
          </div>
          <Button variant="secondary" className="w-full justify-start text-sm h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add Instance
          </Button>
        </div>
      </div>
      <div className="flex-1 py-6 pr-6 space-y-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            GitLab Instance Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Hostname
              </label>
              <Input placeholder="e.g. gitlab.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Access Token
              </label>
              <Input type="password" placeholder="Your GitLab access token" />
              <div className="mt-2 text-sm text-gray-600">
                <a href="https://gitlab.com/-/profile/personal_access_tokens" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  Create access token
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">
                Required API Scopes:
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {requiredScopes.map(scope => <li key={scope}>{scope}</li>)}
              </ul>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">URL Pattern Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Include Patterns
              </label>
              <Textarea placeholder="Enter URL patterns to include (one per line)
Example:
*
*.gitlab.com
company.gitlab.com/*" className="h-[120px] font-mono text-sm" defaultValue="*" />
              <p className="mt-2 text-sm text-gray-600">
                Default is * (matches all URLs)
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Exclude Patterns
              </label>
              <Textarea placeholder="Enter URL patterns to exclude (one per line)
Example:
*.gitlab.com/private/*
internal.gitlab.com/*" className="h-[120px] font-mono text-sm" />
              <p className="mt-2 text-sm text-gray-600">
                Leave empty to exclude nothing
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Display Settings</h2>
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
              <h3 className="text-sm font-medium mb-3">Preview</h3>

              <div className="p-4 bg-gray-50">
                <MergeRequestCard {...mergePreviewData} />
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Position Settings</h2>
          <RadioGroup defaultValue="right-top">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Static Position</h3>
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
                <h3 className="text-sm font-medium mb-3">Dynamic Position</h3>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="near-cursor" id="near-cursor" />
                  <label htmlFor="near-cursor" className="text-sm font-medium">
                    Near Cursor
                  </label>
                </div>
                <p className="text-sm text-gray-600 mt-1 ml-6">
                  Popup will appear near the mouse cursor position
                </p>
              </div>
            </div>
          </RadioGroup>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2">
                <Checkbox id="prefetch-links" />
                <label htmlFor="prefetch-links" className="text-sm font-medium">
                  Prefetch links
                </label>
              </div>
              <p className="text-sm text-gray-600 mt-1 ml-6">
                Automatically prefetch GitLab links in the background for
                faster navigation
              </p>
            </div>
          </div>
        </Card>
        <div className="flex items-center gap-4">
          <Button onClick={handleSave}>Save Settings</Button>
          {saved && <span className="text-sm text-green-600 font-medium">
            Success saved!
          </span>}
        </div>
      </div>
    </div>
  </div>;
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
