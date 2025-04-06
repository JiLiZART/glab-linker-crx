import { GitLabInstanceSettings } from './form/GitLabInstanceSettings';
import { URLPatternSettings } from './form/URLPatternSettings';
import { DisplaySettings } from './form/DisplaySettings';
import { PositionSettings } from './form/PositionSettings';
import { AdvancedSettings } from './form/AdvancedSettings';
import { Actions } from './form/Actions';
import { useForm, FormProvider } from 'react-hook-form';
import type { OptionsFormValues } from '@src/types';
import { useState } from 'react';

const NOT_AUTHORIZED_ERROR = '401 Unauthorized';

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
  const methods = useForm<OptionsFormValues>({
    defaultValues: defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });
  const [saved, setSaved] = useState(false);
  const { handleSubmit, formState, control } = methods;

  const onSubmit = async (values: OptionsFormValues) => {
    console.log({ values });

    // await gitlabTokenStorage.setToken(gitlabToken);
    // await gitlabApiUrlStorage.setUrl(apiUrl);

    try {
      await onSave(values);
      setSaved(true);
      await timeout(1000);
    } catch (err) {
      console.log({ err });
      const cause = (err instanceof Error && err?.cause) as { message: string } | undefined;

      if (err instanceof Error) {
        if (cause?.message === NOT_AUTHORIZED_ERROR) {
          methods.setError('token', { type: 'manual', message: 'Invalid token' }, { shouldFocus: true });
          return;
        }

        if (err?.message === 'Failed to fetch') {
          methods.setError('hostname', { type: 'manual', message: 'Invalid hostname or token' }, { shouldFocus: true });
          return;
        }
      }
    } finally {
      setSaved(false);
    }
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
