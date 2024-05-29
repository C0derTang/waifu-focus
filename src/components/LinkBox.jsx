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
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Sites to Block</h2>
      <input
        type="text"
        value={url}
        onChange={handleInputChange}
        placeholder="Add a URL to block"
        className="border border-gray-300 p-2 rounded w-full"
      />
      <button
        onClick={addItem}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Add Item
      </button>
      <ul className="list-disc pl-5">
        {Array.from(blockedSites).map((site, index) => (
          <li key={index} className="flex justify-between items-center">
            {site}{" "}
            <button
              onClick={() => deleteItem(site)}
              className="text-red-500"
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
