import { FloatingFocusManager } from '@floating-ui/react';
import { useMergeRequest, useFloatingPopup, useDocumentEvent, usePrecacheAll, useSettings } from '@extension/shared';
import { MergeRequestCard, FullscreenModal } from '@extension/ui';
import { useState } from 'react';

export default function ContentUI() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const settings = useSettings();
  const { fetch, refresh, data, onMerge, onClose: onCloseMR } = useMergeRequest();
  const {
    isOpen: isPopupOpen,
    onOpen,
    onClose: onPopupClose,
    context,
    popupRef,
    popupProps,
    setPositionRef,
  } = useFloatingPopup({
    position: settings.position,
  });

  usePrecacheAll();

  console.log('ContentUI.render');

  useDocumentEvent('mouseover', async e => {
    const target = e.target as HTMLElement;
    const el = target.closest('a');

    if (!el) {
      return;
    }

    if (!el?.href) {
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

    setIsFullscreen(false);
    onOpen?.();

    await fetch(el?.href);
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
        <MergeRequestCard
          rootRef={popupRef}
          rootProps={popupProps}
          showDescription={settings.showDescription}
          showAvatar={settings.showAvatar}
          showMerge={settings.showMerge}
          mr={data?.data}
          reviewApp={data?.reviewApp}
          isLoading={!data}
          onRefreshMR={refresh}
          onMergeMR={onMerge}
          onCloseMR={onCloseMR}
          onClose={onPopupClose}
          onFullscreen={() => {
            setIsFullscreen(true);
          }}
        />
      </FloatingFocusManager>
    );
  }

  return null;
}
