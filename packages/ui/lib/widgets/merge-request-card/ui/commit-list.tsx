'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Skeleton } from '@/index';
import { GitCommit } from 'lucide-react';
import type { CommitModel } from '../../../adapters/mr-adapter';

interface CommitListProps {
  commits?: Promise<CommitModel | undefined> | undefined;
}

export function CommitList({ commits }: CommitListProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CommitModel | undefined>();

  useEffect(() => {
    commits?.then(setData).finally(() => {
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

      <div className="space-y-2">
        {data?.map(commit => (
          <Card key={commit.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  <GitCommit className="size-5 text-gray-500" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="truncate text-sm font-medium">{commit.message}</h4>
                    <span className="ml-2 whitespace-nowrap text-xs text-gray-500">
                      {new Date(commit.date).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center">
                    <img
                      src={commit.author.avatarUrl || '/placeholder.svg'}
                      alt={commit.author.name}
                      className="mr-1 size-4 rounded-full"
                    />
                    <span className="text-xs text-gray-600">{commit.author.name}</span>
                    <span className="ml-2 font-mono text-xs text-gray-400">{commit.sha.substring(0, 8)}</span>
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
