import { Badge } from '@/index';

export const DiscussionsBadge = ({ resolved }: { resolved: boolean }) => {
  // resolved
  const unresolvedStatus = 'bg-orange-500/10 text-orange-500';
  const resolvedStatus = 'bg-green-500/10 text-green-500';

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className={resolved ? resolvedStatus : unresolvedStatus}>
        {resolved ? 'Discussions Resolved' : 'Has Unresolved Discussions'}
      </Badge>
    </div>
  );
};
