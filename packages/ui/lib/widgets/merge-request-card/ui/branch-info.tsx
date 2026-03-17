import type { FC } from 'react';
import { GitBranchIcon, GitMergeIcon } from 'lucide-react';
import { Tooltip, TooltipButton, TooltipContent, TooltipProvider, TooltipTrigger } from '@/index';

interface BranchInfoProps {
  sourceBranch: string;
  targetBranch: string;
}

const truncateBranch = (branch: string) => {
  return branch.length > 25 ? `${branch.slice(0, 25)}...` : branch;
};

export const BranchInfo: FC<BranchInfoProps> = ({ sourceBranch, targetBranch }) => {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex items-center gap-1.5">
        <GitBranchIcon className="size-4" />
        <TooltipButton
          button={<span className="max-w-80 truncate font-mono text-sm">{truncateBranch(sourceBranch)}</span>}>
          {sourceBranch}
        </TooltipButton>
      </div>
      <div className="flex items-center gap-1.5">
        <GitMergeIcon className="size-4 rotate-90" />
        <TooltipButton
          button={<span className="max-w-80 truncate font-mono text-sm">{truncateBranch(targetBranch)}</span>}>
          {targetBranch}
        </TooltipButton>
      </div>
    </div>
  );
};
