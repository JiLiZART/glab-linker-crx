import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/index';
import { cva } from 'class-variance-authority';

export interface MergeRequestStatus {
  hasConflicts?: boolean;
  isClosed?: boolean;
  isOpen?: boolean;
  isMerged?: boolean;
  hasPassed?: boolean;
}

export interface MergeRequestLinkProps {
  url: string;
  title: string;
  status: MergeRequestStatus;
  className?: string;
  inline?: boolean;
}

// eslint-disable-next-line tailwindcss/no-custom-classname
const linkVariants = cva('text-foreground inline-flex items-center gap-1 text-sm font-medium hover:underline');

export function MergeRequestLink({ url, title, status, className = '', inline = false }: MergeRequestLinkProps) {
  const { hasConflicts, isClosed, isOpen, isMerged, hasPassed } = status;

  const statusIndicators = [
    {
      letter: 'C',
      active: hasConflicts,
      tooltip: 'Has conflicts',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
    {
      letter: 'X',
      active: isClosed,
      tooltip: 'Closed',
      className: 'bg-gray-100 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300',
    },
    {
      letter: 'O',
      active: isOpen,
      tooltip: 'Open',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    {
      letter: 'M',
      active: isMerged,
      tooltip: 'Merged',
      className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    },
    {
      letter: 'P',
      active: hasPassed,
      tooltip: 'Tests passed',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    },
  ];

  return (
    <TooltipProvider>
      <span
        className={`inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 dark:border-gray-700 dark:bg-gray-800 ${className}`}>
        <a href={url} target="_blank" rel="noopener noreferrer" className={linkVariants()}>
          <span>{title}</span>
          <ExternalLink className="inline size-3" />
        </a>
        <span className="ml-1 inline-flex gap-1">
          {statusIndicators
            .filter(indicator => indicator.active)
            .map((indicator, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <span
                    className={`inline-flex size-4 items-center justify-center rounded-full text-xs font-bold ${indicator.className}`}>
                    {indicator.letter}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{indicator.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
        </span>
      </span>
    </TooltipProvider>
  );
}
