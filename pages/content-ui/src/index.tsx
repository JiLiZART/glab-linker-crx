import ContentUI from '@src/content-ui';
import tailwindcssOutput from '@extension/ui/global.css?inline';
import { initAppWithShadow } from '@extension/shared';

initAppWithShadow({ id: 'crx-gitlab-linker-root', app: <ContentUI />, inlineCss: tailwindcssOutput });
