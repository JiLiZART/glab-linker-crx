import { Button } from '@/index';
import { RefreshCwIcon } from 'lucide-react';
import { useState } from 'react';

export const RefreshButton = ({ onRefresh }: { onRefresh?: () => Promise<void> }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onClick = async () => {
    try {
      setIsRefreshing(true);
      await onRefresh?.();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button variant="ghost" className="ml-auto" onClick={onClick}>
      <RefreshCwIcon className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
};
