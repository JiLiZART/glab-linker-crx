import { Card, Checkbox } from '@extension/ui';

export const AdvancedSettings = () => {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">Advanced Settings</h2>
      <div className="space-y-4">
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox id="prefetch-links" />
            <label htmlFor="prefetch-links" className="text-sm font-medium">
              Prefetch links
            </label>
          </div>
          <p className="ml-6 mt-1 text-sm text-gray-600">
            Automatically prefetch GitLab links in the background for faster navigation
          </p>
        </div>
      </div>
    </Card>
  );
};
