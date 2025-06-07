import { Button } from '@extension/ui';
import type { SidebarProps } from '@src/settings/Sidebar';

export const MenuItem = (
  props: { children: React.ReactNode; id: string; active: boolean } & Pick<SidebarProps, 'onViewItem'>,
) => {
  const { children, id, active, onViewItem } = props;

  const onClick = () => {
    onViewItem?.(id);
  };

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={`h-9 w-full justify-start rounded-lg text-sm ${active ? 'font-bold' : 'font-normal'} hover:bg-gray-100`}>
      {children}
    </Button>
  );
};
