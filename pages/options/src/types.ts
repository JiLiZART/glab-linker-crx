import type { Control } from 'react-hook-form';

export type OptionsFormValues = {
  token: string;
  hostname: string;
};

export type OptionsFormControl = Control<OptionsFormValues>;

export type SettingsFormValues = {
  prefetchLinks?: boolean;
  showDescription?: boolean;
  showAvatar?: boolean;
  showMerge?: boolean;

  position: 'left-top' | 'right-top' | 'left-bottom' | 'right-bottom' | 'near-cursor';

  whitelist: string;
  blacklist: string;
}

export type SettingsFormControl = Control<OptionsFormValues>;
