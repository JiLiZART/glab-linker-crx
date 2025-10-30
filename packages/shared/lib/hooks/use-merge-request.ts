import { useCallback, useRef, useState } from 'react';
import type { FullMergeRequest } from '../services';
import { glabBroker } from '../services';
import { getMRUrl } from '../utils';

export function useMergeRequest() {
  const [actualUrl, setActualUrl] = useState<string | null>(null);
  const dataRef = useRef(new Map<string, FullMergeRequest>());

  const precache = useCallback(
    async (url: string | null) => {
      if (!url) {
        return;
      }

      const mr = await glabBroker.mr(url);

      dataRef.current.set(url, mr);

      return mr;
    },
    [dataRef],
  );

  const fetch = useCallback(
    async (href: string | null) => {
      const url = getMRUrl(href);

      if (!url) {
        return null;
      }

      if (await precache(url)) {
        setActualUrl(url);
      }

      return true;
    },
    [setActualUrl, precache],
  );

  async function onMerge(url: string) {
    const newMr = await glabBroker.mrMerge(url);

    if (newMr) {
      setActualUrl(url);
      dataRef.current.set(url, newMr);
    }
  }

  async function onClose(url: string) {
    const newMr = await glabBroker.mrClose(url);

    if (newMr) {
      setActualUrl(url);
      dataRef.current.set(url, newMr);
    }
  }

  async function refresh() {
    if (actualUrl) {
      const url = actualUrl;
      const newMr = await glabBroker.mr(url, true);
      dataRef.current.set(url, newMr);
    }
  }

  return {
    fetch,
    precache,
    refresh,
    isValidUrl: getMRUrl,
    url: actualUrl,
    data: actualUrl ? dataRef.current.get(actualUrl) : null,
    onMerge: onMerge,
    onClose: onClose,
  };
}
