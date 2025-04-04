import { nanoid } from 'nanoid';
import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

export type GitlabConfigItem = {
  id: string;
  name: string;

  form?: {
    token?: string;
    hostname?: string;
    prefetchLinks?: boolean;
    showDescription?: boolean;
    showAvatar?: boolean;
    showMerge?: boolean;

    position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'near-cursor';

    whitelist?: string;
    blacklist?: string;
  };
};

function tryJSONParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export type GitlabItemsStorage = BaseStorage<GitlabConfigItem[]> & {
  addItem: (name: string, form?: GitlabConfigItem['form']) => Promise<GitlabConfigItem>;
  findById: (id: string) => Promise<GitlabConfigItem | undefined>;
  setForId: (id: string, data: Partial<GitlabConfigItem>) => Promise<void>;
  getItems: () => Promise<GitlabConfigItem[]>;
};

const storage = createStorage<GitlabConfigItem[]>('glab-items', [], {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
  serialization: {
    serialize(value) {
      debugger;
      return JSON.stringify(value);
    },
    deserialize(text) {
      debugger;
      return tryJSONParse(text);
    },
  },
});

export const gitlabItemsStorage: GitlabItemsStorage = {
  ...storage,
  addItem: async (name: string, form?: GitlabConfigItem['form']) => {
    const items = await storage.get();
    const newItem = { id: nanoid(), name, form };

    await storage.set([...items, newItem]);

    return newItem;
  },

  getItems: async () => {
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

  findById: async (id: string) => {
    const items = await storage.get();

    return items.find(item => item.id === id);
  },

  setForId: async (id: string, data: Partial<GitlabConfigItem>) => {
    const items = await storage.get();
    const item = items.find(item => item.id === id);

    if (item) {
      await storage.set([...items.filter(item => item.id !== id), { ...item, ...data, id }]);
    }
  },
};
