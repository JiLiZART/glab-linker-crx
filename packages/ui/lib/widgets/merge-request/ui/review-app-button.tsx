import { TooltipProvider, Tooltip, TooltipTrigger, Button, TooltipContent } from '../../../../index';
import { MonitorUp } from 'lucide-react';

const STATES = {
  available: 'bg-green-500/10 text-green-500',
  stopped: 'bg-red-500/10 text-red-500',
} as Record<string, string>;

export function ReviewAppButton({ url, slug, state }: { url: string; slug: string; state: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`${STATES[state]} ml-auto gap-1.5`}
            onClick={() => window.open(url, '_blank')}>
            <MonitorUp className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{slug}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
