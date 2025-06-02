'use client';

import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage, Card, CardContent, Skeleton, TooltipWrapper } from '@/index';
import { GitCommit } from 'lucide-react';
import type { CommitModel } from '@extension/shared';

interface CommitListProps {
  commits?: () => Promise<CommitModel | undefined>;
}

export function CommitList({ commits }: CommitListProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CommitModel | undefined>();

  useEffect(() => {
    commits?.()
      ?.then(setData)
      .finally(() => {
        setLoading(false);
      });
  }, [commits]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Commits</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Skeleton className="size-5 rounded-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="ml-2 h-4 w-20" />
                    </div>
                    <div className="mt-1 flex items-center">
                      <Skeleton className="mr-1 size-4 rounded-full" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="ml-2 h-3 w-16" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Commits ({data?.length})</h3>

      <div className="space-y-2 flex flex-col gap-1">
        {data?.map(commit => (
          <a key={commit.id} href={commit.url} target="_blank" className="w-full" rel="noopener noreferrer">
            <Card className="overflow-hidden">
              <CardContent className="p-4 flex items-start">
                <div className="mr-3 mt-1">
                  <GitCommit className="size-5 text-gray-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <TooltipWrapper text={<div className="text-sm max-w-2xl font-medium">{commit.description}</div>}>
                      <h4 className="truncate text-sm font-medium">{commit.message}</h4>
                    </TooltipWrapper>

                    <span className="whitespace-nowrap text-xs text-gray-500 ml-2">
                      {new Date(commit.date).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center mt-1">
                    <Avatar className="border-background mr-1 size-4 rounded-full border-2">
                      <AvatarImage src={commit.author.avatarUrl} alt={commit.author.name} />
                      <AvatarFallback>{commit.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{commit.author.name}</span>
                    <span className="ml-2 font-mono text-xs text-gray-400">{commit.sha.substring(0, 8)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
