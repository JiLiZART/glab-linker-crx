import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type SettingsType = {
  prefetchLinks?: boolean;
  showDescription?: boolean;
  showAvatar?: boolean;
  showMerge?: boolean;

  position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'near-cursor';

  whitelist?: string;
  blacklist?: string;
};

type SettingsTypeKeys = keyof SettingsType;

type SettingsStorage = BaseStorage<SettingsType> & {
  setKeyValue: (name: string, value: unknown) => Promise<void>;
  getKeyValue: (name: string) => Promise<unknown>;
};

const defaultSettings: SettingsType = {
  prefetchLinks: false,
  showDescription: true,
  showAvatar: true,
  showMerge: true,

  position: 'left-top',

  whitelist: '',
  blacklist: '',
};

const storage = createStorage<SettingsType>('glab-linker-settings', defaultSettings, {
  storageEnum: StorageEnum.Sync,
  liveUpdate: true,
});

export const settingsStorage: SettingsStorage = {
  ...storage,

  setKeyValue: async (name: string, value: unknown) => {
    const config = await storage.get();

    const key = name as SettingsTypeKeys;

    await storage.set({ ...config, [key]: value });
  },

  getKeyValue: async (name: string) => {
    const config = await storage.get();

    const key = name as SettingsTypeKeys;

    return config[key];
  },
};
