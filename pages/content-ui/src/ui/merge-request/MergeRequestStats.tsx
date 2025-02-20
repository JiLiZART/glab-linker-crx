import type { FC } from 'react';
import { GitCommitIcon, AlertTriangleIcon } from 'lucide-react';
import { Badge, Separator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@extension/ui';

interface MergeRequestStatsProps {
  changesCount: number;
  hasConflicts: boolean;
  createdAt: string;
}

export const MergeRequestStats: FC<MergeRequestStatsProps> = ({ changesCount, hasConflicts, createdAt }) => {
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <GitCommitIcon className="size-4" />
        <span>{changesCount} changes</span>
      </div>
      <Separator orientation="vertical" className="h-4" />
      <span className="text-muted-foreground">{createdAt}</span>
      {hasConflicts && (
        <>
          <Separator orientation="vertical" className="h-4" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">
                  <AlertTriangleIcon className="mr-1 size-3" />
                  Conflicts
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>This merge request has conflicts that must be resolved</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </>
      )}
    </div>
  );
};
