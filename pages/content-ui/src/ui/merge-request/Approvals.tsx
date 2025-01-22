import type { FC } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@extension/ui';

interface Approver {
  name: string;
  avatar: string;
}

interface ApprovalsProps {
  approvers: Approver[];
  requiredApprovals: number;
}

export const Approvals: FC<ApprovalsProps> = ({ approvers, requiredApprovals }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        <TooltipProvider>
          {approvers.map(approver => (
            <Tooltip key={approver.name}>
              <TooltipTrigger asChild>
                <Avatar className="size-6">
                  <AvatarImage src={approver.avatar} alt={approver.name} />
                  <AvatarFallback>{approver.name[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Approved by {approver.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <span className="text-muted-foreground text-sm">
        {approvers.length}/{requiredApprovals} approvals
      </span>
    </div>
  );
};
