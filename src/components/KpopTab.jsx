import React, { useState, useEffect } from "react";
import { idols } from "../constants";

function saveIdolSettings(id, selectedMembers, allSelections) {
  // Update the selections for this group
  const newSelections = {
    ...allSelections,
    [id]: selectedMembers
  };
  
  chrome.storage.local.set({ 
    idolpic: id,
    selectedMembers: selectedMembers,
    memberSelections: newSelections // Store all group selections
  }, function() {
    console.log('Settings saved:', { id, selectedMembers, allSelections: newSelections });
  });
}

function getMemberName(memberSrc) {
  // Extract name from the image path by first splitting by .jpeg
  const nameWithHash = memberSrc.split('.jpeg')[0].split('/').pop();
  // Take everything before the first dash (if it exists)
  const name = nameWithHash.split('-')[0];

  // Special cases for BTS members
  if (name.toLowerCase() === 'rm') {
    return 'RM';
  }
  if (name.toLowerCase() === 'jhope') {
    return 'J-Hope';
  }

  // Default case: Capitalize first letter and add spaces before capitals
  return name
    .split('')
    .map((char, idx) => idx === 0 ? char.toUpperCase() : char)
    .join('')
    .replace(/([A-Z])/g, ' $1').trim(); // Add space before capitals for names like "HueningKai"
}

function KpopTab() {
  const [activeGroup, setActiveGroup] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSelections, setMemberSelections] = useState({}); // Store all group selections

  useEffect(() => {
    // Load saved selections and active group
    chrome.storage.local.get(['idolpic', 'memberSelections'], function(result) {
      // Load all group selections
      if (result.memberSelections) {
        setMemberSelections(result.memberSelections);
      }
      
      if (result.idolpic) {
        const savedGroup = idols.find(group => group.id === result.idolpic);
        if (savedGroup) {
          setActiveGroup(savedGroup);
          // Use the saved selection for this group, or default to all members
          const savedSelection = result.memberSelections?.[savedGroup.id] || 
            Array.from({ length: savedGroup.members.length }, (_, i) => i);
          setSelectedMembers(savedSelection);
        }
      }
    });
  }, []);

  const handleGroupClick = (group) => {
    setActiveGroup(group);
    
    // Use existing selection for this group or default to all members
    const existingSelection = memberSelections[group.id];
    const newSelection = existingSelection || 
      Array.from({ length: group.members.length }, (_, i) => i);
    
    setSelectedMembers(newSelection);
    saveIdolSettings(group.id, newSelection, memberSelections);
  };

  const handleMemberToggle = (index) => {
    setSelectedMembers(prev => {
      const newSelection = prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
      
      // Update both local state and storage
      setMemberSelections(current => {
        const newSelections = {
          ...current,
          [activeGroup.id]: newSelection
        };
        
        // Save to storage immediately
        chrome.storage.local.set({ 
          idolpic: activeGroup.id,
          selectedMembers: newSelection,
          memberSelections: newSelections
        });
        
        return newSelections;
      });
      
      return newSelection;
    });
  };

  return (
    <div className="flex flex-col items-center">
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

      {activeGroup && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-semibold mb-3 text-center">{activeGroup.name} Members</h3>
          <div className="grid grid-cols-2 gap-3">
            {activeGroup.members.map((member, index) => (
              <label key={index} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-200 rounded">
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(index)}
                  onChange={() => handleMemberToggle(index)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span className="text-sm font-medium">{getMemberName(member.toString())}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default KpopTab;
