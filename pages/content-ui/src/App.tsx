import { useEffect, useRef, useState } from 'react';
import { useClientPoint, useInteractions, useFloating, offset, shift, flip, arrow } from '@floating-ui/react';
import { gitlabTokenStorage } from '@extension/storage';
import { GitLabService } from './services/gitlabService';
import { MergeRequestCard } from './components/merge-request/MergeRequestCard';
import type { MergeRequestInfo } from './types';
import { PopoverPortal, PopoverContent, Popover, PopoverAnchor } from '@extension/ui';
import * as PopoverPrimitive from '@radix-ui/react-popover';

async function gitlabFactory() {
  const token = await gitlabTokenStorage.get();
  return new GitLabService(token);
}

export default function App() {
  const gitlabRef = useRef<GitLabService | null>(null);
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [mrInfo, setMrInfo] = useState<MergeRequestInfo | null>(null);

  const arrowRef = useRef(null);

  const fetchMRInfo = async () => {
    // TODO: Implement actual API call
    setTimeout(() => {
      setMrInfo({
        title: 'Example MR Title',
        pipelineStatus: 'success',
        author: 'John Doe',
        updatedAt: '2024-01-20T10:00:00Z',
      });
      setLoading(false);
    }, 1000);
  };

  const { refs, floatingStyles, context, middlewareData, ...restProps } = useFloating({
    placement: 'bottom',
    middleware: [
      offset(8), // отступ от референса
      flip(), // переворачивает попап если не хватает места
      shift(), // сдвигает попап если не хватает места
      arrow({ element: arrowRef }), // позиционирует стрелку
    ],
  });

  const { arrow: { x: arrowX, y: arrowY } = {} } = middlewareData;

  const clientPoint = useClientPoint(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([clientPoint]);

  // console.log({ refs, floatingStyles, restProps, refProps: getReferenceProps(), floatingProps: getFloatingProps() });

  useEffect(() => {
    gitlabFactory().then(gitlab => {
      gitlabRef.current = gitlab;
    });
  }, []);

  useEffect(() => {
    const handleOpenPopover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      console.log({ link });

      if (link?.href && link.href.includes('gitlab.com') && link.href.includes('/merge_requests/')) {
        refs.setReference(link);
        // setMrUrl(link.href);
        setOpen(true);
      }
    };

    document.addEventListener('mouseover', handleOpenPopover);
    return () => document.removeEventListener('mouseover', handleOpenPopover);
  }, [refs]);

  const handleMerge = async () => {
    // TODO: Implement merge logic
    console.log('Merging:');
  };

  const handleClose = async () => {
    // TODO: Implement close logic
    console.log('Closing:');
  };

  // Popover.Content className="animate-fade-in rounded-lg bg-white p-4 shadow-lg"

  return (
    <div ref={refs.setFloating} style={floatingStyles}>
      <PopoverPrimitive.Root open={isOpen} onOpenChange={setOpen}>
        <PopoverPrimitive.Anchor />
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content className="animate-fade-in rounded-lg bg-white p-4 shadow-lg" sideOffset={5}>
            <MergeRequestCard
              title="feat: Add user authentication system"
              description="This merge request implements a comprehensive user authentication system using JWT tokens. It includes login, registration, and password reset functionality."
              author={{
                name: 'Sarah Chen',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
              }}
              sourceBranch="feature/auth-system"
              targetBranch="main"
              createdAt="2 hours ago"
              commentsCount={5}
              status={'open'}
              pipeline={{
                status: 'success',
              }}
              approvals={{
                approvers: [
                  {
                    name: 'John Doe',
                    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
                  },
                  {
                    name: 'Alice Smith',
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
                  },
                ],
                required: 2,
              }}
              canMerge={false}
              mergeBlockers={[
                'Pipeline is still running',
                'Requires 2 approvals (1 more needed)',
                'Branch is out of date',
              ]}
              onMerge={handleMerge}
              onClose={handleClose}
            />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}
