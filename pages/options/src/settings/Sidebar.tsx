import { Button } from '@extension/ui';
import { Plus, Server } from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="min-h-screen w-64 shrink-0 border-r bg-white">
      <div className="border-b p-4">
        <div className="mb-1 flex items-center gap-2 px-2">
          <img src="/icon.svg" className="size-10 text-gray-500" alt="Gitlab MR Linker Options" />

          <h2 className="text-sm font-semibold">Gitlab Linker</h2>
        </div>
      </div>
      <div className="p-3">
        <div className="mb-3">
          <div className="mb-2 flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Server className="size-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-600">GitLab Instances</h3>
            </div>
          </div>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="h-9 w-full justify-start rounded-lg text-sm font-normal hover:bg-gray-100">
              gitlab.com
            </Button>
            <Button
              variant="ghost"
              className="h-9 w-full justify-start rounded-lg text-sm font-normal hover:bg-gray-100">
              company.gitlab.com
            </Button>
          </div>
        </div>
        <Button variant="secondary" className="h-9 w-full justify-start text-sm">
          <Plus className="mr-2 size-4" />
          Add Instance
        </Button>
      </div>
    </div>
  );
};
