import React, { useState, useEffect } from "react";
import { idols } from "../constants";

function saveIdol(id) {
  // Save the selected idol to chrome storage
  chrome.storage.local.set({ idolpic: id }, function() {
    console.log('Image selection saved:', id);
  });
}

function KpopTab() {
  const [activeGroup, setActiveGroup] = useState(null);

  useEffect(() => {
    // Load the saved idol from chrome storage when the component mounts
    chrome.storage.local.get(['idolpic'], function(result) {
      if (result.idolpic) {
        const savedGroup = idols.find(group => group.id === result.idolpic);
        if (savedGroup) {
          setActiveGroup(savedGroup);
        }
      }
    });
  }, []);

  const handleGroupClick = (group) => {
    setActiveGroup(group);
    saveIdol(group.id);
  };

  return (
    <ul className="flex flex-wrap justify-center">
      {idols.map((group) => (
        <li
          key={group.id}
          onClick={() => handleGroupClick(group)}
          className={`cursor-pointer m-2 p-1 ${
            activeGroup && activeGroup.id === group.id ? 'selected-group' : ''
          }`}
        >
          <img
            src={group.icon}
            alt={`group-${group.id}`}
            className={`w-24 h-24 rounded-full border-2 border-gray-300 m-2 transition-transform duration-300 ease-in-out shadow-md ${
              activeGroup && activeGroup.id === group.id ? 'selected-waifu-img' : ''
            }`}
          />
        </li>
      ))}
      
    </ul>
  );
}

export default KpopTab;
