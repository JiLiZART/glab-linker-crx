'use client';

import {
  Skeleton,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/index';
import { RefreshCcw, Maximize2, X } from 'lucide-react';

interface SkeletonCardProps {
  onClose?: () => void;
}

export function SkeletonCard({ onClose }: SkeletonCardProps) {
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex w-full items-center space-x-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled>
                  <RefreshCcw className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh merge request</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled>
                  <Maximize2 className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View in fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {onClose && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>

        <Skeleton className="mb-4 h-32 w-full" />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <Skeleton className="mb-2 h-4 w-16" />
            <div className="flex items-center">
              <Skeleton className="mr-2 size-6 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div>
            <Skeleton className="mb-2 h-4 w-24" />
            <div className="flex -space-x-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="size-6 rounded-full" />
            </div>
          </div>

          <div>
            <Skeleton className="mb-2 h-4 w-24" />
            <div className="flex -space-x-2">
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="size-6 rounded-full" />
              <Skeleton className="size-6 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-2">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardFooter>
    </Card>
  );
}
