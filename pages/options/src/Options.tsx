import { useState } from 'react';
import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { Button } from '@extension/ui';
import { gitlabTokenStorage } from '@extension/storage';

const Options = () => {
  const token = useStorage(gitlabTokenStorage);
  const [inputToken, setInputToken] = useState(token);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await gitlabTokenStorage.set(inputToken);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">GitLab Настройки</h1>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="gitlabToken">
            Персональный токен доступа GitLab
          </label>
          <input
            name="gitlabToken"
            type="password"
            value={inputToken}
            onChange={e => setInputToken(e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            placeholder="Введите ваш GitLab токен"
          />
          <p className="mt-2 text-xs text-gray-500">
            Токен можно получить в настройках GitLab: Settings {'>'} Access Tokens
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleSave}
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none">
            Сохранить
          </Button>
          {saved && <span className="text-sm font-medium text-green-500">Токен успешно сохранен!</span>}
        </div>

        <div className="mt-6 rounded-md bg-gray-50 p-4">
          <h2 className="mb-2 text-sm font-medium text-gray-700">Необходимые разрешения для токена:</h2>
          <ul className="list-inside list-disc text-sm text-gray-600">
            <li>api</li>
            <li>read_api</li>
            <li>read_user</li>
            <li>read_repository</li>
            <li>write_repository</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Загрузка...</div>), <div>Произошла ошибка</div>);
