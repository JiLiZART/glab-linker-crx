import { Server } from 'lucide-react';

export const MenuHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      <Server className="size-4 text-gray-500" />
      <h3 className="text-sm font-medium text-gray-600">{children}</h3>
    </div>
  );
};
