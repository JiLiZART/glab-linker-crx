import 'webextension-polyfill';
import { exampleThemeStorage } from '@extension/storage';
import { getMRUrl } from '@extension/shared/dist/lib/utils';

exampleThemeStorage.get().then(theme => {
  console.log('theme', theme);
});

// console.log('background loaded');
// console.log("Edit 'chrome-extension/src/background/index.ts' and save to reload.");

const chrome = globalThis.chrome;

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'glab-linker-mr-link',
    title: 'Show Merge Request',
    type: 'normal',
    contexts: ['link'],
    targetUrlPatterns: ['https://*/*/merge_requests/*'],
  });
});

chrome.contextMenus.onClicked.addListener((item, tab) => {
  console.log('contextMenus.onclick', item, tab);

  if (item.linkUrl && getMRUrl(item.linkUrl) && tab?.id) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            type: 'glab-linker-open-merge-request',
            url: item.linkUrl,
          },
          function (response) {
            console.log('background.contextMenus.onClicked', { response });
          },
        );
      }
    });
  }
});
