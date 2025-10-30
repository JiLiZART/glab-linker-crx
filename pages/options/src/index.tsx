import { createRoot } from 'react-dom/client';
import '@extension/ui/global.css';
import Options from './options-ui';

function init() {
  const appContainer = document.querySelector('#shadow-root-crx-gitlab-linker-root');

  if (!appContainer) {
    throw new Error('Can not find #shadow-root');
  }

  const root = createRoot(appContainer);

  root.render(<Options />);
}

init();
