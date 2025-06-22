import { useEffect } from 'react';
import { useMergeRequest } from './use-merge-request';
import { useSettings } from './use-settings';

function observeLinks(callback: (href: string) => void) {
  const existingLinks = document.querySelectorAll('a');

  existingLinks.forEach(link => {
    if (link.href) {
      callback(link.href);
    }
  });

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as HTMLElement;

          if (element.tagName.toLowerCase() === 'a') {
            const link = element as HTMLAnchorElement;

            if (link.href) {
              callback(link.href);
            }
          } else {
            const links = element.querySelectorAll('a');
            links.forEach(link => {
              if (link.href) {
                callback(link.href);
              }
            });
          }
        }
      });
    });
  });

  // Запускаем наблюдение за всем документом
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export function usePrecacheAll() {
  const { precache } = useMergeRequest();
  const { prefetchLinks } = useSettings();

  useEffect(() => {
    if (prefetchLinks) {
      observeLinks(async href => {
        await precache(href);
      });
    }
  }, [prefetchLinks, precache]);
}
