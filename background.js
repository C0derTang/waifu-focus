chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({url: "index.html"});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        const url = new URL(tab.url);
        const domain = url.hostname;
        const path = url.pathname + url.search;

        chrome.storage.local.get(['blockRules'], function(result) {
            const rules = result.blockRules || [];
            
            // Check if URL matches any blocking rules
            const isBlocked = rules.some(rule => {
                // If rule is a simple domain block
                if (rule.type === 'domain') {
                    // Support wildcard matching with *
                    const pattern = rule.value.replace(/\*/g, '.*');
                    return new RegExp(pattern).test(domain);
                }
                
                // If rule is a path block (blocks specific paths under a domain)
                if (rule.type === 'path' && domain.includes(rule.domain)) {
                    // Support wildcard matching in paths
                    const pattern = rule.value.replace(/\*/g, '.*');
                    return new RegExp(pattern).test(path);
                }

                return false;
            });

            if (isBlocked) {
                chrome.tabs.update(tabId, {url: chrome.runtime.getURL('blocked.html')});
            }
        });
    }
});

// Initialize storage with empty rules if not exists
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.get(['blockRules'], function(result) {
        if (!result.blockRules) {
            chrome.storage.local.set({
                blockRules: []
            });
        }
    });
});