import * as Utils from './backend_util.js';
function isValidUrl(url){// checks for valid url
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
}

document.addEventListener('DOMContentLoaded', function() {
    /*
        creates image of waifus on the web view
     */
    const waifu = document.getElementById('waifubutt');
    waifu.addEventListener('click', saveWaifu);

    const butt = document.getElementById('additembutt');
    butt.addEventListener('click', addItem);

    Utils.loadItems();
});

//TODO: add better functionality for more waifus
function saveWaifu() {
    /*
        whenever user changes their waifu selection, this will be called
        it will log which waifu they changed it to
        it also updates the local storage

     */
    const waifupic = document.querySelector('input[name="choice"]:checked').value;
    //above line bases the name of the choice selected changes the logged waifu
    chrome.storage.local.set({waifupic: waifupic}, function() {
        console.log('Image selection saved:', waifupic);
    });
}


function addItem() {
    /*
        entire backend functionality of adding urls to block
        saves items by calling the saves items method
        also has cute response for both failed and succesful adding of websites
    */
    const elem = document.getElementById('listadd');
    const newelem = elem.value.trim();

    if (newelem && isValidUrl(newelem) && 1 /*link already exists*/) {
        //saves url to list
        addItemToList(newelem);
        elem.value = '';
        //updates local url storage
        Utils.saveItems();
        alert('Im so proud of you, you\'ve finally come to your senses about slacking off!');
    } else if (1/*check if link already exists*/) {
        alert('I appreciate your dedication dear, but you\'ve already blocked this website.');
    }
    else{
        alert('uwu -uhm, could u pls enter a valid site url? >w<');
    }
}

export function addItemToList(item){
    /*
        creates frontend of adding url
     */
    const list = document.getElementById('sites');
    const li = document.createElement('li');
    li.textContent = item;

    const delbutt = document.createElement('button');
    delbutt.textContent = 'X';
    delbutt.classList.add('smallbutt');
    delbutt.onclick = function() {
        Utils.deleteItem(li);
    }
    li.appendChild(delbutt);

    list.appendChild(li);
}