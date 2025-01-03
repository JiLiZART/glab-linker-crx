import { useEffect, useRef, useState } from 'react';
import { formatRelative } from 'date-fns';
import {
  useInteractions,
  useFloating,
  offset,
  shift,
  flip,
  autoUpdate,
  useClick,
  useDismiss,
  useRole,
  FloatingFocusManager,
} from '@floating-ui/react';
import { gitlabTokenStorage } from '@extension/storage';
import { GitLabService } from './services/gitlabService';
import { MergeRequestCard } from './components/merge-request/MergeRequestCard';
import type { MergeRequestData } from './types';

const GITLAB_HOST = 'gitlab.com';

async function gitlabFactory() {
  const token = await gitlabTokenStorage.get();
  return new GitLabService(token);
}

function useGitlab() {
  const gitlabRef = useRef<GitLabService | null>(null);

  useEffect(() => {
    gitlabFactory().then(gitlab => {
      gitlabRef.current = gitlab;
    });
  }, []);

  return gitlabRef.current;
}

function transformMRData(data: MergeRequestData) {
  if (!data) {
    console.log('transformMRData', data);
    return null;
  }

  return {
    projectId: data.project_id,
    iid: data.iid,
    title: data.title || '',
    description: data.description,
    author: {
      name: data.author.name,
      avatar: data.author.avatar_url,
    },
    pipeline: {
      status: data.pipeline.status,
    },
    status: data.state,
    sourceBranch: data.source_branch,
    targetBranch: data.target_branch,
    updatedAt: formatRelative(data.updated_at, new Date()),
    changesCount: data.changes_count,
    isDraft: data.draft,
    isInProgress: data.work_in_progress,
    hasConflicts: data.has_conflicts,
    canMerge: data.user.can_merge && data.merge_status === 'can_be_merged',
    // approvals: {
    //   approvers: [
    //     {
    //       name: 'John Doe',
    //       avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400',
    //     },
    //     {
    //       name: 'Alice Smith',
    //       avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    //     },
    //   ],
    //   required: 2,
    // },
    // mergeBlockers: ['Pipeline is still running', 'Requires 2 approvals (1 more needed)', 'Branch is out of date'],
  };
}

type MRInfo = ReturnType<typeof transformMRData>;

export default function App() {
  const gitlab = useGitlab();
  const [isOpen, setOpen] = useState(false);
  const [mrInfo, setMrInfo] = useState<MRInfo | null>(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    middleware: [offset(10), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  useEffect(() => {
    const handleOpenPopover = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      setMrInfo(null);

      if (link?.href && link.href.includes(GITLAB_HOST) && link.href.includes('/merge_requests/')) {
        refs.setReference(link);
        link.style.cursor = 'wait';

        Object.entries(getReferenceProps()).forEach(([key, value]) => {
          if (key.startsWith('aria-')) {
            link.setAttribute(key, value as string);
          }
        });

        if (gitlab) {
          const mrData = await gitlab.getMRByUrl(link.href);
          link.style.cursor = '';
          const data = transformMRData(mrData);

          setMrInfo(data);
          setOpen(true);
        }
      }
    };

    document.addEventListener('mouseover', handleOpenPopover);
    return () => document.removeEventListener('mouseover', handleOpenPopover);
  }, [refs, getReferenceProps, gitlab]);

  const handleMerge = async () => {
    if (mrInfo && gitlab) {
      await gitlab.mergeMR(mrInfo.projectId, mrInfo.iid);
    }
  };

  const handleClose = async () => {
    if (mrInfo && gitlab) {
      await gitlab?.closeMR(mrInfo.projectId, mrInfo.iid);
    }
  };

  if (isOpen && mrInfo) {
    console.log({ mrInfo });
    return (
      <FloatingFocusManager context={context} modal={false}>
        <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
          <MergeRequestCard {...mrInfo} onMerge={handleMerge} onClose={handleClose} />
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
