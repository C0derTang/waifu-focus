import React, { useState, useEffect } from 'react';
import { waifus, idols } from './constants';

function getRandomMemberImage(group, selectedMembers) {
  // If no members are selected, return the group icon
  if (!selectedMembers || selectedMembers.length === 0) {
    return group.icon;
  }
  // Get a random index from the selected members array
  const randomSelectedIndex = Math.floor(Math.random() * selectedMembers.length);
  const memberIndex = selectedMembers[randomSelectedIndex];
  return group.members[memberIndex];
}

function BlockedPage() {
  const [activeWaifu, setActiveWaifu] = useState(null);
  const [activeKpop, setActiveKpop] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [customImage, setCustomImage] = useState(null);

  useEffect(() => {
    // Load the selected color and apply it
    chrome.storage.local.get(['selectedColor'], function(result) {
      if (result.selectedColor) {
        setSelectedColor(result.selectedColor);
        document.body.style.backgroundColor = result.selectedColor.bg;
        document.documentElement.style.setProperty('--glow-color', result.selectedColor.glow);
        document.documentElement.style.setProperty('--text-color', result.selectedColor.text);
      }
    });

    // Load the active tab, waifu or idol ID, and selected members from chrome storage
    chrome.storage.local.get(
      ['activeTab', 'waifupic', 'idolpic', 'selectedMembers', 'custompic'],
      function(result) {
        const activeTab = result.activeTab !== undefined ? result.activeTab : 0;
        setActiveTab(activeTab);

        if (activeTab === 0 && result.waifupic !== undefined) {
          const waifuId = result.waifupic;
          const waifu = waifus.find(w => w.id === waifuId);
          setActiveWaifu(waifu);
        } else if (activeTab === 1 && result.idolpic !== undefined) {
          const idolGroup = idols.find(group => group.id === result.idolpic);
          if (idolGroup) {
            const randomMemberImage = getRandomMemberImage(
              idolGroup, 
              result.selectedMembers
            );
            setActiveKpop(randomMemberImage);
          }
        } else if (activeTab === 2 && result.custompic) {
          setCustomImage(result.custompic);
        }
      }
    );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {activeTab === 0 && activeWaifu && (
        <img 
          src={activeWaifu.icon} 
          alt="Waifu" 
          className="rounded-lg shadow-lg border-2 max-h-96 transition-all duration-300"
          style={{
            borderColor: selectedColor?.text || '#4B8CD4',
            boxShadow: `0 0 15px ${selectedColor?.glow || '#57a0ff'}`
          }}
        />
      )}
      {activeTab === 1 && activeKpop && (
        <img 
          src={activeKpop} 
          alt="K-pop Idol" 
          className="rounded-lg shadow-lg border-2 max-h-96 transition-all duration-300"
          style={{
            borderColor: selectedColor?.text || '#4B8CD4',
            boxShadow: `0 0 15px ${selectedColor?.glow || '#57a0ff'}`
          }}
        />
      )}
      {activeTab === 2 && customImage && (
        <img
          src={customImage}
          alt="Custom Image"
          className="rounded-lg shadow-lg border-2 max-h-96 transition-all duration-300"
          style={{
            borderColor: selectedColor?.text || '#4B8CD4',
            boxShadow: `0 0 15px ${selectedColor?.glow || '#57a0ff'}`
          }}
        />
      )}
    </div>
  );
}

export default BlockedPage;
