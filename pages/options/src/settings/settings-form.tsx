import { URLPatternSettings } from './form/URLPatternSettings';
import { DisplaySettings } from './form/DisplaySettings';
import { PositionSettings } from './form/PositionSettings';
import { AdvancedSettings } from './form/AdvancedSettings';
import { Actions } from './form/Actions';
import { useForm, FormProvider } from 'react-hook-form';
import type { SettingsFormValues } from '@src/types';
import { useState } from 'react';
import { timeout } from '@src/util';

export type SettingsFormProps = {
  onSave: (values: SettingsFormValues) => Promise<void>;
  defaultValues?: Partial<SettingsFormValues>;
};

export const SettingsForm = (props: SettingsFormProps) => {
  const { onSave, defaultValues } = props;
  const methods = useForm<SettingsFormValues>({
    defaultValues: defaultValues,
    shouldFocusError: true,
    reValidateMode: 'onChange',
  });
  const [saved, setSaved] = useState(false);
  const { handleSubmit, formState, control } = methods;
  const { isSubmitting } = formState;

  const onSubmit = async (values: SettingsFormValues) => {
    console.log({ values });

    try {
      await onSave(values);
      setSaved(true);
      await timeout(1000);
    } catch (err) {
      console.log({ err });
    } finally {
      setSaved(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 space-y-6 py-6 pr-6">
        <URLPatternSettings control={control} />
        <DisplaySettings control={control} />
        <PositionSettings control={control} />
        <AdvancedSettings control={control} />

        <Actions submitting={isSubmitting} saved={saved} />
      </form>
    </FormProvider>
  );
};
