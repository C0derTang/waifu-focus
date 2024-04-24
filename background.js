chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({url: "options.html"});
  });

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        const url = new URL(tab.url);
        const domain = url.hostname;

        chrome.storage.local.get(['items'], function(result) {
            const items = result.items || [];
            if (items.some(item => domain.includes(item))){
                chrome.tabs.update(tabId, {url: chrome.runtime.getURL('blocked.html')});
            }
        });
    }
})