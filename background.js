chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.url) {
    chrome.storage.sync.get('rules', (data) => {
      const rules = data.rules || [];
      for (const rule of rules) {
        if (tab.url && tab.url.includes(rule.urlFragment)) {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (title) => {
              document.title = title;
            },
            args: [rule.newName]
          });
          break; 
        }
      }
    });
  }
});
