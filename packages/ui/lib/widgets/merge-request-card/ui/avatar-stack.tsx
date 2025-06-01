import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Avatar, AvatarFallback, AvatarImage } from '@/index';
import type { User } from '../types';

interface AvatarStackProps {
  users: User[];
  maxVisible?: number;
  showTooltipNames?: boolean;
}

export function AvatarStack({ users, maxVisible = 3, showTooltipNames = false }: AvatarStackProps) {
  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <TooltipProvider key={user.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="size-6 border-2 border-white">
                  <AvatarImage src={user.avatarUrl || '/placeholder.svg'} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        {remainingCount > 0 && (
          <div className="flex size-6 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-xs font-medium">
            +{remainingCount}
          </div>
        )}
      </div>

      {showTooltipNames && users.length > 0 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-2 cursor-help text-xs text-gray-500">View all</div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                {users.map(user => (
                  <p key={user.id}>{user.name}</p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
