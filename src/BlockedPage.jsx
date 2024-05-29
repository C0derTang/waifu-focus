import React, { useState, useEffect } from 'react';
import { waifus } from './constants'; // adjust the import path as needed

function BlockedPage() {
  const [activeWaifu, setActiveWaifu] = useState(null);

  useEffect(() => {
    // Load the saved waifu ID from chrome storage when the component mounts
    chrome.storage.local.get(['waifupic'], function(result) {
      if (result.waifupic !== undefined) {
        const waifuId = result.waifupic;
        const waifu = waifus.find(w => w.id === waifuId);
        setActiveWaifu(waifu);
      }
    });
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      {activeWaifu && (
        <img src={activeWaifu.icon} alt="Waifu" className="rounded-lg shadow-lg border-2 selected-waifu-img max-h-96" />
      )}
    </div>
  );
}

export default BlockedPage;
