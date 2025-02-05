import { useState } from 'react';
import { Sidebar } from './settings/Sidebar';
import { GitLabInstanceSettings } from './settings/GitLabInstanceSettings';
import { URLPatternSettings } from './settings/URLPatternSettings';
import { DisplaySettings } from './settings/DisplaySettings';
import { PositionSettings } from './settings/PositionSettings';
import { AdvancedSettings } from './settings/AdvancedSettings';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';

import '@src/Options.css';

type FormValues = {
  apiUrl: string;
  gitlabToken: string;
};

const Options = () => {
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex min-h-screen w-full bg-gray-50">
        <div className="mx-auto flex w-full max-w-6xl gap-6">
          <Sidebar />
          <div className="flex-1 space-y-6 py-6 pr-6">
            <GitLabInstanceSettings />
            <URLPatternSettings />
            <DisplaySettings />
            <PositionSettings />
            <AdvancedSettings />

            <div className="flex items-center gap-4">
              <Button onClick={handleSave}>Save Settings</Button>
              {saved && <span className="text-sm font-medium text-green-600">Success saved!</span>}
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error occurred</div>);
