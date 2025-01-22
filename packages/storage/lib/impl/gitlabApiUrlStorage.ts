import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';

type GitlabApiUrlStorage = BaseStorage<string> & {
  setUrl: (val: string) => Promise<void>;
};

const storage = createStorage<string>('gitlab-api-url', 'https://gitlab.com/api/v4', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const gitlabApiUrlStorage: GitlabApiUrlStorage = {
  ...storage,
  setUrl: async (val: string) => {
    await storage.set(val);
  },
};
