import { FloatingFocusManager } from '@floating-ui/react';
import {
  useMergeRequest,
  useFloatingPopup,
  useDocumentEvent,
  usePrecacheLinks,
  useSettings,
  useInstances,
} from '@extension/shared';
import { MergeRequestCard, FullscreenModal } from '@extension/ui';
import { useState } from 'react';

function useMRCard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const settings = useSettings();
  const instances = useInstances();

  const { fetch, refresh, data, onMerge, onClose: onCloseMR, isValidUrl } = useMergeRequest();
  const {
    isOpen: isPopupOpen,
    onOpen,
    onClose: onPopupClose,
    context,
    popupRef,
    popupProps,
    setPoint,
  } = useFloatingPopup({
    position: settings.position,
  });

  usePrecacheLinks();

  console.log('ContentUI.render', { instances, settings });

  useDocumentEvent('mouseover', async e => {
    const target = e.target as HTMLElement;
    const el = target.closest('a');

    if (!el || !el?.href || !isValidUrl(el?.href)) {
      return;
    }

    const { clientX, clientY } = e;

    setPoint(clientX, clientY);
    setIsFullscreen(false);
    onOpen?.();

    await fetch(el?.href);
  });

  function onFullscreenClose() {
    setIsFullscreen(false);
    onOpen?.();
  }

  function onFullscreenOpen() {
    setIsFullscreen(true);
  }

  return {
    data: data?.data,
    diff: data?.diff,
    pipelines: data?.pipelines,
    commits: data?.commits,
    reviewApp: data?.reviewApp,
    onMrMerge: onMerge,
    onMrClose: onCloseMR,
    onMrRefresh: refresh,
    onFullscreenClose,
    onFullscreenOpen,
    onPopupClose,
    isFullscreen,
    context,
    isPopupOpen,
    popupProps,
    popupRef,
    settings,
  };
}

export default function ContentUI() {
  const {
    isFullscreen,
    isPopupOpen,
    popupProps,
    popupRef,
    settings,
    context,
    data,
    reviewApp,
    diff,
    pipelines,
    commits,
    onMrMerge,
    onMrRefresh,
    onMrClose,
    onFullscreenClose,
    onFullscreenOpen,
    onPopupClose,
  } = useMRCard();

  if (isFullscreen) {
    return (
      <FullscreenModal
        mr={data}
        diff={diff}
        pipelines={pipelines}
        commits={commits}
        onMRMerge={onMrMerge}
        onMRClose={onMrClose}
        onMRRefresh={onMrRefresh}
        onClose={onFullscreenClose}
      />
    );
  }

  if (isPopupOpen) {
    return (
      <FloatingFocusManager context={context} disabled={true} modal={false}>
        <div {...popupProps} ref={popupRef}>
          <MergeRequestCard
            settings={settings}
            item={data}
            reviewApp={reviewApp}
            isLoading={!data}
            onMRRefresh={onMrRefresh}
            onMRMerge={onMrMerge}
            onMRClose={onMrClose}
            onClose={onPopupClose}
            onFullscreen={onFullscreenOpen}
          />
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
