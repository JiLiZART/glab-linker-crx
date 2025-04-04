import type { Control } from 'react-hook-form';

export type OptionsFormValues = {
  // apiUrl: string;
  token: string;
  hostname: string;
  prefetchLinks?: boolean;
  showDescription?: boolean;
  showAvatar?: boolean;
  showMerge?: boolean;

  position: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'near-cursor';

  whitelist: string;
  blacklist: string;
};

export type OptionsFormControl = Control<OptionsFormValues>;
