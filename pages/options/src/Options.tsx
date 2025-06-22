import type { ReactNode } from 'react';
import { withErrorBoundary, withSuspense } from '@extension/shared';
// import { gitlabItemsStorage } from '@extension/storage';
import { InstanceForm } from './settings/instance-form';
import { Sidebar } from './settings/sidebar';

import '@src/Options.css';
import { useOptionsItems } from '@src/settings/use-options-items';
import { useLocationId } from '@src/settings/use-location-id';
import type { SettingsFormProps } from '@src/settings/settings-form';
import { SettingsForm } from '@src/settings/settings-form';
import { settingsStorage } from '@extension/storage';

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
  const { id, setId } = useLocationId();
  const { items, add, save } = useOptionsItems();
  const item = items.find(item => item.id === id);

  if (!item || items.length === 0) {
    return <LoadingState />;
  }

  const onSettingsSave: SettingsFormProps['onSave'] = async values => {
    Object.entries(values).forEach(([key, value]) => {
      settingsStorage.set(key, value);
    });
  };

  const isSettings = item.id === 'settings';

  return (
    <Layout>
      <Sidebar items={items} activeId={item.id} onAddItem={add} onViewItem={id => setId(id)} />
      {!isSettings && <InstanceForm key={item.id} defaultValues={item} onSave={values => save(item.id, values)} />}
      {isSettings && <SettingsForm onSave={onSettingsSave} />}
    </Layout>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingState />), <div>Error occurred</div>);
