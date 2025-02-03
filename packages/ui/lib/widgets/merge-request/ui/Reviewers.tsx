import type { FC } from 'react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../../index';

interface Reviewer {
  name: string;
  avatar: string;
}

interface ReviewersProps {
  reviewers: Reviewer[];
}

export const Reviewers: FC<ReviewersProps> = ({ reviewers }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        <TooltipProvider>
          {reviewers.map(reviewer => (
            <Tooltip key={reviewer.name}>
              <TooltipTrigger asChild>
                <Avatar className="size-6">
                  <AvatarImage src={reviewer.avatar} alt={reviewer.name} />
                  <AvatarFallback>{reviewer.name[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reviewer assigned by {reviewer.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
