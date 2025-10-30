import { Button } from '@extension/ui';
import { SettingsIcon } from 'lucide-react';
import type { SidebarProps } from '@src/settings/sidebar';
import type { ReactNode } from 'react';

type MenuItemProps = { id: string; active: boolean; children: ReactNode } & Pick<SidebarProps, 'onViewItem'>;

export const GlobalMenuItem = (props: MenuItemProps) => {
  const { children, onViewItem, id, active } = props;

  return (
    <Button
      onClick={() => onViewItem?.(id)}
      variant="ghost"
      className={`h-9 w-full justify-start text-sm ${active ? 'font-bold' : 'font-normal'}`}>
      <SettingsIcon className="mr-2 size-4" />
      {children}
    </Button>
  );
};
