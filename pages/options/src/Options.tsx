import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';
import { ApiUrlInput } from './ui/ApiUrlInput';
import { ApiTokenInput } from './ui/ApiTokenInput';
import '@src/Options.css';

type FormValues = {
  apiUrl: string;
  gitlabToken: string;
};

const Options = () => {
  const gitlabToken = useStorage(gitlabTokenStorage);
  const apiUrl = useStorage(gitlabApiUrlStorage);
  const methods = useForm<FormValues>({
    defaultValues: {
      apiUrl,
      gitlabToken,
    },
  });

  const [saved, setSaved] = useState(false);

  const onSubmit = async (data: FormValues) => {
    const { apiUrl, gitlabToken } = data;

    await gitlabTokenStorage.setToken(gitlabToken);
    await gitlabApiUrlStorage.setUrl(apiUrl);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex min-h-screen flex-col items-center bg-slate-50 p-8">
        <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">Gitlab Linker Options</h1>

          <ApiUrlInput />

          <ApiTokenInput />

          <div className="flex items-center gap-4">
            <Button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none">
              Save
            </Button>
            {saved && <span className="text-sm font-medium text-green-500">Successfully saved!</span>}
          </div>

          <div className="mt-6 rounded-md bg-gray-50 p-4">
            <h2 className="mb-2 text-sm font-medium text-gray-700">Required permission for token:</h2>
            <ul className="list-inside list-disc text-sm text-gray-600">
              <li>read_api</li>
              <li>read_user</li>
              <li>read_repository</li>
              <li>write_repository</li>
            </ul>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>Loading...</div>), <div>Error occurred</div>);
