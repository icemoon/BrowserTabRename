document.addEventListener('DOMContentLoaded', function() {
  const renameButton = document.getElementById('rename-button');
  const newTitleInput = document.getElementById('new-title');
  const rulesButton = document.getElementById('rules-button');

  renameButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const tabId = tabs[0].id;
      const newTitle = newTitleInput.value;
      if (newTitle) {
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: (title) => {
            document.title = title;
          },
          args: [newTitle]
        }, () => {
          window.close();
        });
      } else {
        window.close();
      }
    });
  });

  rulesButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });
});
