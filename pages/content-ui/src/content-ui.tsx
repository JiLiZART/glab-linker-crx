import { FloatingFocusManager } from '@floating-ui/react';
import { useMergeRequest, usePopup, useDocumentEvent, usePrecacheAll, getMRUrl } from '@extension/shared';
import { MergeRequestCard, FullscreenModal } from '@extension/ui';

export default function ContentUI() {
  const { action, refresh, data, onMerge, onClose } = useMergeRequest();
  const {
    isOpen: isPopupOpen,
    onOpen,
    onClose: onPopupClose,
    context,
    popupRef,
    popupProps,
    referenceProps,
  } = usePopup();

  // usePrecacheAll()

  useDocumentEvent('mouseover', async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const el = target.closest('a');

    if (!el) {
      return;
    }

    const url = getMRUrl(el?.href);

    if (!url) {
      return;
    }

    onOpen?.();

    await action(url);
  });

  console.log('ContentUI.render', { popupProps, isPopupOpen, referenceProps });

  if (isPopupOpen) {
    return (
      <FloatingFocusManager context={context} modal={false}>
        <div ref={popupRef} {...popupProps}>
          <MergeRequestCard
            mr={data?.data}
            reviewApp={data?.reivewApp}
            isLoading={!data}
            onRefreshMR={refresh}
            onMergeMR={onMerge}
            onCloseMR={onClose}
            onClose={onPopupClose}>
            {onClose => (
              <FullscreenModal
                mr={data?.data}
                diff={data?.diff}
                pipelines={data?.pipelines}
                commits={data?.commits}
                onClose={onClose}
                onRefreshMR={refresh}
              />
            )}
          </MergeRequestCard>
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
