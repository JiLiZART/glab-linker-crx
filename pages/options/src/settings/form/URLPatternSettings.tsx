import { Card, Textarea } from '@extension/ui';
import type { OptionsFormControl } from '@src/types';
import { Controller } from 'react-hook-form';

export const URLPatternSettings = ({ control }: { control: OptionsFormControl }) => {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">URL Pattern Settings</h2>
      <div className="grid grid-cols-2 gap-6">
        <Controller
          name="whitelist"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="whitelist" className="mb-2 block text-sm font-medium">
                Include Patterns
              </label>
              <Textarea
                {...field}
                name="whitelist"
                placeholder="Enter URL patterns to include (one per line)
Example:
*
*.gitlab.com
company.gitlab.com/*"
                className="h-[120px] font-mono text-sm"
                defaultValue="*"
              />
              <p className="mt-2 text-sm text-gray-600">Default is * (matches all URLs)</p>
            </div>
          )}
        />

        <Controller
          name="blacklist"
          control={control}
          render={({ field }) => (
            <div>
              <label htmlFor="blacklist" className="mb-2 block text-sm font-medium">
                Exclude Patterns
              </label>
              <Textarea
                {...field}
                name="blacklist"
                placeholder="Enter URL patterns to exclude (one per line)
Example:
*.gitlab.com/private/*
internal.gitlab.com/*"
                className="h-[120px] font-mono text-sm"
              />
              <p className="mt-2 text-sm text-gray-600">Leave empty to exclude nothing</p>
            </div>
          )}
        />
      </div>
    </Card>
  );
};
