function isValidUrl(url){
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

document.addEventListener('DOMContentLoaded', function() {
    const waifu = document.getElementById('waifubutt');
    waifu.addEventListener('click', saveWaifu);

    const butt = document.getElementById('additembutt');
    butt.addEventListener('click', addItem);

    loadItems();
});

function saveWaifu() {
    const waifupic = document.querySelector('input[name="choice"]:checked').value;
    chrome.storage.local.set({waifupic: waifupic}, function() {
        console.log('Image selection saved:', waifupic);
    });
}

function addItem() {
    const elem = document.getElementById('listadd');
    const newelem = elem.value.trim();

    if (newelem && isValidUrl(newelem)) {
        addItemToList(newelem);
        elem.value = '';
        saveItems();
    }else{
        alert('uwu -uhm, could u pls enter a valid site url? >w<');
    }
}

function addItemToList(item){
    const list = document.getElementById('sites');
    const li = document.createElement('li');
    li.textContent = item;

    const delbutt = document.createElement('button');
    delbutt.textContent = 'X';
    delbutt.classList.add('smallbutt');
    delbutt.onclick = function() {
        deleteItem(li);
    }
    li.appendChild(delbutt);

    list.appendChild(li);
}

function loadItems() {
    chrome.storage.local.get(['items'], function(result) {
        const items = result.items || [];
        items.forEach(addItemToList);
    });
}

function saveItems(){
    const items = [];
    document.querySelectorAll('#sites li').forEach(function(li) {
        items.push(li.textContent.slice(0, -1).trim());
    });
    chrome.storage.local.set({'items': items}, function() {
        console.log('Items are saved in chrome.storage');
    });
}

function deleteItem(li) {
    li.parentNode.removeChild(li);
    saveItems();
}