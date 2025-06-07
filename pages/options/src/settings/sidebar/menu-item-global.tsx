import { Button } from '@extension/ui';
import { SettingsIcon } from 'lucide-react';
import type { SidebarProps } from '@src/settings/Sidebar';


export const GlobalMenuItem = (props: { children: React.ReactNode } & Pick<SidebarProps, 'onSettingsItem'>) => {
  const { children, onSettingsItem } = props;

  return (
    <Button onClick={onSettingsItem} variant="secondary" className="h-9 w-full justify-start text-sm">
      <SettingsIcon className="mr-2 size-4" />
      {children}
    </Button>
  );
};
