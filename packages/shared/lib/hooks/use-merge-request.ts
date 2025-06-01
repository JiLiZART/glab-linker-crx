import { useCallback, useRef, useState } from 'react';
import type { FullMergeRequest } from '../services';
import { gitlabBrokerService } from '../services';

export function useMergeRequest() {
  const [actualUrl, setActualUrl] = useState<string | null>(null);
  const dataRef = useRef(new Map<string, FullMergeRequest>());

  const precache = useCallback(
    async (url: string | null) => {
      if (!url) {
        return;
      }

      const mr = await gitlabBrokerService.getFullMR(url);

      dataRef.current.set(url, mr);

      return mr;
    },
    [dataRef],
  );

  const fetch = useCallback(
    async (url: string | null) => {
      if (await precache(url)) {
        setActualUrl(url);
      }

      return true;
    },
    [setActualUrl, precache],
  );

  async function onMerge(url: string) {
    const newMr = await gitlabBrokerService.mergeMR(url);

    if (newMr) {
      setActualUrl(url);
      dataRef.current.set(url, newMr);
    }
  }

  async function onClose(url: string) {
    const newMr = await gitlabBrokerService.closeMR(url);

    if (newMr) {
      setActualUrl(url);
      dataRef.current.set(url, newMr);
    }
  }

  async function refresh() {
    if (actualUrl) {
      const url = actualUrl;
      const newMr = await gitlabBrokerService.getFullMR(url, true);
      dataRef.current.set(url, newMr);
    }
  }

  return {
    action: fetch,
    precache,
    refresh,
    url: actualUrl,
    data: actualUrl ? dataRef.current.get(actualUrl) : null,
    onMerge: onMerge,
    onClose: onClose,
  };
}
