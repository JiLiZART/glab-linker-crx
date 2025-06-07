import { MenuHeader } from './sidebar/menu-header';
import { MenuItem } from './sidebar/menu-item';
import { AddMenuItem } from './sidebar/menu-item-add';
import { SidebarHeader } from './sidebar/sidebar-header';
import { GlobalMenuItem } from '@src/settings/sidebar/menu-item-global';

const title = 'Gitlab Linker';

export type SidebarProps = {
  activeId?: string;
  onAddItem?: () => Promise<void>;
  onSettingsItem?: () => Promise<void>;
  onViewItem?: (id: string) => void;
  items: Array<{ name: string; id: string }>;
};

export const Sidebar = (props: SidebarProps) => {
  const { onAddItem, onViewItem, onSettingsItem, activeId, items = [] } = props;

  return (
    <div className="min-h-screen w-64 shrink-0 border-r bg-white">
      <div className="border-b p-4">
        <SidebarHeader title={title} />
      </div>
      <div className="flex flex-col gap-3 p-3">
        <GlobalMenuItem onSettingsItem={onSettingsItem}>Settings</GlobalMenuItem>
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
