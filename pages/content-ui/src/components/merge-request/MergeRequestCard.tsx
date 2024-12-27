import { forwardRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Separator,
  cn,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@extension/ui';
import {
  GitMergeIcon,
  GitBranchIcon,
  MessageCircleIcon,
  ClockIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { PipelineStatus } from './PipelineStatus';
import { Approvals } from './Approvals';

interface MergeRequestCardProps {
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  sourceBranch: string;
  targetBranch: string;
  createdAt: string;
  commentsCount: number;
  status: 'open' | 'merged' | 'closed' | string;
  pipeline: {
    status: 'running' | 'success' | 'failed' | 'pending';
  };
  approvals: {
    approvers: Array<{ name: string; avatar: string }>;
    required: number;
  };
  canMerge: boolean;
  mergeBlockers?: string[];
  onMerge?: () => void;
  onClose?: () => void;
}

export const MergeRequestCard = forwardRef<HTMLDivElement, MergeRequestCardProps>(
  (props: MergeRequestCardProps, ref) => {
    const {
      title,
      description,
      author,
      sourceBranch,
      targetBranch,
      createdAt,
      commentsCount,
      status,
      pipeline,
      approvals,
      canMerge,
      mergeBlockers = [],
      onMerge,
      onClose,
    } = props;
    const statusColors = {
      open: 'bg-blue-500/10 text-blue-500',
      merged: 'bg-green-500/10 text-green-500',
      closed: 'bg-red-500/10 text-red-500',
    } as Record<string, string>;

    const renderMergeButton = () => {
      if (!canMerge) {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button className="flex-1" disabled>
                    <AlertCircleIcon className="mr-2 size-4" />
                    Cannot merge
                  </Button>
                </div>
              </TooltipTrigger>
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
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-10">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="font-semibold leading-none">{title}</h3>
                <p className="text-muted-foreground text-left text-sm">by {author.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PipelineStatus status={pipeline.status} />
              <Badge variant="secondary" className={cn('capitalize', statusColors[status])}>
                {status}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground text-left text-sm">{description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <GitBranchIcon className="size-4" />
              <span className="font-mono">{sourceBranch}</span>
              <GitMergeIcon className="size-4 rotate-90" />
              <span className="font-mono">{targetBranch}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <ClockIcon className="size-4" />
              <span>{createdAt}</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <MessageCircleIcon className="size-4" />
              <span>{commentsCount} comments</span>
            </div>
          </div>
          <Approvals approvers={approvals.approvers} requiredApprovals={approvals.required} />
        </CardContent>
        {status === 'open' && (
          <CardFooter className="content-end gap-2">
            {renderMergeButton()}
            <Button onClick={onClose} variant="destructive">
              <XIcon className="mr-2 size-4" />
              Close
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  },
);

MergeRequestCard.displayName = 'MergeRequestCard';
