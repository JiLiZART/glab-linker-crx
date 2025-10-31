import { useEffect } from 'react';

export function useDocumentEvent<K extends keyof DocumentEventMap>(
  name: K,
  action: (ev: DocumentEventMap[K], signal: AbortSignal) => void,
) {
  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      name,
      e => {
        return action(e, abortController.signal);
      },
      { signal: abortController.signal },
    );

    return () => {
      abortController.abort();
    };
  }, [name, action]);
}
