import { nanoid } from 'nanoid';
import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

export type GitlabConfigItem = {
  id: string;
  name: string;

  form?: {
    token: string;
    hostname: string;
    prefetchLinks?: boolean;
    showDescription?: boolean;
    showAvatar?: boolean;
    showMerge?: boolean;

    position: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'near-cursor';

    whitelist: string;
    blacklist: string;
  };
};

export type GitlabItemsStorage = BaseStorage<GitlabConfigItem[]> & {
  addItem: (name: string) => Promise<void>;
  findById: (id: string) => Promise<GitlabConfigItem | undefined>;
  setForId: (id: string, data: Partial<GitlabConfigItem>) => Promise<void>;
  getItems: () => Promise<GitlabConfigItem[]>;
};

const storage = createStorage<GitlabConfigItem[]>('glab-items', [], {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
  serialization: {
    serialize: JSON.stringify,
    deserialize: JSON.parse,
  },
});

export const gitlabItemsStorage: GitlabItemsStorage = {
  ...storage,
  addItem: async (name: string) => {
    const items = await storage.get();

    await storage.set([...items, { id: nanoid(), name }]);
  },

  getItems: async () => {
    return await storage.get();
  },

  findById: async (id: string) => {
    const items = await storage.get();

    return items.find(item => item.id === id);
  },

  setForId: async (id: string, data: Partial<GitlabConfigItem>) => {
    const items = await storage.get();
    const item = items.find(item => item.id === id);

    if (item) {
      await storage.set([...items.filter(item => item.id !== id), { ...item, ...data }]);
    }
  },
};
