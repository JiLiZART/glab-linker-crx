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
} from '../../../index';
import { AlertCircleIcon, CheckIcon, XIcon, RefreshCwIcon } from 'lucide-react';
import { PipelineStatus } from './ui/PipelineStatus';
import { Approvals } from './ui/Approvals';
import { Reviewers } from './ui/Reviewers';
import { BranchInfo } from './ui/BranchInfo';
import { MergeRequestStats } from './ui/MergeRequestStats';
import { MergeRequestLabels } from './ui/MergeRequestLabels';
import { ReviewAppButton } from './ui/ReviewAppButton';

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
  pipeline?: {
    status: 'running' | 'success' | 'failed' | 'pending' | string;
  };
  approvals?: {
    approvers: Array<{ name: string; avatar: string }>;
    required: number;
  };
  reviewers?: Array<{ name: string; avatar: string }>;
  canMerge: boolean;
  youCanMerge?: boolean;
  mergeBlockers?: string[];
  reviewApp?: {
    url?: string;
    slug?: string;
    state?: 'available' | 'stopped' | string;
  };
  onMerge?: () => Promise<unknown>;
  onClose?: () => Promise<unknown>;
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
  reviewers,
  canMerge,
  youCanMerge,
  reviewApp = {},
  mergeBlockers = [],
  onMerge,
  onClose,
}) => {
  const renderMergeButton = () => {
    if (status !== 'opened') {
      return null
    }

    if (!canMerge) {
      const button = (
        <div>
          <Button disabled>
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
      <Button onClick={onMerge} variant="default">
        <CheckIcon className="mr-2 size-4" />
        Merge
      </Button>
    );
  };

  const renderCloseButton = () => {
    if (status !== 'closed' && youCanMerge) {
      return (
        <Button onClick={onClose} variant="destructive">
          <XIcon className="mr-2 size-4" />
          Close
        </Button>
      )
    }

    return null
  }

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
            {pipeline && <PipelineStatus status={pipeline.status} />}
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
        <div className="flex flex-row gap-4">
          {approvals && <Approvals approvers={approvals?.approvers} requiredApprovals={approvals?.required} />}
          {reviewers && <Reviewers reviewers={reviewers} />}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <section className="flex flex-row gap-4 w-full">
          {renderMergeButton()}
          {renderCloseButton()}
          {reviewApp?.url && reviewApp?.slug && reviewApp?.state && status !== 'merged' && (
            <ReviewAppButton state={reviewApp?.state} url={reviewApp?.url} slug={reviewApp?.slug} />
          )}
          <Button variant="ghost" className='ml-auto'>
            <RefreshCwIcon />
          </Button>
        </section>
      </CardFooter>
    </Card>
  );
};
