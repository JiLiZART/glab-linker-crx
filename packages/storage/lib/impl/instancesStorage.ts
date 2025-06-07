import { nanoid } from 'nanoid';
import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import { jsonSerialization } from '../base/json-serialization';

export type InstanceConfig = {
  id: string;
  name: string;

  token?: string;
  hostname?: string;
};

export type InstancesStorage = BaseStorage<InstanceConfig[]> & {
  add: (name: string, config?: InstanceConfig) => Promise<InstanceConfig>;
  byId: (id: string) => Promise<InstanceConfig | undefined>;
  byHost: (host: string) => Promise<InstanceConfig | undefined>;
  forId: (id: string, data: Partial<InstanceConfig>) => Promise<void>;
  items: () => Promise<InstanceConfig[]>;
};

const storage = createStorage<InstanceConfig[]>('glab-items', [], {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
  serialization: jsonSerialization,
});

export const instancesStorage: InstancesStorage = {
  ...storage,
  add: async (name: string, form?: InstanceConfig) => {
    const items = await storage.get();
    const newItem = { id: nanoid(), name, form };

    await storage.set([...items, newItem]);

    return newItem;
  },

  items: async () => {
    const items = await storage.get();

    if (!items?.length) {
      const defaultItems = [
        {
          name: 'gitlab.com',
          id: 'gitlab.com',
          form: {
            hostname: 'https://gitlab.com',
          },
        },
      ];

      await storage.set(defaultItems);

      return defaultItems;
    }

    return items;
  },

  byId: async (id: string) => {
    const items = await storage.get();

    return items.find(item => item.id === id);
  },

  byHost: async (host: string) => {
    const items = await storage.get();

    return items.find(item => item.hostname?.includes(host));
  },

  forId: async (id: string, data: Partial<InstanceConfig>) => {
    const items = await storage.get();
    const item = items.find(item => item.id === id);

    if (item) {
      await storage.set([...items.filter(item => item.id !== id), { ...item, ...data, id }]);
    }
  },
};
