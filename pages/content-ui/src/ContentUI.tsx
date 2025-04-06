import { useEffect, useRef, useState } from 'react';
import {
  useInteractions,
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  // useClick,
  useDismiss,
  useRole,
  FloatingFocusManager,
  useClientPoint,
} from '@floating-ui/react';
// import { gitlabItemsStorage } from '@extension/storage';
import { Card, MergeRequestCard } from '@extension/ui';

import { gitlabBrokerService } from '@extension/shared';
import { transformMR, type TransformedMR } from './transformer';

function iterateLinks(cb: (el: HTMLAnchorElement) => void) {
  document.querySelectorAll('a').forEach(item => {
    cb(item);
  });
}

function getLinkUrl(link: HTMLAnchorElement) {
  if (!link?.href) {
    return null;
  }

  if (!link.href.includes('/merge_requests/')) {
    return null;
  }

  return link.href;
}

export default function ContentUI() {
  const [isOpen, setOpen] = useState(false);
  const [mr, setMr] = useState<TransformedMR | null>(null);
  const actionsRef = useRef<{
    onMerge: () => Promise<void>;
    onClose: () => Promise<void>;
  } | null>(null);

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

  // const isClick = false;

  const isPrecacheAll = true;

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, clientPoint, role]);

  useEffect(() => {
    iterateLinks(async el => {
      const url = getLinkUrl(el);

      if (!url) {
        return;
      }

      const gitlab = await gitlabBrokerService.getInstanceByUrl(url);

      if (!gitlab) {
        return;
      }

      const hostname = gitlab.getApiHostname();

      if (globalThis.location.hostname == hostname) {
        return;
      }

      gitlabBrokerService.precacheByUrl(url);
    });

    const handleOpenPopover = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('a');

      if (!el) {
        return;
      }

      const url = getLinkUrl(el);

      if (!url) {
        return;
      }

      const gitlab = await gitlabBrokerService.getInstanceByUrl(url);

      if (!gitlab) {
        return;
      }

      const hostname = gitlab.getApiHostname();

      if (globalThis.location.hostname == hostname) {
        return;
      }

      setOpen(true);

      const mrData = await gitlab.getMRByUrl(url).catch(err => {
        console.log('gitlab.getMRByUrl', err);
      });

      if (!mrData) {
        console.error('glab-linker-crx: failed to fetch MR info');
        return;
      }

      const reviewApp = await gitlab.getMRReviewApp(mrData?.pipeline?.project_id, mrData?.pipeline?.ref);

      const mr = transformMR(mrData, reviewApp);

      if (mr) {
        actionsRef.current = {
          async onMerge() {
            const mrData = await gitlab.mergeMR(mr.projectId, mr.iid);
            const newMr = transformMR(mrData, reviewApp);

            setMr(newMr);
          },
          async onClose() {
            const mrData = await gitlab.closeMR(mr.projectId, mr.iid);
            const newMr = transformMR(mrData, reviewApp);

            setMr(newMr);
          },
        };
      }

      setMr(mr);
    };

    document.addEventListener('mouseover', handleOpenPopover);
    return () => document.removeEventListener('mouseover', handleOpenPopover);
  }, [refs, getReferenceProps, isPrecacheAll, mr]);

  const handleMerge = async () => {
    actionsRef.current?.onMerge();
  };

  const handleClose = async () => {
    actionsRef.current?.onClose();
  };

  console.log({ floatingStyles, props: getFloatingProps() });

  if (isOpen) {
    return (
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999, outline: 'none' }}
          {...getFloatingProps()}>
          {mr && <MergeRequestCard {...mr} onMerge={handleMerge} onClose={handleClose} />}
          {!mr && <Card className="w-full max-w-2xl transition-all hover:shadow-lg">Loading...</Card>}
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
