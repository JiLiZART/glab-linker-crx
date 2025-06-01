import { useState } from 'react';
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

export function usePopup() {
  const [isOpen, setOpen] = useState(false);

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
      style: { ...floatingStyles, zIndex: 9999, outline: 'none' },
      ...getFloatingProps(),
    } as const,
  };
}
