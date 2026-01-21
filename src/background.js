function isWithinSchedule(schedule) {
    console.log('Checking schedule:', schedule);
    if (!schedule || !schedule.enabled) return true;

    const now = new Date();
    const currentDay = now.getDay(); // 0 is Sunday, 6 is Saturday
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Check if current day is in scheduled days
    if (!schedule.days.includes(currentDay)) {
        return false;
    }

    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    const startTime = startH * 60 + startM;
    const endTime = endH * 60 + endM;

    // Handle overnight schedules (e.g., 22:00 to 02:00)
    if (startTime > endTime) {
        return currentTime >= startTime || currentTime <= endTime;
    }

    return currentTime >= startTime && currentTime <= endTime;
}

chrome.action.onClicked.addListener(function () {
    chrome.tabs.create({ url: "index.html" });
});

function checkAndBlock(tabId, urlString) {
    if (!urlString || urlString.startsWith('chrome-extension://')) return;

    try {
        const url = new URL(urlString);
        const domain = url.hostname;
        const path = url.pathname + url.search;

        chrome.storage.local.get(['blockRules'], function (result) {
            const rules = result.blockRules || [];

            const isBlocked = rules.some(rule => {
                if (rule.type === 'group') {
                    if (!isWithinSchedule(rule.schedule)) return false;
                    return rule.sites.some(site => matchesRule(site, domain, path));
                } else {
                    if (!isWithinSchedule(rule.schedule)) return false;
                    return matchesRule(rule, domain, path);
                }
            });

            if (isBlocked) {
                chrome.tabs.update(tabId, { url: chrome.runtime.getURL('blocked.html') });
            }
        });
    } catch (e) {
        // Ignore invalid URLs
    }
}

// Early blocking catch
chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
    if (details.frameId === 0) { // Main frame only
        checkAndBlock(details.tabId, details.url);
    }
});

// Fallback/Safety catch
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
        checkAndBlock(tabId, changeInfo.url);
    }
});

function matchesRule(rule, domain, path) {
    if (rule.type === 'domain') {
        const pattern = rule.value.replace(/\*/g, '.*');
        return new RegExp(pattern).test(domain);
    }

    if (rule.type === 'path' && domain.includes(rule.domain)) {
        const pattern = rule.value.replace(/\*/g, '.*');
        return new RegExp(pattern).test(path);
    }

    return false;
}

// Initialize storage with empty rules if not exists
chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.get(['blockRules'], function (result) {
        if (!result.blockRules) {
            chrome.storage.local.set({
                blockRules: []
            });
        }
    });
});