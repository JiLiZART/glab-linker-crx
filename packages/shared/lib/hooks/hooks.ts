import { type DependencyList, useCallback, useEffect, useRef, useState } from 'react';
import type { FullMergeRequest } from '../services';
import { gitlabBrokerService } from '../services';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClientPoint,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';

export function useMergeRequest() {
  const [actualUrl, setActualUrl] = useState<string | null>(null);
  const dataRef = useRef(new Map<string, FullMergeRequest>());

  const fetch = useCallback(
    async (url: string | null) => {
      if (!url) {
        return;
      }

      const mr = await gitlabBrokerService.getFullMR(url);

      dataRef.current.set(url, mr);
      setActualUrl(url);

      return true;
    },
    [setActualUrl, dataRef],
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
    refresh,
    url: actualUrl,
    data: actualUrl ? dataRef.current.get(actualUrl) : null,
    onMerge: onMerge,
    onClose: onClose,
  };
}

export function usePopup() {
  const [isOpen, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  // const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const clientPoint = useClientPoint(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, clientPoint, role]);

  return {
    isOpen,
    onOpen: () => setOpen(true),
    onClose: async () => setOpen(false),
    context,
    popupRef: refs.setFloating,
    referenceProps: {
      ...getReferenceProps(),
    },
    popupProps: {
      style: { ...floatingStyles, zIndex: 9999, outline: 'none' },
      ...getFloatingProps(),
    } as const,
  };
}

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

export function useSettings() {
  return function (url: string | null) {
    return {
      position: 'left-top',
      whitelist: 'https://gitlab.example.com',
      blacklist: 'https://gitlab.example.com',
    };
  };
}

function iterateLinks(cb: (el: HTMLAnchorElement) => void) {
  document.querySelectorAll('a').forEach(item => {
    cb(item);
  });
}

export function getMRUrl(url?: string) {
  if (!url) {
    return null;
  }

  if (!url.includes('/merge_requests/')) {
    return null;
  }

  return url;
}

// export function useMergeRequestFetch() {
//
//   return () => {
//     const url = getMRUrl(el?.href);
//
//     if (!url) {
//       return;
//     }
//
//     const gitlab = await gitlabBrokerService.getInstanceByUrl(url);
//
//     if (!gitlab) {
//       return;
//     }
//
//     const hostname = gitlab.getApiHostname();
//
//     if (isSelfPage(hostname)) {
//       return;
//     }
//
//     const options = getOptions(url);
//
//     const isPrecache = true
//   }
// }

export function usePrecacheAll() {
  const { action } = useMergeRequest();

  useEffect(() => {
    iterateLinks(async el => {
      await action(getMRUrl(el.href));
    });
  }, [action]);
}
