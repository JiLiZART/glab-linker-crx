import { Card, Input } from '@extension/ui';
import { ExternalLink } from 'lucide-react';
import type { OptionsFormControl } from '@src/types';
import { Controller } from 'react-hook-form';
import { useFormValues } from '@src/form';

const Header = () => {
  const values = useFormValues();

  if (values.hostname) {
    return (
      <h2 className="mb-4 text-lg font-semibold">GitLab Instance Settings {values.hostname.replace('https://', '')}</h2>
    );
  }

  return <h2 className="mb-4 text-lg font-semibold">GitLab Instance Settings</h2>;
};

const requiredScopes = ['api', 'read_repository', 'write_repository', 'read_api'];

export const GitLabInstanceSettings = ({ control }: { control: OptionsFormControl }) => {
  return (
    <Card className="p-6">
      <Header />
      <div className="space-y-4">
        <Controller
          name="hostname"
          rules={{ required: 'This field is required' }}
          control={control}
          render={({ field, formState: { errors } }) => (
            <div>
              <label htmlFor="hostname" className="mb-1 block text-sm font-medium">
                Hostname
              </label>
              <Input {...field} name="hostname" type="url" placeholder="e.g. gitlab.com" />
              {errors?.hostname?.message && <p className="mt-2 text-sm text-red-600">{errors.hostname.message}</p>}
            </div>
          )}
        />

        <Controller
          name="token"
          rules={{ required: 'This field is required' }}
          control={control}
          render={({ field, formState: { errors } }) => (
            <div>
              <label htmlFor="token" className="mb-1 block text-sm font-medium">
                Access Token
              </label>
              <Input {...field} type="password" name="token" placeholder="Your GitLab access token" />
              <div className="mt-2 text-sm text-gray-600">
                <a
                  href="https://gitlab.com/-/profile/personal_access_tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  Create access token
                  <ExternalLink className="ml-1 size-3" />
                </a>
              </div>
              {errors?.token?.message && <p className="mt-2 text-sm text-red-600">{errors.token.message}</p>}
            </div>
          )}
        />

        <div>
          <h3 className="mb-2 text-sm font-medium">Required API Scopes:</h3>
          <ul className="list-inside list-disc space-y-1 text-sm text-gray-600">
            {requiredScopes.map(scope => (
              <li key={scope}>{scope}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
};
