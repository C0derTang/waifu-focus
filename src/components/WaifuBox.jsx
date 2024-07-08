import { useState, useEffect } from "react";
import WaifuTab from "./WaifuTab";
import KpopTab from "./KpopTab";

function WaifuBox() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Load the active tab from chrome storage when the component mounts
    chrome.storage.local.get(['activeTab'], function(result) {
      if (result.activeTab !== undefined) {
        setActiveTab(result.activeTab);
      }
    });
  }, []);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    // Save the active tab to chrome storage
    chrome.storage.local.set({ activeTab: tabIndex }, function() {
      console.log('Active tab saved:', tabIndex);
    });
  };

  return (
    <div className="bg-gray-900 pb-5">
      <h1 className="mt-10 text-center text-4xl text-neon-pink font-bold">
        {activeTab === 0 && "Waifu Focus"}
        {activeTab === 1 && "K-pop Focus"}
        {activeTab === 2 && "Your Focus"}
      </h1>
      <div className="w-full max-w-md mx-auto mt-10 bg-gray-800 p-4 rounded-lg pinkglow">
        <div className="flex border-b border-neon-pink">
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 0
                ? "border-b-2 border-neon-pink text-neon-pink"
                : "text-white"
            } hover:text-neon-pink transition-colors`}
            onClick={() => handleTabClick(0)}
          >
            Waifu
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 1
                ? "border-b-2 border-neon-pink text-neon-pink"
                : "text-white"
            } hover:text-neon-pink transition-colors`}
            onClick={() => handleTabClick(1)}
          >
            K-pop
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 2
                ? "border-b-2 border-neon-pink text-neon-pink"
                : "text-white"
            } hover:text-neon-pink transition-colors`}
            onClick={() => handleTabClick(2)}
          >
            Custom
          </div>
        </div>
        <div className="border border-neon-pink bg-gray-700 rounded-b-lg">
          {activeTab === 0 && <WaifuTab />}
          {activeTab === 1 && <KpopTab />}
          {activeTab === 2 && <div className="text-white">Coming Soon!</div>}
        </div>
      </div>
    </div>
  );
}

export default WaifuBox;
