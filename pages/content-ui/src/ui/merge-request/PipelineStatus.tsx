import type { FC } from 'react';
import { Badge } from '@extension/ui';
import { PlayCircle, CheckCircle2, XCircle } from 'lucide-react';

type PipelineStatus = 'running' | 'success' | 'failed' | 'pending' | string;

interface PipelineStatusProps {
  status: PipelineStatus | string;
}

const statusConfig = {
  running: {
    icon: PlayCircle,
    className: 'bg-blue-500/10 text-blue-500',
    label: 'Pipeline running',
  },
  success: {
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-500',
    label: 'Pipeline passed',
  },
  failed: {
    icon: XCircle,
    className: 'bg-red-500/10 text-red-500',
    label: 'Pipeline failed',
  },
  pending: {
    icon: PlayCircle,
    className: 'bg-yellow-500/10 text-yellow-500',
    label: 'Pipeline pending',
  },
} as Record<PipelineStatus, { icon: FC; className: string; label: string }>;

export const PipelineStatus: FC<PipelineStatusProps> = ({ status }) => {
  const { icon: Icon, className, label } = statusConfig[status as string];

  return (
    <Badge variant="secondary" className={`${className} whitespace-nowrap`}>
      <Icon className="mr-1 size-3" />
      {label}
    </Badge>
  );
};
