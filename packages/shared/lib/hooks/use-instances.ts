import { instancesStorage } from '@extension/storage';
import { useStorage } from './useStorage';

export function useInstances() {
  return useStorage(instancesStorage);
}
