import { useEffect } from 'react';
import { useMergeRequest } from './use-merge-request';
import { getMRUrl } from '../services';

function iterateLinks(cb: (el: HTMLAnchorElement) => void) {
  document.querySelectorAll('a').forEach(item => {
    cb(item);
  });
}

export function usePrecacheAll() {
  const { precache } = useMergeRequest();

  useEffect(() => {
    iterateLinks(async el => {
      await precache(getMRUrl(el.href));
    });
  }, []);
}
