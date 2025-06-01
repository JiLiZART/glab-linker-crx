'use client';

import { useState } from 'react';
import { RefreshCcw, Maximize2, GitMerge, XCircle, X, CheckCircle } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Badge,
  TooltipWrapper,
} from '@/index';
import { SkeletonCard } from './ui/skeleton-card';
import { MergeRequestStatus } from './ui/merge-request-status';
import { PipelineStatus } from './ui/pipeline-status';
import { MarkdownRenderer } from './ui/markdown-renderer';
import { AvatarStack } from './ui/avatar-stack';
import { ReviewAppButton } from './ui/review-app-button';
import { BranchInfo } from './ui/branch-info';
import type { MergeRequestModel, ReviewAppModel } from '@extension/shared';

interface MergeRequestCardProps {
  mr?: MergeRequestModel;
  reviewApp?: () => Promise<ReviewAppModel | undefined>;
  isLoading?: boolean;
  onFullscreen?: () => void;
  onRefreshMR?: (url: string) => Promise<void>;
  onApproveMR?: (url: string) => Promise<void>;
  onMergeMR?: (url: string) => Promise<void>;
  onCloseMR?: (url: string) => Promise<void>;
  onClose?: () => void;
  showAvatar?: boolean;
}

function CloseButton(props: Pick<MergeRequestCardProps, 'mr' | 'onClose'>) {
  const { onClose } = props;

  if (!onClose) {
    return null;
  }

  return (
    <TooltipWrapper text={<p>Close</p>}>
      <Button
        variant="ghost"
        size="icon"
        onClick={e => {
          e.stopPropagation(); // Prevent event bubbling
          onClose();
        }}>
        <X className="size-4" />
      </Button>
    </TooltipWrapper>
  );
}

function AuthorAvatar(props: Pick<MergeRequestCardProps, 'mr'>) {
  const { mr } = props;

  if (!mr?.author) {
    return null;
  }

  return (
    <Avatar className="border-background size-10 border-2">
      <AvatarImage src={mr.author.avatarUrl} alt={mr.author.name} />
      <AvatarFallback>{mr.author.name[0]}</AvatarFallback>
    </Avatar>
  );
}

export function MergeRequestCard(props: MergeRequestCardProps) {
  const {
    showAvatar = true,
    mr,
    reviewApp,
    isLoading,
    onClose,
    onFullscreen,
    onRefreshMR,
    onApproveMR,
    onMergeMR,
    onCloseMR,
  } = props;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRefresh = async () => {
    if (mr?.url && onRefreshMR) {
      setIsRefreshing(true);
      await onRefreshMR?.(mr.url);
      setIsRefreshing(false);
    }
  };

  const handleFullscreenClick = () => {
    // Get the current card position for animation
    const cardElement = document.getElementById('mr-card');
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      setCardPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });

      // Start animation and then show fullscreen
      setIsAnimating(true);
      setTimeout(() => {
        onFullscreen?.();
        setIsAnimating(false);
      }, 300); // Match this with the CSS transition duration
    } else {
      // Fallback if element not found
      onFullscreen?.();
    }
  };

  console.log({ mr, isAnimating, isLoading });

  if (isLoading || !mr) {
    return <SkeletonCard />;
  }

  const fullScreenButton = (
    <TooltipWrapper text={<p>View in fullscreen</p>}>
      <Button variant="ghost" size="icon" onClick={handleFullscreenClick}>
        <Maximize2 className="size-4" />
      </Button>
    </TooltipWrapper>
  );

  const refreshButton = (
    <TooltipWrapper text={<p>Refresh merge request</p>}>
      <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
        <RefreshCcw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      </Button>
    </TooltipWrapper>
  );

  return (
    <>
      <Card id="mr-card" className="relative w-full max-w-2xl shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="absolute right-2 top-2 flex items-center gap-2">
          <ReviewAppButton reviewApp={reviewApp} />
          {refreshButton}
          {fullScreenButton}
          <CloseButton onClose={onClose} />
        </div>

        <CardHeader className="space-y-4">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                {showAvatar && <AuthorAvatar mr={mr} />}
                <h2 className="font-semibold leading-none">{mr.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-muted-foreground text-sm">by {mr.author.name}</div>
                <Badge variant="outline" className="ml-2">
                  !{mr.id}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MergeRequestStatus status={mr.status} mergeBlockers={mr.mergeBlockers} />
              <PipelineStatus status={mr.pipelineStatus} />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="mb-4 max-h-32 overflow-y-auto rounded-md border bg-gray-50 p-3">
            <MarkdownRenderer content={mr.description} />
          </div>

          <div className="flex flex-col gap-4">
            <BranchInfo sourceBranch={mr.sourceBranch} targetBranch={mr.targetBranch} />
            {/*<MergeRequestStats changesCount={mr.ca} hasConflicts={} createdAt={updatedAt} />*/}
          </div>

          <div className="flex flex-row gap-4">
            <div className="mb-1 text-sm text-gray-500">
              <AvatarStack users={mr.reviewers} maxVisible={3} />
              Reviewers ({mr.reviewers.length})
            </div>
            <div className="mb-1 text-sm text-gray-500">
              <AvatarStack users={mr.approvers} maxVisible={3} showTooltipNames={true} />
              Approvals ({mr.approvers.length}/{mr.requiredApprovals})
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-2">
          <div className="flex space-x-2">
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onMergeMR?.(mr.url!)}
              disabled={!mr.canMerge}>
              <GitMerge className="mr-1 size-4" />
              Merge
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => onApproveMR?.(mr.url!)}>
              <CheckCircle className="mr-1 size-4" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
              onClick={() => onCloseMR?.(mr.url!)}>
              <XCircle className="mr-1 size-4" />
              Close
            </Button>
          </div>

          <div className="text-xs text-gray-500">Updated {new Date(mr.updatedAt).toLocaleString()}</div>
        </CardFooter>
      </Card>

      {/* Animation overlay for transition */}
      {isAnimating && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
          style={{ opacity: isAnimating ? 1 : 0 }}>
          <div
            className="absolute w-full max-w-2xl rounded-md bg-white shadow-xl transition-all duration-300 ease-in-out"
            style={{
              top: cardPosition.top,
              left: cardPosition.left,
              width: cardPosition.width,
              height: cardPosition.height,
              transform: 'scale(1)',
              opacity: 1,
              animation: 'expand 300ms ease-in-out forwards',
            }}
          />
        </div>
      )}
    </>
  );
}
