import React, { useState, useEffect } from 'react';
import { waifus, idols } from './constants'; // adjust the import path as needed

function getRandomMemberImage(group) {
  const randomIndex = Math.floor(Math.random() * group.members.length);
  return group.members[randomIndex];
}

function BlockedPage() {
  const [activeWaifu, setActiveWaifu] = useState(null);
  const [activeKpop, setActiveKpop] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Load the active tab and waifu or idol ID from chrome storage when the component mounts
    chrome.storage.local.get(['activeTab', 'waifupic', 'idolpic'], function(result) {
      const activeTab = result.activeTab !== undefined ? result.activeTab : 0;
      setActiveTab(activeTab);

      if (activeTab === 0 && result.waifupic !== undefined) {
        const waifuId = result.waifupic;
        const waifu = waifus.find(w => w.id === waifuId);
        setActiveWaifu(waifu);
      } else if (activeTab === 1 && result.idolpic !== undefined) {
        const idolGroup = idols.find(group => group.id === result.idolpic);
        if (idolGroup) {
          const randomMemberImage = getRandomMemberImage(idolGroup);
          setActiveKpop(randomMemberImage);
        }
      }
    });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {activeTab === 0 && activeWaifu && (
        <img src={activeWaifu.icon} alt="Waifu" className="rounded-lg shadow-lg border-2 selected-waifu-img max-h-96" />
      )}
      {activeTab === 1 && activeKpop && (
        <img src={activeKpop} alt="K-pop Idol" className="rounded-lg shadow-lg border-2 selected-waifu-img max-h-96" />
      )}
    </div>
  );
}

export default BlockedPage;
