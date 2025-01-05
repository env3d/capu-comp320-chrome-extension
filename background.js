console.log('background.js is now running');

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'saveScore') {
    chrome.storage.local.set({ score: message.data }, function() {
      if (chrome.runtime.lastError) {
        console.error('Error saving score:', chrome.runtime.lastError);
        sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
      } else {
        console.log('Score saved:', message.data);
        sendResponse({ status: 'success' });
      }
    });
    return true; // Keep the message channel open for sendResponse
  } else if (message.type === 'getScore') {
    chrome.storage.local.get('score', function(result) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving score:', chrome.runtime.lastError);
        sendResponse({ status: 'error', message: chrome.runtime.lastError.message });
      } else {
        console.log('Retrieved score:', result.score);
        sendResponse({ status: 'success', data: result.score });
      }
    });
    return true; // Keep the message channel open for sendResponse
  } else {
    sendResponse({ status: 'error', message: 'Invalid message format' });
  }
});


function updateBlockingRules() {
  chrome.tabs.query({}, function(tabs) {
    console.log('Checking tabs:', tabs);
    const sqlzooOpen = tabs.some(tab => tab.url && tab.url.includes('sqlzoo.net'));

    if (sqlzooOpen) {
      // Enable blocking rule for chatgpt
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [{
          id: 1,
          priority: 1,
          action: { type: 'block' },
          condition: { urlFilter: '*chatgpt*', resourceTypes: ['main_frame'] }
        }],
        removeRuleIds: []
      }, () => {
        console.log('Blocking rule for chatgpt enabled');
      });
    } else {
      // Remove blocking rule for chatgpt
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1]
      }, () => {
        console.log('Blocking rule for chatgpt disabled');
      });
    }
  });
}

// Monitor tab updates
chrome.tabs.onUpdated.addListener(updateBlockingRules);

// Monitor tab removal
chrome.tabs.onRemoved.addListener(updateBlockingRules);

// Monitor tab creation
chrome.tabs.onCreated.addListener(updateBlockingRules);

// Initial check
updateBlockingRules();