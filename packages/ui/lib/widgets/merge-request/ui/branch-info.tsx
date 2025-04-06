import type { FC } from 'react';
import { GitBranchIcon, GitMergeIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/index';

interface BranchInfoProps {
  sourceBranch: string;
  targetBranch: string;
}

const truncateBranch = (branch: string) => {
  return branch.length > 25 ? `${branch.slice(0, 25)}...` : branch;
};

export const BranchInfo: FC<BranchInfoProps> = ({ sourceBranch, targetBranch }) => {
  return (
    <div className="flex items-center gap-1.5">
      <GitBranchIcon className="size-4" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="max-w-80 truncate font-mono text-sm">{truncateBranch(sourceBranch)}</span>
          </TooltipTrigger>
          <TooltipContent>{sourceBranch}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <GitMergeIcon className="size-4 rotate-90" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="max-w-80 truncate font-mono text-sm">{truncateBranch(targetBranch)}</span>
          </TooltipTrigger>
          <TooltipContent>{targetBranch}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
