document.addEventListener('DOMContentLoaded', function() {
  const renameButton = document.getElementById('rename-button');
  const newTitleInput = document.getElementById('new-title');
  const rulesButton = document.getElementById('rules-button');
  const resetButton = document.getElementById('reset-button');

  // Use a key to store original titles for each tab
  const ORIGINAL_TITLE_KEY = 'originalTabTitles';


  renameButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      const newTitle = newTitleInput.value;

      if (newTitle) {
        // First, get the current title and store as original
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            return document.querySelector('title') ? document.querySelector('title').textContent : document.title;
          }
        }, (results) => {
          if (results && results[0]) {
            const originalTitle = results[0].result;

            // Store original title before renaming
            chrome.storage.local.get([ORIGINAL_TITLE_KEY], function(result) {
              const originalTitles = result[ORIGINAL_TITLE_KEY] || {};
              if (!originalTitles[tabId]) {
                originalTitles[tabId] = originalTitle;
                chrome.storage.local.set({ [ORIGINAL_TITLE_KEY]: originalTitles });
              }

              // Apply the new title
              chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: (title) => {
                  document.title = title;
                },
                args: [newTitle]
              }, () => {
                window.close();
              });
            });
          }
        });
      } else {
        window.close();
      }
    });
  });

  rulesButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  resetButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;

      // Get the original title from storage
      chrome.storage.local.get([ORIGINAL_TITLE_KEY], function(result) {
        const originalTitles = result[ORIGINAL_TITLE_KEY] || {};
        const originalTitle = originalTitles[tabId];

        if (originalTitle) {
          // Reset to original title
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (originalTitle) => {
              document.title = originalTitle;
            },
            args: [originalTitle]
          }, () => {
            // Clean up - remove the stored original title for this tab
            delete originalTitles[tabId];
            chrome.storage.local.set({ [ORIGINAL_TITLE_KEY]: originalTitles });
            window.close();
          });
        } else {
          // No original title stored, do nothing
          window.close();
        }
      });
    });
  });
});
