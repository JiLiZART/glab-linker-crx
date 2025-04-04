import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Sidebar } from './settings/Sidebar';
import { GitLabInstanceSettings } from './settings/GitLabInstanceSettings';
import { URLPatternSettings } from './settings/URLPatternSettings';
import { DisplaySettings } from './settings/DisplaySettings';
import { PositionSettings } from './settings/PositionSettings';
import { AdvancedSettings } from './settings/AdvancedSettings';
import { Actions } from './settings/Actions';
import { useForm, FormProvider } from 'react-hook-form';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import type { GitlabItemsStorage } from '@extension/storage';
import { gitlabItemsStorage } from '@extension/storage';

import '@src/Options.css';

function timeout(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

type OptionsFormProps = {
  onSave: () => Promise<void>;
  defaultValues: Partial<OptionsFormValues>;
};

const OptionsForm = (props: OptionsFormProps) => {
  const { onSave, defaultValues } = props;
  const [saved, setSaved] = useState(false);
  const methods = useForm<OptionsFormValues>({
    defaultValues: defaultValues,
  });
  const { handleSubmit, control } = methods;

  const onSubmit = async (values: OptionsFormValues) => {
    // const { apiUrl, token } = data;

    console.log({ values });

    // await gitlabTokenStorage.setToken(gitlabToken);
    // await gitlabApiUrlStorage.setUrl(apiUrl);

    setSaved(true);
    await timeout(2000);
    setSaved(false);

    await onSave();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 py-6 pr-6">
        <GitLabInstanceSettings control={control} />
        <URLPatternSettings control={control} />
        <DisplaySettings control={control} />
        <PositionSettings control={control} />
        <AdvancedSettings control={control} />

        <Actions saved={saved} />
      </form>
    </FormProvider>
  );
};

const useOptionsItems = (gitlabItemsStorage: GitlabItemsStorage) => {
  const [menuItems, setMenuItems] = useState<Array<{ name: string; id: string }>>([
    { name: 'gitlab.com', id: 'gitlab.com' },
  ]);
  const [activeId, setActiveId] = useState(menuItems[0].id);
  const item = menuItems.find(item => item.id === activeId)!;

  const add = async () => {
    setMenuItems([...menuItems, { name: 'New Instance', id: nanoid() }]);
    console.log({ gitlabItemsStorage });
    // gitlabItems.addItem('New Instance');
  };

  const view = async (id: string) => {
    setActiveId(id);
  };

  const save = async () => {};

  return {
    items: menuItems,
    item,
    add,
    view,
    save,
  };
};

const Options = () => {
  const gitlabItems = useStorage<GitlabItemsStorage>(gitlabItemsStorage);
  // const apiUrl = useStorage(gitlabApiUrlStorage);
  const { items, add, save, view, item } = useOptionsItems(gitlabItems as unknown as GitlabItemsStorage);

  return (
    <section className="flex min-h-screen w-full bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl gap-6">
        <Sidebar items={items} onAddItem={add} onViewItem={view} />
        <OptionsForm key={item.id} defaultValues={item} onSave={save} />
      </div>
    </section>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error occurred</div>);
