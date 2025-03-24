import { useEffect, useRef, useState } from 'react';
import {
  useInteractions,
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  useClick,
  useDismiss,
  useRole,
  FloatingFocusManager,
} from '@floating-ui/react';
// import { gitlabItemsStorage } from '@extension/storage';
import { MergeRequestCard } from '@extension/ui';

import type { GitLabService } from '@extension/shared';
import { gitlabBrokerService } from '@extension/shared';
import type { TransformedMR } from './transformer';
import { transformMR } from './transformer';

export default function App() {
  const [isOpen, setOpen] = useState(false);
  const [mr, setMr] = useState<TransformedMR | null>(null);
  const gitlabRef = useRef<GitLabService | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const isClick = false;

  const interactions = [isClick && click, dismiss, role].filter(item => Boolean(item));

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  useEffect(() => {
    const handleOpenPopover = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      gitlabRef.current = null;
      setMr(null);

      if (!link?.href) {
        return;
      }

      if (!link.href.includes('/merge_requests/')) {
        return;
      }

      const gitlab = await gitlabBrokerService.getInstanceByUrl(link.href);

      if (!gitlab) {
        return;
      }

      gitlabRef.current = gitlab;

      const hostname = gitlab.getApiHostname();

      if (globalThis.location.hostname == hostname) {
        return;
      }

      refs.setReference(link);
      // link.style.cursor = 'wait';
      // link.title = '';

      Object.entries(getReferenceProps()).forEach(([key, value]) => {
        if (key.startsWith('aria-')) {
          link.setAttribute(key, value as string);
        }
      });

      const mrData = await gitlab.getMRByUrl(link.href).catch(err => {
        console.log('gitlab.getMRByUrl', err);
      });

      link.style.cursor = '';

      if (!mrData) {
        console.error('glab-linker-crx: failed to fetch MR info');
        return;
      }

      const reviewApp = await gitlab.getMRReviewApp(mrData?.pipeline?.project_id, mrData?.pipeline?.ref);

      const data = transformMR(mrData, reviewApp);

      setMr(data);
      setOpen(true);
    };

    document.addEventListener('mouseover', handleOpenPopover);
    return () => document.removeEventListener('mouseover', handleOpenPopover);
  }, [refs, getReferenceProps, gitlabRef.current]);

  const handleMerge = async () => {
    if (mr && gitlabRef.current) {
      // handle 405 and json {"message":"405 Method Not Allowed"}
      await gitlabRef.current.mergeMR(mr.projectId, mr.iid);
    }
  };

  const handleClose = async () => {
    if (mr && gitlabRef.current) {
      // handle 405 and json {"message":"405 Method Not Allowed"}
      await gitlabRef.current.closeMR(mr.projectId, mr.iid);
    }
  };

  if (isOpen && mr) {
    return (
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999, outline: 'none' }}
          {...getFloatingProps()}>
          <MergeRequestCard {...mr} onMerge={handleMerge} onClose={handleClose} />
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
