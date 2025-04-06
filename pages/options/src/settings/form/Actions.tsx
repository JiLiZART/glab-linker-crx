import { Button } from '@extension/ui';

export const Actions = ({ submitting, saved }: { submitting: boolean; saved: boolean }) => {
  return (
    <div className="flex items-center gap-4">
      <Button type="submit">{submitting ? 'Saving...' : 'Save'}</Button>
      {saved && <span className="text-sm font-medium text-green-600">Success saved!</span>}
    </div>
  );
};
