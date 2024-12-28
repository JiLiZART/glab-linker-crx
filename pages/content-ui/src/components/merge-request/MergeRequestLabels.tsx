import type { FC } from 'react';
import { Badge, cn } from '@extension/ui';

interface MergeRequestLabelsProps {
  status: 'open' | 'merged' | 'closed';
  isDraft: boolean;
}

export const MergeRequestLabels: FC<MergeRequestLabelsProps> = ({ status, isDraft }) => {
  const statusColors = {
    open: 'bg-blue-500/10 text-blue-500',
    merged: 'bg-green-500/10 text-green-500',
    closed: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="flex items-center gap-2">
      {isDraft && (
        <Badge variant="secondary" className="bg-gray-500/10 text-gray-500">
          Draft
        </Badge>
      )}
      <Badge variant="secondary" className={cn('capitalize', statusColors[status])}>
        {status}
      </Badge>
    </div>
  );
};
