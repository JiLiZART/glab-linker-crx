import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type GitlabTokenStorage = BaseStorage<string> & {
  setToken: (val: string) => Promise<void>;
};

const storage = createStorage<string>('gitlab-token', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const gitlabTokenStorage: GitlabTokenStorage = {
  ...storage,
  setToken: async (val: string) => {
    await storage.set(val);
  },
};
