import { forwardRef } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '@extension/ui';
import type { MergeRequestInfo } from '@src/types';

interface MRPopoverProps {
  data: MergeRequestInfo;
  onMerge: () => void;
  onClose: () => void;
  onOpenChange: (open: boolean) => void;
  isOpen: boolean;
  isLoading: boolean;
  style?: React.CSSProperties;
  arrowStyle?: React.CSSProperties;
  arrowRef?: React.RefObject<HTMLDivElement>;
}

export const MRPopover = forwardRef<HTMLDivElement, MRPopoverProps>(
  ({ data, onMerge, onClose, isOpen, isLoading, onOpenChange, style, arrowStyle, arrowRef }, ref) => {
    const getPipelineStatusColor = (status: MergeRequestInfo['pipelineStatus']) => {
      switch (status) {
        case 'success':
          return 'text-green-600';
        case 'failed':
          return 'text-red-600';
        case 'running':
          return 'text-blue-600';
        case 'pending':
          return 'text-yellow-600';
        case 'canceled':
          return 'text-gray-600';
        default:
          return 'text-gray-400';
      }
    };

    const getPipelineStatusIcon = (status: MergeRequestInfo['pipelineStatus']) => {
      switch (status) {
        case 'success':
          return '✓';
        case 'failed':
          return '✗';
        case 'running':
          return '↻';
        case 'pending':
          return '⋯';
        case 'canceled':
          return '⊘';
        default:
          return '?';
      }
    };

    return (
      <div ref={ref} style={style}>
        <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
          <Popover.Anchor />
          <Popover.Portal>
            <Popover.Content className="animate-fade-in rounded-lg bg-white p-4 shadow-lg" sideOffset={5}>
              {isLoading ? (
                <div className="flex h-[100px] items-center justify-center">
                  <div className="size-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                </div>
              ) : (
                data && (
                  <>
                    <div className="mb-3">
                      <h3 className="mb-1 text-base font-medium text-gray-900">{data.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>by {data.author}</span>
                        <span>•</span>
                        <span>
                          Updated {new Date(data.updatedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-sm ${getPipelineStatusColor(
                          data.pipelineStatus,
                        )}`}>
                        {getPipelineStatusIcon(data.pipelineStatus)} Pipeline
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={onMerge}
                        className="flex items-center gap-1 rounded-md bg-green-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-600">
                        <span>✓</span> Merge
                      </Button>
                      <Button
                        onClick={onClose}
                        className="flex items-center gap-1 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-600">
                        <span>✗</span> Close
                      </Button>
                    </div>
                  </>
                )
              )}
              <div ref={arrowRef} style={arrowStyle} className="arrow fill-white" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    );
  },
);

MRPopover.displayName = 'MRPopover';
