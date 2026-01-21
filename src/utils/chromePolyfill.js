// Utility to safely access chrome extension APIs with fallbacks for development
const isExtension = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;

export const safeStorage = {
    get: (keys, callback) => {
        if (isExtension && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(keys, callback);
        } else {
            // Fallback to localStorage for development
            console.warn('Chrome storage not available, falling back to localStorage');
            const result = {};
            const keyList = Array.isArray(keys) ? keys : [keys];
            keyList.forEach(key => {
                const value = localStorage.getItem(`wf_${key}`);
                try {
                    result[key] = value ? JSON.parse(value) : undefined;
                } catch (e) {
                    result[key] = value;
                }
            });
            callback(result);
        }
    },
    set: (items, callback) => {
        if (isExtension && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set(items, callback);
        } else {
            // Fallback to localStorage for development
            console.warn('Chrome storage not available, falling back to localStorage');
            Object.entries(items).forEach(([key, value]) => {
                localStorage.setItem(`wf_${key}`, JSON.stringify(value));
            });
            if (callback) callback();
        }
    }
};
