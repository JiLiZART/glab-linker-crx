import type { DependencyList } from 'react';
import { useCallback, useEffect } from 'react';

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  name: K,
  action: (this: Document, ev: DocumentEventMap[K]) => void,
  deps: DependencyList = [],
) {
  const cb = useCallback(action, deps);

  useEffect(() => {
    document.addEventListener(name, cb);
    return () => document.removeEventListener(name, cb);
  }, [name, action, cb]);
}
