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
}

type SettingsStorage = BaseStorage<string> & {
  setUrl: (val: string) => Promise<void>;
};

const storage = createStorage<string>('gitlab-url', 'https://gitlab.com', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const gitlabApiUrlStorage: SettingsStorage = {
  ...storage,
  setUrl: async (val: string) => {
    await storage.set(val);
  },
};
