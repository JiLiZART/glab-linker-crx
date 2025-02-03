import { useFormContext } from 'react-hook-form';

export function ApiTokenInput() {
  const { register, watch } = useFormContext();
  const apiUrl = watch('apiUrl');
  const hostname = apiUrl && apiUrl.startsWith('http') ? new URL(apiUrl).hostname : '';
  const newUrl = `https://${hostname}/-/user_settings/personal_access_tokens`;
  const oldUrl = `https://${hostname}/-/profile/personal_access_tokens`;

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="gitlabToken">
        GitLab Access Token
      </label>
      <input
        type="password"
        {...register('gitlabToken')}
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        placeholder="Enter your GitLab Token"
      />
      <p className="mt-2 text-xs text-gray-500">
        You can get it in Avatar {'>'} Preferences {'>'} Access Tokens
        <br />
        {hostname && (
          <>
            <a href={newUrl} target="_blank" className="ml-1 text-blue-500" rel="noreferrer">
              {newUrl}
            </a>
            {'or'}
            <a href={oldUrl} target="_blank" className="ml-1 text-blue-500" rel="noreferrer">
              {oldUrl}
            </a>
          </>
        )}
      </p>
    </div>
  );
}
