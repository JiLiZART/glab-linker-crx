'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, Badge, Button, Skeleton } from '@/index';
import { ExternalLink, CheckCircle2, XCircle, Play, Clock, Pause } from 'lucide-react';
import type { PipelineModel } from '../../../adapters/mr-adapter';

interface PipelineListProps {
  pipelines?: Promise<PipelineModel | undefined> | undefined;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'success':
      return <CheckCircle2 className="size-4 text-green-500" />;
    case 'failed':
      return <XCircle className="size-4 text-red-500" />;
    case 'running':
      return <Play className="size-4 text-blue-500" />;
    case 'pending':
      return <Clock className="size-4 text-yellow-500" />;
    case 'canceled':
      return <Pause className="size-4 text-gray-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'canceled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function PipelineList({ pipelines }: PipelineListProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PipelineModel | undefined>();

  useEffect(() => {
    pipelines?.then(setData).finally(() => {
      setLoading(false);
    });
  }, [pipelines]);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pipelines</h3>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="mr-2 size-4 rounded-full" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="ml-2 h-5 w-20" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Skeleton className="mb-1 h-4 w-24" />
                    <div className="mt-1 flex items-center">
                      <Skeleton className="mr-1 size-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div>
                    <Skeleton className="mb-1 h-4 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div>
                    <Skeleton className="mb-1 h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <div className="mt-3 border-t pt-3">
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(j => (
                      <Skeleton key={j} className="h-6 w-full" />
                    ))}
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
      <h3 className="text-lg font-medium">Pipelines ({data?.length})</h3>

      <div className="space-y-2">
        {data.map(pipeline => (
          <Card key={pipeline.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(pipeline.status)}
                  <span className="ml-2 font-medium">Pipeline #{pipeline.id}</span>
                  <Badge variant="outline" className={`ml-2 ${getStatusColor(pipeline.status)}`}>
                    {pipeline.status}
                  </Badge>
                </div>

                <Button variant="outline" size="sm" onClick={() => window.open(pipeline.url, '_blank')}>
                  <ExternalLink className="mr-1 size-3" />
                  View Jobs
                </Button>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Triggered by</p>
                  <div className="mt-1 flex items-center">
                    <img
                      src={pipeline.triggeredBy.avatarUrl || '/placeholder.svg'}
                      alt={pipeline.triggeredBy.name}
                      className="mr-1 size-4 rounded-full"
                    />
                    <span>{pipeline.triggeredBy.name}</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500">Started</p>
                  <p>{new Date(pipeline.startedAt).toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-gray-500">Duration</p>
                  <p>{pipeline.duration}</p>
                </div>
              </div>

              <div className="mt-3 border-t pt-3">
                <div className="grid grid-cols-4 gap-2">
                  {pipeline.stages.map((stage, index) => (
                    <div key={index} className="text-center">
                      <Badge variant="outline" className={`w-full ${getStatusColor(stage.status)}`}>
                        {stage.name}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
