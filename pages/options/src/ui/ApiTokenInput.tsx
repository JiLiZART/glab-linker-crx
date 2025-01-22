import { useFormContext } from 'react-hook-form';

export function ApiTokenInput() {
  const { register, watch } = useFormContext();
  const apiUrl = watch('apiUrl');
  const hostname = new URL(apiUrl).hostname;
  const url = `https://${hostname}/-/user_settings/personal_access_tokens`;

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
          <a href={url} target="_blank" className="ml-1 text-blue-500" rel="noreferrer">
            {url}
          </a>
        )}
      </p>
    </div>
  );
}
