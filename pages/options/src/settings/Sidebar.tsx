import { Button } from '@extension/ui';
import { Plus, Server } from 'lucide-react';

const title = 'Gitlab Linker';

const SidebarHeader = () => {
  return (
    <div className="mb-1 flex items-center gap-2 px-2">
      <img src="/icon.svg" className="size-10 text-gray-500" alt="Gitlab MR Linker Options" />

      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
};

const MenuItem = (
  props: { children: React.ReactNode; id: string; active: boolean } & Pick<SidebarProps, 'onViewItem'>,
) => {
  const { children, id, active, onViewItem } = props;

  const onClick = () => {
    onViewItem(id);
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

const AddMenuItem = (props: { children: React.ReactNode } & Pick<SidebarProps, 'onAddItem'>) => {
  const { children, onAddItem } = props;

  return (
    <Button onClick={onAddItem} variant="secondary" className="h-9 w-full justify-start text-sm">
      <Plus className="mr-2 size-4" />
      {children}
    </Button>
  );
};

const MenuHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      <Server className="size-4 text-gray-500" />
      <h3 className="text-sm font-medium text-gray-600">{children}</h3>
    </div>
  );
};

export type SidebarProps = {
  activeId?: string;
  onAddItem?: () => Promise<void>;
  onViewItem?: (id: string) => void;
  items: Array<{ name: string; id: string }>;
};

export const Sidebar = (props: SidebarProps) => {
  const { onAddItem, onViewItem, activeId, items = [] } = props;

  return (
    <div className="min-h-screen w-64 shrink-0 border-r bg-white">
      <div className="border-b p-4">
        <SidebarHeader />
      </div>
      <div className="flex flex-col gap-3 p-3">
        <MenuHeader>GitLab Instances</MenuHeader>
        <div className="space-y-1">
          {items.map(item => (
            <MenuItem key={item.id} id={item.id} active={item.id === activeId} onViewItem={onViewItem}>
              {item.name}
            </MenuItem>
          ))}
        </div>
        <AddMenuItem onAddItem={onAddItem}>Add Instance</AddMenuItem>
      </div>
    </div>
  );
};
