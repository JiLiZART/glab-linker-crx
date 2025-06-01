import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Badge } from '@/index';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import type { MergeRequestStatusType } from '../types';

interface MergeRequestStatusProps {
  status: MergeRequestStatusType;
  mergeBlockers?: string[];
}

export function MergeRequestStatus({ status, mergeBlockers = [] }: MergeRequestStatusProps) {
  let color = 'bg-gray-100 text-gray-800';
  let icon = null;
  let label = 'Unknown';

  switch (status) {
    case 'can_merge':
      color = 'bg-green-100 text-green-800';
      icon = <CheckCircle2 className="mr-1 size-3" />;
      label = 'Can be merged';
      break;
    case 'cannot_merge':
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="mr-1 size-3" />;
      label = 'Cannot be merged';
      break;
    case 'conflicts':
      color = 'bg-orange-100 text-orange-800';
      icon = <AlertCircle className="mr-1 size-3" />;
      label = 'Has conflicts';
      break;
    case 'draft':
      color = 'bg-blue-100 text-blue-800';
      label = 'Draft';
      break;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`${color} flex items-center`}>
            {icon}
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {mergeBlockers && mergeBlockers.length > 0 ? (
            <div>
              <p className="mb-1 font-semibold">Merge blockers:</p>
              <ul className="list-disc pl-4 text-sm">
                {mergeBlockers.map((blocker, index) => (
                  <li key={index}>{blocker}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No merge blockers</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
