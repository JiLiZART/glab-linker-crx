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
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';
import { GitLabService } from '@extension/shared';

import { MergeRequestCard } from './ui/merge-request';
import type { MergeRequestData, Environment } from './types';

async function gitlabFactory() {
  const token = await gitlabTokenStorage.get();
  const apiUrl = await gitlabApiUrlStorage.get();

  return new GitLabService(token, apiUrl);
}

function useGitlab() {
  const gitlabRef = useRef<GitLabService | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    gitlabFactory()
      .then(gitlab => {
        gitlabRef.current = gitlab;
        setLoaded(true);
      })
      .catch(err => {
        console.log({ err });
      });
  }, []);

  return loaded ? gitlabRef.current : null;
}

function transformMRData(data: MergeRequestData, envData?: Environment) {
  if (!data) {
    console.log('transformMRData', data);
    return null;
  }

  const reviewApp = {
    url: envData?.external_url,
    slug: envData?.slug,
    state: envData?.state,
  };

  const mergeBlockers = [];

  if (data?.merge_error) {
    mergeBlockers.push(data.merge_error);
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
    reviewApp: envData ? reviewApp : undefined,
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

    mergeBlockers,
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
      const hostname = gitlab?.getApiHostname();

      if (!gitlab) {
        return;
      }

      if (!hostname) {
        return;
      }

      if (!link?.href) {
        return;
      }

      if (!link.href.includes(hostname)) {
        return;
      }

      if (!link.href.includes('/merge_requests/')) {
        return;
      }

      if (globalThis.location.hostname == hostname) {
        return;
      }

      setMrInfo(null);

      refs.setReference(link);
      link.style.cursor = 'wait';
      link.title = '';

      Object.entries(getReferenceProps()).forEach(([key, value]) => {
        if (key.startsWith('aria-')) {
          link.setAttribute(key, value as string);
        }
      });

      const mrData = await gitlab.getMRByUrl(link.href).catch(err => {
        console.log('gitlab.getMRByUrl', err);
      });
      const reviewApp = await gitlab.getMRReviewApp(mrData?.pipeline?.project_id, mrData?.pipeline?.ref).catch(err => {
        console.log('gitlab.getMRReviewApp', err);
      });

      link.style.cursor = '';

      const data = transformMRData(mrData, reviewApp);

      setMrInfo(data);
      setOpen(true);
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
      await gitlab.closeMR(mrInfo.projectId, mrInfo.iid);
    }
  };

  if (isOpen && mrInfo) {
    return (
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={refs.setFloating}
          style={{ ...floatingStyles, zIndex: 9999, outline: 'none' }}
          {...getFloatingProps()}>
          <MergeRequestCard {...mrInfo} onMerge={handleMerge} onClose={handleClose} />
        </div>
      </FloatingFocusManager>
    );
  }

  return null;
}
