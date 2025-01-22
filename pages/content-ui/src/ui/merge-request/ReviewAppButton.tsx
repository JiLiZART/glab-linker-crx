import { TooltipProvider, Tooltip, TooltipTrigger, Button, TooltipContent } from '@extension/ui';
import { ExternalLinkIcon } from 'lucide-react';

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
            variant="outline"
            size="sm"
            tabindex={-1}
            className={`${STATES[state]} gap-1.5`}
            onClick={() => window.open(url, '_blank')}>
            <ExternalLinkIcon className="size-4" />
            Review App
          </Button>
        </TooltipTrigger>
        <TooltipContent>{slug}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
