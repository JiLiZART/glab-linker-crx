import { createRoot } from 'react-dom/client';
import '@src/index.css';
import '@extension/ui/global.css';
import Options from '@src/Options';

function init() {
  const appContainer = document.querySelector('#shadow-root');

  if (!appContainer) {
    throw new Error('Can not find #app-container');
  }
  const root = createRoot(appContainer);

  root.render(<Options />);
}

init();
