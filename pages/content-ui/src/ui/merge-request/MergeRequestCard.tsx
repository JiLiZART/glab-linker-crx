import type { FC } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@extension/ui';
import { AlertCircleIcon, CheckIcon, XIcon } from 'lucide-react';
import { PipelineStatus } from './PipelineStatus';
import { Approvals } from './Approvals';
import { BranchInfo } from './BranchInfo';
import { MergeRequestStats } from './MergeRequestStats';
import { MergeRequestLabels } from './MergeRequestLabels';
import { ReviewAppButton } from './ReviewAppButton';

interface MergeRequestCardProps {
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  sourceBranch: string;
  targetBranch: string;
  updatedAt: string;
  changesCount: number;
  hasConflicts: boolean;
  status: 'opened' | 'merged' | 'closed' | string;
  isDraft?: boolean;
  isInProgress?: boolean;
  pipeline: {
    status: 'running' | 'success' | 'failed' | 'pending' | string;
  };
  approvals?: {
    approvers: Array<{ name: string; avatar: string }>;
    required: number;
  };
  canMerge: boolean;
  youCanMerge?: boolean;
  mergeBlockers?: string[];
  reviewApp?: {
    url?: string;
    slug?: string;
    state?: string;
  };
  onMerge?: () => Promise<void>;
  onClose?: () => Promise<void>;
}

export const MergeRequestCard: FC<MergeRequestCardProps> = ({
  title,
  description,
  author,
  sourceBranch,
  targetBranch,
  updatedAt,
  changesCount,
  hasConflicts,
  status,
  isDraft = false,
  isInProgress = false,
  pipeline,
  approvals,
  canMerge,
  youCanMerge,
  reviewApp = {},
  mergeBlockers = [],
  onMerge,
  onClose,
}) => {
  const renderMergeButton = () => {
    if (!canMerge) {
      const button = (
        <div>
          <Button className="flex-1" disabled>
            <AlertCircleIcon className="mr-2 size-4" />
            Cannot merge
          </Button>
        </div>
      );

      if (mergeBlockers?.length) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent>
                <ul className="list-disc pl-4">
                  {mergeBlockers.map((blocker, i) => (
                    <li key={i}>{blocker}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return button;
    }

    return (
      <Button className="flex-1" onClick={onMerge} variant="default">
        <CheckIcon className="mr-2 size-4" />
        Merge
      </Button>
    );
  };

  return (
    <Card className="w-full max-w-2xl transition-all hover:shadow-lg">
      <CardHeader className="space-y-4">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="border-background size-10 border-2">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="font-semibold leading-none">{title}</h3>
              <p className="text-muted-foreground text-sm">by {author.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reviewApp?.url && reviewApp?.slug && reviewApp?.state && status !== 'merged' && (
              <ReviewAppButton state={reviewApp?.state} url={reviewApp?.url} slug={reviewApp?.slug} />
            )}
            <PipelineStatus status={pipeline.status} />
            <MergeRequestLabels status={status} isDraft={isDraft} isInProgress={isInProgress} />
          </div>
        </div>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <BranchInfo sourceBranch={sourceBranch} targetBranch={targetBranch} />
          <MergeRequestStats changesCount={changesCount} hasConflicts={hasConflicts} createdAt={updatedAt} />
        </div>
        {approvals && <Approvals approvers={approvals?.approvers} requiredApprovals={approvals?.required} />}
      </CardContent>
      {status === 'opened' && youCanMerge && (
        <CardFooter className="gap-2">
          {renderMergeButton()}
          <Button onClick={onClose} variant="destructive" className="flex-1">
            <XIcon className="mr-2 size-4" />
            Close
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
