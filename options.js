document.addEventListener('DOMContentLoaded', function() {
  const urlFragmentInput = document.getElementById('url-fragment');
  const newNameInput = document.getElementById('new-name');
  const addRuleButton = document.getElementById('add-rule');
  const rulesList = document.getElementById('rules-list');

  function saveRules(rules) {
    chrome.storage.sync.set({ rules: rules }, function() {
      loadRules();
    });
  }

  function loadRules() {
    chrome.storage.sync.get('rules', function(data) {
      const rules = data.rules || [];
      rulesList.innerHTML = '';
      for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const ruleElement = document.createElement('div');
        ruleElement.className = 'rule';
        ruleElement.innerHTML = `
          <span>${rule.urlFragment} &rarr; ${rule.newName}</span>
          <button data-index="${i}">❌</button>
        `;
        rulesList.appendChild(ruleElement);
      }
    });
  }

  addRuleButton.addEventListener('click', function() {
    const urlFragment = urlFragmentInput.value;
    const newName = newNameInput.value;
    if (urlFragment && newName) {
      chrome.storage.sync.get('rules', function(data) {
        const rules = data.rules || [];
        rules.push({ urlFragment: urlFragment, newName: newName });
        saveRules(rules);
        urlFragmentInput.value = '';
        newNameInput.value = '';
      });
    }
  });

  rulesList.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON') {
      const index = parseInt(e.target.getAttribute('data-index'));
      chrome.storage.sync.get('rules', function(data) {
        const rules = data.rules || [];
        rules.splice(index, 1);
        saveRules(rules);
      });
    }
  });

  loadRules();
});
