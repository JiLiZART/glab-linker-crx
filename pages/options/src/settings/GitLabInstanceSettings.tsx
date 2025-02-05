import { Card, Input } from '@extension/ui';
import { ExternalLink } from 'lucide-react';

export const GitLabInstanceSettings = () => {
  const requiredScopes = ['api', 'read_repository', 'write_repository', 'read_api'];

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-lg font-semibold">GitLab Instance Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Hostname</label>
          <Input placeholder="e.g. gitlab.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Access Token</label>
          <Input type="password" placeholder="Your GitLab access token" />
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
        </div>
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
