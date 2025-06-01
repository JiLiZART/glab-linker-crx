import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Badge } from '@/index';
import { CheckCircle2, XCircle, Play, Pause, Clock } from 'lucide-react';
import type { PipelineStatusType } from '../types';

interface PipelineStatusProps {
  status: PipelineStatusType;
}

export function PipelineStatus({ status }: PipelineStatusProps) {
  let color = 'bg-gray-100 text-gray-800';
  let icon = null;
  let label = 'Unknown';

  switch (status) {
    case 'success':
      color = 'bg-green-100 text-green-800';
      icon = <CheckCircle2 className="mr-1 size-3" />;
      label = 'Pipeline passed';
      break;
    case 'failed':
      color = 'bg-red-100 text-red-800';
      icon = <XCircle className="mr-1 size-3" />;
      label = 'Pipeline failed';
      break;
    case 'running':
      color = 'bg-blue-100 text-blue-800';
      icon = <Play className="mr-1 size-3" />;
      label = 'Pipeline running';
      break;
    case 'pending':
      color = 'bg-yellow-100 text-yellow-800';
      icon = <Clock className="mr-1 size-3" />;
      label = 'Pipeline pending';
      break;
    case 'canceled':
      color = 'bg-gray-100 text-gray-800';
      icon = <Pause className="mr-1 size-3" />;
      label = 'Pipeline canceled';
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
          <p>Pipeline status: {status}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
