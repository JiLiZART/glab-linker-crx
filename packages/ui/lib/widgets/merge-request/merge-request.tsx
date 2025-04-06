import type { FC, ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  TooltipButton,
} from '../../../index';
import { AlertCircleIcon, CheckIcon, XIcon, RefreshCwIcon, ExternalLinkIcon } from 'lucide-react';
import { PipelineStatus } from './ui/pipeline-status';
import { Approvals } from './ui/approvers';
import { Reviewers } from './ui/reviewers';
import { BranchInfo } from './ui/branch-info';
import { MergeRequestStats } from './ui/merge-request-stats';
import { MergeRequestLabels } from './ui/merge-request-labels';
import { ReviewAppButton } from './ui/review-app-button';
import { Description } from './ui/description';
import { RefreshButton } from './ui/refresh-button';
import { DiscussionsBadge } from './ui/discussions-badge';

interface MergeRequestCardProps {
  url: string;
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
  userCanMerge?: boolean;
  mergeStatus?: string;
  discussionsResolved?: boolean;
  mergeBlockers?: string[];
  reviewApp?: {
    url?: string;
    slug?: string;
    state?: 'available' | 'stopped' | string;
  };
  onMerge?: () => Promise<void>;
  onClose?: () => Promise<void>;
  onRefresh?: () => Promise<void>;
  onCloseModal?: () => Promise<void>;
  showAvatar?: boolean;
  showMerge?: boolean;
  showDescription?: boolean;
}

export const MergeRequestCard: FC<MergeRequestCardProps> = ({
  title,
  description,
  url,
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
  userCanMerge,
  reviewApp = {},
  mergeStatus,
  mergeBlockers = [],
  discussionsResolved,
  onMerge,
  onClose,
  onCloseModal,
  onRefresh,
  showAvatar = true,
  showMerge = true,
  showDescription = true,
}) => {
  const realHasConflicts = mergeStatus === 'conflict' || hasConflicts;

  const renderMergeButton = () => {
    if (status !== 'opened' || !userCanMerge) {
      return null;
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
          <TooltipButton button={button}>
            <ul className="list-disc pl-4">
              {mergeBlockers.map((blocker, i) => (
                <li key={i}>{blocker}</li>
              ))}
            </ul>
          </TooltipButton>
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
    if (status !== 'closed' && userCanMerge) {
      return (
        <Button onClick={onClose} variant="destructive">
          <XIcon className="mr-2 size-4" />
          Close
        </Button>
      );
    }

    return null;
  };

  const externalButton = (
    <Button variant="ghost" className="ml-auto" asChild>
      <a tabIndex={-1} href={url} target="_blank" rel="noopener noreferrer">
        <ExternalLinkIcon />
      </a>
    </Button>
  );

  return (
    <Card className="relative w-full max-w-2xl transition-all hover:shadow-lg">
      <div className="absolute right-2 top-2 flex items-center gap-2">
        {reviewApp?.url && reviewApp?.slug && reviewApp?.state && status !== 'merged' && (
          <ReviewAppButton state={reviewApp?.state} url={reviewApp?.url} slug={reviewApp?.slug} />
        )}
        <TooltipButton button={externalButton}>open in new tab</TooltipButton>
        <RefreshButton onRefresh={onRefresh} />
        <Button variant="ghost" className="ml-auto" onClick={onCloseModal}>
          <XIcon />
        </Button>
      </div>

      <CardHeader className="space-y-4">
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2">
            {showAvatar && (
              <Avatar className="border-background size-10 border-2">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div className="space-y-1">
              <h3 className="font-semibold leading-none">{title}</h3>
              <p className="text-muted-foreground text-sm">by {author.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {pipeline && <PipelineStatus status={pipeline.status} />}
            <MergeRequestLabels status={status} isDraft={isDraft} isInProgress={isInProgress} />
            <DiscussionsBadge resolved={!!discussionsResolved} />
          </div>
        </div>
        {showDescription && <Description text={description} />}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <BranchInfo sourceBranch={sourceBranch} targetBranch={targetBranch} />
          <MergeRequestStats changesCount={changesCount} hasConflicts={realHasConflicts} createdAt={updatedAt} />
        </div>
        <div className="flex flex-row gap-4">
          {approvals && <Approvals approvers={approvals?.approvers} requiredApprovals={approvals?.required} />}
          {reviewers && <Reviewers reviewers={reviewers} />}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <section className="flex flex-row gap-4">
          {showMerge && renderMergeButton()}
          {showMerge && renderCloseButton()}
        </section>
      </CardFooter>
    </Card>
  );
};
