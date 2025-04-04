import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { withErrorBoundary, withSuspense, gitlabBrokerService } from '@extension/shared';
import { gitlabItemsStorage } from '@extension/storage';
import { OptionsForm } from './settings/OptionsForm';
import { Sidebar } from './settings/Sidebar';

import type { GitlabConfigItem } from '@extension/storage';

import '@src/Options.css';
import type { OptionsFormValues } from './types';

const useLocationId = () => {
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const [id, setId] = useState(params.get('id'));

  return {
    id,
    setId: (id: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set('id', id);
      window.history.pushState({}, '', url.toString());
      setId(id);
    },
  };
};

const useOptionsItems = () => {
  const [menuItems, setMenuItems] = useState<GitlabConfigItem[]>([]);
  const { id, setId } = useLocationId();
  const activeId = id || menuItems?.[0]?.id;

  const item = menuItems.find(item => item.id === activeId)!;

  useEffect(() => {
    gitlabItemsStorage.getItems().then(items => setMenuItems(items));
  }, []);

  const add = async () => {
    const newItem = await gitlabItemsStorage.addItem('New Instance');
    setMenuItems([...menuItems, newItem]);
  };

  const view = async (id: string) => {
    setId(id);
  };

  const save = async (id: string, values: OptionsFormValues) => {
    const gitlabInstance = await gitlabBrokerService.createInstance({
      id,
      name: values.hostname,
      form: values,
    });

    // check token access
    await gitlabInstance.getProjects();

    await gitlabItemsStorage.setForId(id, {
      name: values.hostname,
      form: values,
    });
  };

  return {
    items: menuItems,
    item,
    add,
    view,
    save,
  };
};

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="flex min-h-screen w-full bg-gray-50">
      <div className="mx-auto flex w-full max-w-6xl gap-6">{children}</div>
    </section>
  );
};

const LoadingState = () => {
  return (
    <Layout>
      <Sidebar items={[]} />
      <form className="flex-1 space-y-6 py-6 pr-6"></form>
    </Layout>
  );
};

const Options = () => {
  const { items, add, save, view, item } = useOptionsItems();

  console.log('useOptionsItems', { items, add, save, view, item });

  if (!item || items.length === 0) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <Sidebar items={items} activeId={item.id} onAddItem={add} onViewItem={view} />
      <OptionsForm key={item.id} defaultValues={item?.form} onSave={values => save(item.id, values)} />
    </Layout>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingState />), <div>Error occurred</div>);
