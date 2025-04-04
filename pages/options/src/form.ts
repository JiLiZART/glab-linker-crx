import { useFormContext, useWatch } from 'react-hook-form';
import type { OptionsFormValues } from './types';

export const useFormValues = () => {
  const { getValues, control } = useFormContext<OptionsFormValues>();

  return {
    ...useWatch({ control }), // subscribe to form value updates

    ...getValues(), // always merge with latest form values
  };
};
