//backend functions to update storage
export function loadItems() {
    chrome.storage.local.get(['items'], function(result) {
        const items = result.items || [];
        items.forEach(addItemToList);
    });
    console.log("Items have been loaded")
}

export function saveItems(){
    const items = [];
    document.querySelectorAll('#sites li').forEach(function(li) {
        items.push(li.textContent.slice(0, -1).trim());
    });
    chrome.storage.local.set({'items': items}, function() {
        console.log('Items are saved in chrome.storage');
    });
}

export function deleteItem(li) {
    const url_name = li.textContent;
    li.parentNode.removeChild(li);
    console.log('Removed ' + url_name + ' from blocked urls');
    saveItems();
}