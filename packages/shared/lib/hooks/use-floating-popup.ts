import { CSSProperties, useState } from 'react';
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

type PopupProps = {
  position?: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'near-cursor';
};

const positionMap = {
  'left-top': {
    left: 24,
    top: 24,
    position: 'absolute',
  },
  'right-top': {
    right: 24,
    top: 24,
    position: 'absolute',
  },
  'left-bottom': {
    left: 24,
    bottom: 24,
    position: 'absolute',
  },
  'right-bottom': {
    right: 24,
    bottom: 24,
    position: 'absolute',
  },
} as Record<string, CSSProperties>;

export function useFloatingPopup(props: PopupProps) {
  const [isOpen, setOpen] = useState(false);
  const { position = 'near-cursor' } = props;

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, {});
  const dismiss = useDismiss(context);
  const role = useRole(context);
  // const clientPoint = useClientPoint(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss, hover, role]);

  console.log('usePopup', { floatingStyles }, getFloatingProps());

  const positionStyles = position == 'near-cursor' ? floatingStyles : positionMap[position];

  return {
    isOpen,
    onOpen: () => setOpen(true),
    onClose: async () => setOpen(false),
    context,
    popupRef: refs.setFloating,
    referenceProps: {
      ...getReferenceProps(),
    },
    referenceRef: refs.setReference,
    setPositionRef: refs.setPositionReference,
    popupProps: {
      style: { ...positionStyles, zIndex: 9999, outline: 'none' },
      ...getFloatingProps(),
    } as const,
  };
}
