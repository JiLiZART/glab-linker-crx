import { Button } from '@extension/ui';
import { Plus } from 'lucide-react';
import type { SidebarProps } from '@src/settings/Sidebar';


export const AddMenuItem = (props: { children: React.ReactNode } & Pick<SidebarProps, 'onAddItem'>) => {
  const { children, onAddItem } = props;

  return (
    <Button onClick={onAddItem} variant="secondary" className="h-9 w-full justify-start text-sm">
      <Plus className="mr-2 size-4" />
      {children}
    </Button>
  );
};
