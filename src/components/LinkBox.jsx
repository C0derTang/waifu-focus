import React, { useState, useEffect } from "react";

// checks for valid url. chatgpted regex >>>
function isValidUrl(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(url);
}

function saveItems(items) {
  chrome.storage.local.set({ items: Array.from(items) }, function () {
    console.log("Items are saved in chrome.storage");
  });
}

function LinkBox() {
  const [url, setUrl] = useState("");
  const [blockedSites, setBlockedSites] = useState(new Set());

  useEffect(() => {
    // Load the links
    chrome.storage.local.get(["items"], function (result) {
      const items = result.items || [];
      setBlockedSites(new Set(items));
    });
  }, []);

  function handleInputChange(e) {
    setUrl(e.target.value);
  }

  function addItem() {
    if (url.trim() && isValidUrl(url.trim())) {
      const updatedSites = new Set([...blockedSites, url]);
      setBlockedSites(updatedSites);
      saveItems(updatedSites);
      setUrl("");
    } else {
      alert("uwu -uhm, could u pls enter a valid site url? >w<");
    }
  }

  function deleteItem(siteToRemove) {
    const updatedSites = new Set(blockedSites);
    updatedSites.delete(siteToRemove);
    setBlockedSites(updatedSites);
    saveItems(updatedSites);
  }

  return (
    <div className="bg-blue-300 p-6 max-w-md mx-auto rounded-lg space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-700">Sites to Block</h2>
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Add a URL to block"
        className="w-full py-2 border border-slate-700 bg-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-slate-700 transition duration-100"
      />
      <div className="mt-4">
        <button
          onClick={addItem}
          className="rounded-lg w-full py-2 text-slate-700 bg-blue-200 hover:bg-blue-100 transition duration-100"
        >
          Add Item
        </button>
      </div>
      <ul className="space-y-2">
        {Array.from(blockedSites).map((site, index) => (
          <li
            key={index}
            className="text-slate-700 flex justify-between items-center p-2 border border-slate-700 bg-blue-200 rounded"
          >
            {site}
            <button
              onClick={() => deleteItem(site)}
              className="rounded-full text-slate-700 bg-blue-200 hover:bg-blue-100 transition duration-100"
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LinkBox;
