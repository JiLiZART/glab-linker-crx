import { useState } from 'react';
import { Sidebar } from './settings/Sidebar';
import { GitLabInstanceSettings } from './settings/GitLabInstanceSettings';
import { URLPatternSettings } from './settings/URLPatternSettings';
import { DisplaySettings } from './settings/DisplaySettings';
import { PositionSettings } from './settings/PositionSettings';
import { AdvancedSettings } from './settings/AdvancedSettings';
import { useForm, FormProvider } from 'react-hook-form';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabItemsStorage } from '@extension/storage';

import '@src/Options.css';
import { Actions } from './settings/Actions';

type FormValues = {
  apiUrl: string;
  token: string;
};

const Options = () => {
  const [menuItems, setMenuItems] = useState<Array<{ name: string; id: string }>>([
    { name: 'gitlab.com', id: 'gitlab.com' },
    { name: 'company.gitlab.com', id: 'company.gitlab.com' },
  ]);
  const [saved, setSaved] = useState(false);
  const token = '';
  const apiUrl = '';
  const gitlabItems = useStorage(gitlabItemsStorage);
  // const apiUrl = useStorage(gitlabApiUrlStorage);
  const methods = useForm<FormValues>({
    defaultValues: {
      apiUrl,
      token,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { apiUrl, token } = data;

    // await gitlabTokenStorage.setToken(gitlabToken);
    // await gitlabApiUrlStorage.setUrl(apiUrl);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const onAddItem = () => {
    setMenuItems([...menuItems, { name: 'New Instance', id: nanoid() }]);
    gitlabItems.addItem('New Instance');
  };

  const onShowItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
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

            <Actions saved={saved} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error occurred</div>);
