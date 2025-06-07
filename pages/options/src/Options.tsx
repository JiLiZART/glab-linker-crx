import type { ReactNode } from 'react';
import { withErrorBoundary, withSuspense, glabBroker } from '@extension/shared';
import { gitlabItemsStorage } from '@extension/storage';
import { InstanceForm } from './settings/instance-form';
import { Sidebar } from './settings/sidebar';

import '@src/Options.css';
import { useOptionsItems } from './settings/use-options-items';
import { useLocationId } from '@src/settings/use-location-id';

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

  console.log('useOptionsItems', { items, add, save, item });

  if (!item || items.length === 0) {
    return <LoadingState />;
  }

  return (
    <Layout>
      <Sidebar items={items} activeId={item.id} onAddItem={add} onViewItem={(id) => setId(id)} />
      <InstanceForm key={item.id} defaultValues={item} onSave={values => save(item.id, values)} />
    </Layout>
  );
};

export default withErrorBoundary(withSuspense(Options, <LoadingState />), <div>Error occurred</div>);
