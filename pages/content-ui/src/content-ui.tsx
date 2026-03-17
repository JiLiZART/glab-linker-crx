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
import { useCallback, useEffect, useRef, useState } from 'react';

function useMRCard() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const clientPos = useRef({ x: 0, y: 0 });
  const settings = useSettings();
  const instances = useInstances();
  const { position } = settings;

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
    position,
  });

  usePrecacheLinks();

  console.log('ContentUI.render', { position, instances, settings });

  const showCard = useCallback(
    async function showCard(url: string, x: number, y: number) {
      if (x && y) {
        setPoint(x, y);
      }

      setIsFullscreen(false);
      onOpen?.();

      await fetch(url);
    },
    [setPoint, setIsFullscreen, onOpen, fetch],
  );

  async function onMouseMove(e: MouseEvent) {
    const target = e.target as HTMLElement;

    const { clientX, clientY } = e;

    clientPos.current = { x: clientX, y: clientY };

    if (!target) {
      return;
    }

    const el = target.closest('a');

    if (!el || !el?.href || !isValidUrl(el?.href)) {
      return;
    }

    await showCard(el?.href, clientX, clientY);
  }

  useDocumentEvent('mousemove', async e => {
    await onMouseMove(e);
  });

  const onMessage = useCallback(
    async function onMessage(message: { type?: string; url?: string }) {
      if (message?.type === 'glab-linker-open-merge-request' && message.url) {
        console.log('glab-linker-open-merge-request', message.url);

        await showCard(message.url, clientPos.current.x, clientPos.current.y);
      }
    },
    [showCard],
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
    };
  }, [onMessage]);

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
    onMrMerge: data?.data.canMerge ? onMerge : undefined,
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
        onExitFullscreen={onFullscreenClose}
        onClose={onPopupClose}
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
