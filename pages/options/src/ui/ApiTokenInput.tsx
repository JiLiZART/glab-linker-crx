import { useFormContext } from 'react-hook-form';

export function ApiTokenInput() {
  const { register } = useFormContext();

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="gitlabToken">
        Персональный токен доступа GitLab
      </label>
      <input
        type="password"
        {...register('gitlabToken')}
        className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        placeholder="Введите ваш GitLab токен"
      />
      <p className="mt-2 text-xs text-gray-500">
        Токен можно получить в настройках GitLab: Settings {'>'} Access Tokens
      </p>
    </div>
  );
}
