import { useFormContext, useWatch } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';

export const useFormValues = <TFieldValues extends FieldValues>() => {
  const { getValues, control } = useFormContext<TFieldValues>();

  return {
    ...useWatch({ control }), // subscribe to form value updates

    ...getValues(), // always merge with latest form values
  };
};

export function timeout(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
