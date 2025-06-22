import { settingsStorage } from '@extension/storage';
import { useStorage } from './useStorage';

export function useSettings() {
  return useStorage(settingsStorage);
}
