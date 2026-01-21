import React, { useState, useEffect } from "react";
import { safeStorage } from "../utils/chromePolyfill";
import { idols } from "../constants";

function saveIdolSettings(id, selectedMembers, allSelections) {
  // Update the selections for this group
  const newSelections = {
    ...allSelections,
    [id]: selectedMembers
  };

  safeStorage.set({
    idolpic: id,
    selectedMembers: selectedMembers,
    memberSelections: newSelections // Store all group selections
  }, function () {
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
    safeStorage.get(['idolpic', 'memberSelections'], function (result) {
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
        safeStorage.set({
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
            className={`cursor-pointer m-2 p-1 ${activeGroup && activeGroup.id === group.id ? 'selected-group' : ''
              }`}
          >
            <img
              src={group.icon}
              alt={`group-${group.id}`}
              className={`w-24 h-24 rounded-full border-2 border-gray-300 m-2 transition-transform duration-300 ease-in-out shadow-md ${activeGroup && activeGroup.id === group.id ? 'selected-waifu-img' : ''
                }`}
            />
          </li>
        ))}
      </ul>

      {activeGroup && (
        <div className="mt-8 w-full max-w-lg">
          <div className="glass-panel p-6 rounded-2xl soft-shadow border border-pink-100 bg-white/60">
            <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              {activeGroup.name} Members
            </h3>

            <div className="flex flex-wrap gap-2 justify-center">
              {activeGroup.members.map((member, index) => {
                const isSelected = selectedMembers.includes(index);
                return (
                  <button
                    key={index}
                    onClick={() => handleMemberToggle(index)}
                    className={`
                      group relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ease-out
                      flex items-center gap-2 border
                      ${isSelected
                        ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-transparent shadow-lg shadow-pink-200 scale-105'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-pink-200 hover:bg-pink-50/50'
                      }
                    `}
                  >
                    <div className={`
                      w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300
                      ${isSelected ? 'bg-white text-pink-500' : 'bg-slate-100 text-transparent group-hover:bg-white'}
                    `}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {getMemberName(member.toString())}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-center">
              <span className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-50 rounded-full">
                {selectedMembers.length} selected
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default KpopTab;
