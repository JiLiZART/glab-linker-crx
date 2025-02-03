import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button, Tabs, TabsTrigger, TabsList, TabsContent } from '@extension/ui';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { gitlabTokenStorage, gitlabApiUrlStorage } from '@extension/storage';
import { Plus } from 'lucide-react';
import { ApiUrlInput } from './ui/ApiUrlInput';
import { ApiTokenInput } from './ui/ApiTokenInput';
import '@src/Options.css';
import { OptionsForm, OptionsFormValues } from './ui/form/form';

const Options = () => {
  const [tabs, setTabs] = useState<OptionsFormValues[]>([
    {
      apiUrl: 'https://gitlab.com',
      gitlabToken: '',
    },
  ]);

  const onAdd = () => {
    setTabs(tabs => {
      return [
        ...tabs,
        {
          apiUrl: 'gitlab.com/' + tabs.length,
          gitlabToken: '',
        },
      ];
    });
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <div className="flex w-full max-w-6xl mx-auto p-6 gap-6">
        <Tabs defaultValue="instance-1" orientation="vertical" className="w-64 shrink-0">
          <TabsList className="h-auto flex-col items-stretch gap-1 bg-transparent">
            {tabs.map(item => (
              <TabsTrigger key={item.apiUrl} value={item.apiUrl} className="justify-start">
                {item.apiUrl}
              </TabsTrigger>
            ))}
            <Button onClick={onAdd} variant="outline" className="w-full justify-start mt-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Instance
            </Button>
          </TabsList>
          {tabs.map(item => (
            <TabsContent key={item.apiUrl} value={item.apiUrl}>
              <OptionsForm />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

type FormValues = {
  apiUrl: string;
  gitlabToken: string;
};

const OptionsOld = () => {
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
              <li>api</li>
              <li>read_api</li>
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
