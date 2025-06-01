'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Badge,
  Checkbox,
  Skeleton,
} from '@/index';
import {
  RefreshCcw,
  Minimize2,
  X,
  GitMerge,
  XCircle,
  GitCommit,
  GitPullRequest,
  PenLineIcon as PipelineLine,
  FileCode,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { MarkdownRenderer } from './markdown-renderer';
import { MergeRequestStatus } from './merge-request-status';
import { PipelineStatus } from './pipeline-status';
import { AvatarStack } from './avatar-stack';
import { CommitList } from './commit-list';
import { PipelineList } from './pipeline-list';
import { DiffTree } from './diff-tree';

import type { ChangeModel, CommitModel, MergeRequestModel, PipelineModel, ReviewAppModel } from '@extension/shared';
import { ReviewAppButton } from './review-app-button';

interface FullscreenModalProps {
  mr?: MergeRequestModel;
  diff?: Promise<ChangeModel | undefined> | undefined;
  commits?: Promise<CommitModel | undefined> | undefined;
  pipelines?: Promise<PipelineModel | undefined> | undefined;
  reviewApp?: Promise<ReviewAppModel | undefined> | undefined;
  onRefreshMR?: () => Promise<void>;
  onApproveMR?: () => Promise<void>;
  onMergeMR?: () => Promise<void>;
  onCloseMR?: () => Promise<void>;
  onClose?: () => void;
}

export function FullscreenModal(props: FullscreenModalProps) {
  const { mr, diff, commits, pipelines, reviewApp, onClose, onRefreshMR } = props;
  const [activeTab, setActiveTab] = useState('overview');
  const [squashCommits, setSquashCommits] = useState(true);
  const [deleteSourceBranch, setDeleteSourceBranch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    requestAnimationFrame(() => {
      setAnimateIn(true);
    });
  }, []);

  const handleMerge = () => {
    // In a real app, you would call an API to merge the MR
    alert(`Merge request would be merged here with options:
    - Squash commits: ${squashCommits}
    - Delete source branch: ${deleteSourceBranch}`);
  };

  const handleApprove = () => {
    // In a real app, you would call an API to approve the MR
    alert('Merge request would be approved here');
  };

  const handleClose = () => {
    // In a real app, you would call an API to close the MR
    alert('Merge request would be closed here');
  };

  const handleRefresh = () => {
    setIsLoading(true);
    onRefreshMR?.();
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleCloseWithAnimation = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match this with the CSS transition duration
  };

  const loadingState = (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
          <div>
            <Skeleton className="mb-2 h-6 w-40" />
            <Skeleton className="h-40 w-full rounded-md" />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Skeleton className="mb-2 h-6 w-24" />
            <Skeleton className="h-80 w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );

  if (!mr) {
    return loadingState;
  }

  return (
    <Dialog open={true} onOpenChange={handleCloseWithAnimation}>
      <DialogContent
        className={`h-[90vh] w-full max-w-5xl overflow-hidden p-0 transition-all duration-300 ${
          animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center">
              <h2 className="mr-2 text-xl font-semibold">{mr.title}</h2>
              <Badge variant="outline">!{mr.id}</Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCcw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(mr.url || `https://gitlab.com/merge_requests/${mr.id}`, '_blank')}
                title="Open in GitLab">
                <ExternalLink className="size-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleCloseWithAnimation}>
                <Minimize2 className="size-4" />
              </Button>

              <Button variant="ghost" size="icon" onClick={handleCloseWithAnimation}>
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            loadingState
          ) : (
            <Tabs
              defaultValue="overview"
              className="flex flex-1 flex-col overflow-hidden"
              value={activeTab}
              onValueChange={setActiveTab}>
              <div className="border-b">
                <TabsList className="h-12 px-4">
                  <TabsTrigger value="overview" className="flex items-center">
                    <GitPullRequest className="mr-2 size-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="commits" className="flex items-center">
                    <GitCommit className="mr-2 size-4" />
                    Commits
                  </TabsTrigger>
                  <TabsTrigger value="pipelines" className="flex items-center">
                    <PipelineLine className="mr-2 size-4" />
                    Pipelines
                  </TabsTrigger>
                  <TabsTrigger value="changes" className="flex items-center">
                    <FileCode className="mr-2 size-4" />
                    Changes
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-auto">
                <TabsContent value="overview" className="h-full p-6">
                  <div className="grid h-full grid-cols-3 gap-6">
                    <div className="col-span-2 space-y-6">
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Description</h3>
                        <div className="rounded-md border bg-gray-50 p-4">
                          <MarkdownRenderer content={mr.description} />
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-2 text-lg font-medium">Merge options</h3>
                        <div className="space-y-3 rounded-md border p-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="squash-commits"
                              checked={squashCommits}
                              onCheckedChange={checked => setSquashCommits(checked as boolean)}
                            />
                            <label
                              htmlFor="squash-commits"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Squash commits when merge request is accepted
                            </label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="delete-source-branch"
                              checked={deleteSourceBranch}
                              onCheckedChange={checked => setDeleteSourceBranch(checked as boolean)}
                            />
                            <label
                              htmlFor="delete-source-branch"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                              Delete source branch when merge request is accepted
                            </label>
                          </div>

                          <div className="flex space-x-2 pt-3">
                            <Button
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={handleMerge}
                              disabled={!mr.canMerge}>
                              <GitMerge className="mr-1 size-4" />
                              Merge
                            </Button>
                            <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={handleApprove}>
                              <CheckCircle className="mr-1 size-4" />
                              Approve
                            </Button>
                            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleClose}>
                              <XCircle className="mr-1 size-4" />
                              Close
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 text-lg font-medium">Details</h3>
                        <div className="space-y-4 rounded-md border p-4">
                          <div>
                            <p className="mb-1 text-sm text-gray-500">Status</p>
                            <div className="flex space-x-2">
                              <MergeRequestStatus status={mr.status} mergeBlockers={mr.mergeBlockers} />
                              <PipelineStatus status={mr.pipelineStatus} />
                            </div>
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">Author</p>
                            <div className="flex items-center">
                              <img
                                src={mr.author.avatarUrl || '/placeholder.svg'}
                                alt={mr.author.name}
                                className="mr-2 size-6 rounded-full"
                              />
                              <span className="text-sm font-medium">{mr.author.name}</span>
                            </div>
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">Reviewers ({mr.reviewers.length})</p>
                            <AvatarStack users={mr.reviewers} maxVisible={5} showTooltipNames={true} />
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">
                              Approvals ({mr.approvers.length}/{mr.requiredApprovals})
                            </p>
                            <AvatarStack users={mr.approvers} maxVisible={5} showTooltipNames={true} />
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">Created</p>
                            <p className="text-sm">{new Date(mr.createdAt).toLocaleString()}</p>
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">Updated</p>
                            <p className="text-sm">{new Date(mr.updatedAt).toLocaleString()}</p>
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">Source branch</p>
                            <p className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">{mr.sourceBranch}</p>
                          </div>

                          <div>
                            <p className="mb-1 text-sm text-gray-500">Target branch</p>
                            <p className="rounded bg-gray-100 px-2 py-1 font-mono text-sm">{mr.targetBranch}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <ReviewAppButton reviewApp={reviewApp} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="commits" className="p-6">
                  <CommitList commits={commits} />
                </TabsContent>

                <TabsContent value="pipelines" className="p-6">
                  <PipelineList pipelines={pipelines} />
                </TabsContent>

                <TabsContent value="changes" className="p-6">
                  <DiffTree changes={diff} />
                </TabsContent>
              </div>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
