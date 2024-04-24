import { addItemToList } from './options.js';

// Initialize a Set to keep track of current items for easy lookup
export let currentItems = new Set();

export function loadItems() {
    chrome.storage.local.get(['items'], function(result) {
        const items = result.items || [];
        items.forEach(item => {
            addItemToList(item); // Add item to the DOM
            currentItems.add(item); // Add item to the Set for tracking
        });
    });
    console.log("Items have been loaded");
}

export function saveItems() {
    const items = [];
    document.querySelectorAll('#sites li').forEach(function(li) {
        items.push(li.textContent.slice(0, -1).trim());
    });
    chrome.storage.local.set({'items': items}, function() {
        console.log('Items are saved in chrome.storage');
    });
    // Update the Set to match current items in the DOM
    currentItems = new Set(items);
}

export function deleteItem(li) {
    const url_name = li.textContent;
    li.parentNode.removeChild(li);
    currentItems.delete(url_name); // Remove the URL from the Set
    console.log('Removed ' + url_name + ' from blocked urls');
    saveItems(); // Save the current state of items after deletion
}
