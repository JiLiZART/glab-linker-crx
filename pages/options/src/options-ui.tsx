import type { ReactNode } from 'react';
import { useSettings, withErrorBoundary, withSuspense } from '@extension/shared';
import { InstanceForm } from './settings/instance-form';
import { Sidebar } from './settings/sidebar';
import { useOptionsItems } from './settings/use-options-items';
import { useLocationId } from './settings/use-location-id';
import { SettingsForm } from './settings/settings-form';
import { settingsStorage } from '@extension/storage';

import type { SettingsFormProps } from './settings/settings-form';

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
      <Sidebar key="loading" />
      <form className="flex-1 space-y-6 py-6 pr-6"></form>
    </Layout>
  );
};

const Options = () => {
  const { id, setId } = useLocationId('settings');
  const { items, add, save } = useOptionsItems();
  const settings = useSettings();
  const item = items.find(item => item.id === id);

  const onSettingsSave: SettingsFormProps['onSave'] = async values => {
    Object.entries(values).forEach(([key, value]) => {
      settingsStorage.setKeyValue(key, value);
    });
  };

  const onViewItem = (id: string) => {
    setId(id);
  };

  if (item) {
    return (
      <Layout>
        <Sidebar key="options" items={items} activeId={id} onAddItem={add} onViewItem={onViewItem} />
        <InstanceForm key={item?.id} defaultValues={item} onSave={values => save(item.id, values)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Sidebar key="options" items={items} activeId={id} onAddItem={add} onViewItem={onViewItem} />
      <SettingsForm onSave={onSettingsSave} defaultValues={settings} />
    </Layout>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingState />), <div>Error occurred</div>);
