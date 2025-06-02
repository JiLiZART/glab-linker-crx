import { FloatingFocusManager } from '@floating-ui/react';
import { useMergeRequest, usePopup, useDocumentEvent, usePrecacheAll, getMRUrl } from '@extension/shared';
import { MergeRequestCard, FullscreenModal } from '@extension/ui';
import { useState } from 'react';

export default function ContentUI() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { action, refresh, data, onMerge, onClose: onCloseMR } = useMergeRequest();
  const {
    isOpen: isPopupOpen,
    onOpen,
    onClose: onPopupClose,
    context,
    popupRef,
    popupProps,
    setPositionRef,
  } = usePopup();

  usePrecacheAll();

  useDocumentEvent('mouseover', async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const el = target.closest('a');

    if (!el) {
      return;
    }

    const { clientX, clientY } = e;

    setPositionRef({
      getBoundingClientRect() {
        return {
          width: 0,
          height: 0,
          x: clientX,
          y: clientY,
          top: clientY,
          left: clientX,
          right: clientX,
          bottom: clientY,
        };
      },
    });

    const url = getMRUrl(el?.href);

    if (!url) {
      return;
    }

    setIsFullscreen(false);
    onOpen?.();

    await action(url);
  });

  if (isFullscreen) {
    return (
      <FullscreenModal
        mr={data?.data}
        diff={data?.diff}
        pipelines={data?.pipelines}
        commits={data?.commits}
        onCloseMR={onCloseMR}
        onRefreshMR={refresh}
        onClose={() => {
          setIsFullscreen(false);
          onOpen?.();
        }}
      />
    );
  }

  if (isPopupOpen) {
    return (
      <FloatingFocusManager context={context} disabled={true} modal={false}>
        <div ref={popupRef} {...popupProps}>
          <MergeRequestCard
            mr={data?.data}
            reviewApp={data?.reivewApp}
            isLoading={!data}
            onRefreshMR={refresh}
            onMergeMR={onMerge}
            onCloseMR={onCloseMR}
            onClose={onPopupClose}
            onFullscreen={() => {
              setIsFullscreen(true);
            }}
          />
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
