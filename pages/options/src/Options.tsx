import { useState } from 'react';
import { nanoid } from 'nanoid';
import { Sidebar } from './settings/Sidebar';

import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabItemsStorage } from '@extension/storage';
import type { GitlabConfigItem, GitlabItemsStorage } from '@extension/storage';

import '@src/Options.css';
import { OptionsForm } from './settings/OptionsForm';

const useOptionsItems = (gitlabItemsStorage: GitlabItemsStorage) => {
  const [menuItems, setMenuItems] = useState<Array<GitlabConfigItem>>([{ name: 'gitlab.com', id: 'gitlab.com' }]);
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
        <OptionsForm key={item.id} defaultValues={item?.form} onSave={save} />
      </div>
    </section>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error occurred</div>);
