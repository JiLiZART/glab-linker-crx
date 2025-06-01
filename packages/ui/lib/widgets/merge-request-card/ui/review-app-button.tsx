import { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/index';
import type { ReviewAppModel } from '@extension/shared';

export function ReviewAppButton(props: { reviewApp?: () => Promise<ReviewAppModel | undefined> | undefined }) {
  const { reviewApp } = props;
  const [data, setData] = useState<ReviewAppModel | undefined>();

  useEffect(() => {
    reviewApp?.()?.then(setData);
  }, [reviewApp]);

  if (!data) {
    return null;
  }

  return (
    <Button variant="outline" size="sm" className="text-xs" onClick={() => window.open(data.url, '_blank')}>
      <ExternalLink className="mr-1 size-3" />
      Review App
    </Button>
  );
}
