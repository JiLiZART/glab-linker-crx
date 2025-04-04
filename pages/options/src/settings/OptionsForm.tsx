import { GitLabInstanceSettings } from './form/GitLabInstanceSettings';
import { URLPatternSettings } from './form/URLPatternSettings';
import { DisplaySettings } from './form/DisplaySettings';
import { PositionSettings } from './form/PositionSettings';
import { AdvancedSettings } from './form/AdvancedSettings';
import { Actions } from './form/Actions';
import { useForm, FormProvider } from 'react-hook-form';
import type { OptionsFormValues } from '@src/types';
import { useState } from 'react';

function timeout(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

export type OptionsFormProps = {
  onSave: (values: OptionsFormValues) => Promise<void>;
  defaultValues?: Partial<OptionsFormValues>;
};

export const OptionsForm = (props: OptionsFormProps) => {
  const { onSave, defaultValues } = props;
  const [saved, setSaved] = useState(false);
  const methods = useForm<OptionsFormValues>({
    defaultValues: defaultValues,
  });
  const { handleSubmit, control } = methods;

  const onSubmit = async (values: OptionsFormValues) => {
    // const { apiUrl, token } = data;

    console.log({ values });

    // await gitlabTokenStorage.setToken(gitlabToken);
    // await gitlabApiUrlStorage.setUrl(apiUrl);

    setSaved(true);
    await timeout(2000);
    setSaved(false);

    await onSave();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 py-6 pr-6">
        <GitLabInstanceSettings control={control} />
        <URLPatternSettings control={control} />
        <DisplaySettings control={control} />
        <PositionSettings control={control} />
        <AdvancedSettings control={control} />

        <Actions saved={saved} />
      </form>
    </FormProvider>
  );
};
