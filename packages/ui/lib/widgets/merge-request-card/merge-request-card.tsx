'use client';

import type { HTMLAttributes} from 'react';
import { useRef , forwardRef, useState } from 'react';
import {
  RefreshCcw,
  Maximize2,
  GitMerge,
  XCircle,
  X,
  CheckCircle,
  ExternalLink,
  CircleX,
  GitCommitIcon,
} from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  CardSpotlight,
  CardContent,
  CardFooter,
  CardHeader,
  Badge,
  TooltipWrapper,
} from '@/index';
import type { MergeRequestModel, ReviewAppModel } from '@extension/shared';

import {
  AvatarStack,
  BranchInfo,
  MarkdownRenderer,
  MergeRequestStatus,
  PipelineStatus,
  ReviewAppButton,
  SkeletonCard,
} from './ui';

interface MergeRequestCardProps {
  rootProps?: HTMLAttributes<HTMLDivElement>;
  item?: MergeRequestModel;
  reviewApp?: () => Promise<ReviewAppModel | undefined>;
  isLoading?: boolean;
  onFullscreen?: () => void;
  onMRRefresh?: (url: string) => Promise<void>;
  onMRApprove?: (url: string) => Promise<void>;
  onMRMerge?: (url: string) => Promise<void>;
  onMRClose?: (url: string) => Promise<void>;
  onClose?: () => void;
  settings?: {
    showAvatar?: boolean;
    showDescription?: boolean;
    showMerge?: boolean;
  };
}

function CloseButton(props: Pick<MergeRequestCardProps, 'item' | 'onClose'>) {
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

function AuthorAvatar(props: Pick<MergeRequestCardProps, 'item'>) {
  const { item } = props;

  if (!item?.author) {
    return null;
  }

  return (
    <Avatar className="border-background size-10 border-2">
      <AvatarImage src={item.author.avatarUrl} alt={item.author.name} />
      <AvatarFallback>{item.author.name[0]}</AvatarFallback>
    </Avatar>
  );
}

export const MergeRequestCard = forwardRef<HTMLDivElement, MergeRequestCardProps>(
  function MergeRequestCard(props, ref) {
    const {
      item,
      settings,
      rootProps,
      reviewApp,
      isLoading,
      onClose,
      onFullscreen,
      onMRRefresh,
      onMRApprove,
      onMRMerge,
      onMRClose,
    } = props;
    const { showAvatar = true, showMerge = true, showDescription = true } = settings || {};
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const [isAnimating, setIsAnimating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const canClose = false

    const handleRefresh = async () => {
      if (item?.url && onMRRefresh) {
        setIsRefreshing(true);
        await onMRRefresh?.(item.url);
        setIsRefreshing(false);
      }
    };

    const handleFullscreenClick = () => {
      // Get the current card position for animation
      const cardElement = cardRef?.current;

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

    if (isLoading || !item) {
      return <SkeletonCard ref={ref} {...rootProps} />;
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

    const mergeButton = onMRMerge && (
      <Button
        variant="default"
        size="sm"
        className="bg-green-600 hover:bg-green-700"
        onClick={() => onMRMerge?.(item.url!)}
        disabled={!item.canMerge}>
        <GitMerge className="mr-1 size-4" />
        Merge
      </Button>
    );

    const approveButton = onMRApprove && (
      <Button
        variant="default"
        size="sm"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={() => onMRApprove?.(item.url!)}>
        <CheckCircle className="mr-1 size-4" />
        Approve
      </Button>
    );

    const closeMrButton = onMRClose && (
      <Button
        variant="outline"
        size="sm"
        className="text-red-600 hover:text-red-700"
        onClick={() => onMRClose?.(item.url!)}>
        <XCircle className="mr-1 size-4" />
        Close
      </Button>
    );

    return (
      <>
        <CardSpotlight
          ref={cardRef}
          {...rootProps}
          id="mr-card"
          className="relative w-full min-w-[600px] max-w-2xl shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="absolute right-2 top-2 flex items-center gap-2">
            <ReviewAppButton reviewApp={reviewApp} />
            {refreshButton}
            {fullScreenButton}
            <CloseButton onClose={onClose} />
          </div>

          <CardHeader className="space-y-4">
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                {showAvatar && <AuthorAvatar item={item} />}
                <div className="flex flex-col items-start gap-1">
                  <h2 className="font-semibold leading-none">{item.title}</h2>
                  <div className="flex items-center gap-2">
                    <div className="text-muted-foreground text-sm">by {item.author.name}</div>
                    <a href={item.url} target="_blank" rel="noreferrer noopener">
                      <Badge variant="outline" className="ml-2">
                        !{item.id} <ExternalLink className="inline ml-2 size-3" />
                      </Badge>
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MergeRequestStatus status={item.mergeStatus} mergeBlockers={item.mergeBlockers} />
                <PipelineStatus status={item.pipelineStatus} />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {showDescription && item.description && (
              <div className="mb-4 max-h-32 overflow-y-auto rounded-md border bg-gray-50 p-3">
                <MarkdownRenderer content={item.description} />
              </div>
            )}

            <div className="flex flex-col gap-4">
              <BranchInfo sourceBranch={item.sourceBranch} targetBranch={item.targetBranch} />
              {/*<MergeRequestStats changesCount={mr.ca} hasConflicts={} createdAt={updatedAt} />*/}
            </div>

            <div className="flex flex-row gap-4 mt-2">
              {item.reviewers.length > 0 && (
                <div className="flex flex-row gap-2 mb-1 text-sm text-gray-500">
                  <AvatarStack users={item.reviewers} maxVisible={3} />
                  Reviewers ({item.reviewers.length})
                </div>
              )}
              {item.approvers.length > 0 && (
                <div className="flex flex-row gap-2 mb-1 text-sm text-gray-500">
                  <AvatarStack users={item.approvers} maxVisible={3} showTooltipNames={true} />
                  Approvals ({item.approvers.length}/{item.requiredApprovals})
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-2">
            <div className="flex space-x-2">
              {item.mergedAt && (
                <Button variant="default" size="sm" className="bg-blue-600" disabled>
                  <GitMerge className="mr-1 size-4" />
                  Merged
                </Button>
              )}
              {item.closedAt && (
                <Button variant="default" size="sm" className="bg-red-600" disabled>
                  <CircleX className="mr-1 size-4" />
                  Closed
                </Button>
              )}
              {showMerge && mergeButton}
              {approveButton}
              {canClose && closeMrButton}
            </div>

            <div className="flex flex-row items-center gap-4">
              <div className="text-xs text-gray-500">Updated {item.updatedAtLocale}</div>

              <div className="flex items-center gap-1.5">
                <GitCommitIcon className="size-3 color-gray-500" />
                <span className="text-xs text-gray-500">{item.changesCount} changes</span>
              </div>
            </div>
          </CardFooter>
        </CardSpotlight>

        {/* Animation overlay for transition */}
        {isAnimating && (
          <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300"
            style={{ opacity: isAnimating ? 1 : 0 }}>
            <div
              className="absolute w-full min-w-[600px] max-w-2xl rounded-md bg-white shadow-xl transition-all duration-300 ease-in-out"
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
  },
);
