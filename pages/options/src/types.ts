import type { Control } from 'react-hook-form';

export type OptionsFormValues = {
  apiUrl: string;
  token: string;
  prefetchLinks?: boolean;
  showDescription?: boolean;
  showAvatar?: boolean;
  showMerge?: boolean;
};

export type OptionsFormControl = Control<OptionsFormValues>;
