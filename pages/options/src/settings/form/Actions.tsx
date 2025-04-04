import { Button } from '@extension/ui';

export const Actions = ({ saved }: { saved: boolean }) => {
  return (
    <div className="flex items-center gap-4">
      <Button type="submit">Save Settings</Button>
      {saved && <span className="text-sm font-medium text-green-600">Success saved!</span>}
    </div>
  );
};
