import { useEffect, useState } from 'react';
import { instancesStorage } from '@extension/storage';
import type { InstanceConfig } from '@extension/storage';
import type { OptionsFormValues } from '@src/types';
import { glabBroker } from '@extension/shared';

export const useOptionsItems = () => {
  const [menuItems, setMenuItems] = useState<InstanceConfig[]>([]);

  useEffect(() => {
    instancesStorage.items().then(items => setMenuItems(items));
  }, []);

  const add = async () => {
    const newItem = await instancesStorage.add('New Instance');
    setMenuItems([...menuItems, newItem]);
  };

  const save = async (id: string, values: OptionsFormValues) => {
    const glab = await glabBroker.create({
      id,
      name: values.hostname,
      token: values.token,
      hostname: values.hostname,
    });

    // check token access
    await glab.projects();

    await instancesStorage.forId(id, {
      name: values.hostname,
      token: values.token,
      hostname: values.hostname,
    });

    const items = await instancesStorage.items()

    setMenuItems(items)
  };

  return {
    items: menuItems,
    add,
    save,
  };
};
