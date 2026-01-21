import { useState, useEffect } from "react";
import { safeStorage } from "../utils/chromePolyfill";
import WaifuTab from "./WaifuTab";
import KpopTab from "./KpopTab";
import CustomTab from "./CustomTab";

const colors = [
  { name: 'pastel-pink', glow: '#ff5783', bg: '#FFD1DC', text: '#D84C75' },
  { name: 'pastel-blue', glow: '#57a0ff', bg: '#A7C7E7', text: '#4B8CD4' },
  { name: 'pastel-green', glow: '#57ff7e', bg: '#B5D6B2', text: '#4CAF50' },
  { name: 'pastel-purple', glow: '#a957ff', bg: '#D7BDE2', text: '#9B59B6' },
  { name: 'pastel-yellow', glow: '#fff157', bg: '#FFF1B5', text: '#D4B400' },
];

function WaifuBox() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    // Load the active tab and color from storage when the component mounts
    safeStorage.get(['activeTab', 'selectedColor'], function (result) {
      if (result.activeTab !== undefined) {
        setActiveTab(result.activeTab);
      }
      if (result.selectedColor !== undefined) {
        const savedColor = colors.find(c => c.name === result.selectedColor.name);
        if (savedColor) {
          setSelectedColor(savedColor);
        }
      }
    });

    // Apply the colors to the body and update CSS variables
    document.body.style.backgroundColor = selectedColor.bg;
    document.documentElement.style.setProperty('--glow-color', selectedColor.glow);
    document.documentElement.style.setProperty('--text-color', selectedColor.text);
  }, [selectedColor]);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    // Save the active tab to storage
    safeStorage.set({ activeTab: tabIndex }, function () {
      console.log('Active tab saved:', tabIndex);
    });
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    // Save the selected color to storage
    safeStorage.set({ selectedColor: color }, function () {
      console.log('Color saved:', color);
    });
  };

  return (
    <div className="pb-5">
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/90 p-4 rounded-lg shadow-lg z-50">
        <h3 className="text-sm font-bold mb-3 text-slate-700">Theme Colors</h3>
        <div className="flex flex-col gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              className="flex items-center gap-2 group"
              onClick={() => handleColorSelect(color)}
            >
              <div
                style={{ backgroundColor: color.bg }}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 group-hover:scale-110 ${selectedColor.name === color.name ? 'border-current scale-110' : 'border-gray-300'
                  }`}
              />
              <span
                className="text-sm font-medium text-slate-600 transition-all duration-300"
              >
                {color.name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </button>
          ))}
        </div>
      </div>
      <h1 className="mt-10 text-center text-4xl transition-all duration-300">
        {activeTab === 0 && "Waifu Focus"}
        {activeTab === 1 && "K-pop Focus"}
        {activeTab === 2 && "Your Focus"}
      </h1>
      <div className="w-full max-w-md mx-auto mt-10  p-4 rounded-lg">
        <div className="flex border-b border-blue-500">
          <div
            className={`px-4 py-2 cursor-pointer ${activeTab === 0
              ? "border-b-2 "
              : "text-slate-800"
              } hover:text-blue-500 transition-colors`}
            onClick={() => handleTabClick(0)}
          >
            Waifu
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${activeTab === 1
              ? "border-b-2 "
              : "text-slate-800"
              } hover:text-slate-500 transition-colors`}
            onClick={() => handleTabClick(1)}
          >
            K-pop
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${activeTab === 2
              ? "border-b-2 border-slate-500 text-slate-500"
              : "text-slate-800"
              } hover:text-slate-500 transition-colors`}
            onClick={() => handleTabClick(2)}
          >
            Custom
          </div>
        </div>
        <div className="border rounded-b-lg">
          {activeTab === 0 && <WaifuTab />}
          {activeTab === 1 && <KpopTab />}
          {activeTab === 2 && <CustomTab />}
        </div>
      </div>
    </div>
  );
}

export default WaifuBox;
