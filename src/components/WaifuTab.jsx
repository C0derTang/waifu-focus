import { useState, useEffect } from "react";
import { waifus } from "../constants";

function saveWaifu(id) {
  /*
    whenever user changes their waifu selection, this will be called
    it will log which waifu they changed it to
    it also updates the local storage
  */
 
  // Save the selected waifu to chrome storage
  chrome.storage.local.set({ waifupic: id }, function() {
    console.log('Image selection saved:', id);
  });
}

function WaifuTab() {
  const [activeWaifu, setActiveWaifu] = useState(null);

  useEffect(() => {
    // Load the saved waifu from chrome storage when the component mounts
    chrome.storage.local.get(['waifupic'], function(result) {
      if (result.waifupic) {
        setActiveWaifu(result.waifupic);
      }
    });
  }, []);

  return (
    <ul className="flex flex-wrap justify-center">
      {waifus.map((waifu) => (
        <li
          key={waifu.id}
          onClick={() => { setActiveWaifu(waifu.id); saveWaifu(waifu.id); }}
          className={`cursor-pointer m-2 p-1 ${
            activeWaifu === waifu.id ? 'selected-waifu' : ''
          }`}
        >
          <img
            src={waifu.icon}
            alt={`waifu-${waifu.id}`}
            className={`w-24 h-24 rounded-full border-2 border-gray-300 m-2 transition-transform duration-300 ease-in-out shadow-md ${
              activeWaifu === waifu.id ? 'selected-waifu-img' : ''
            }`}
          />
        </li>
      ))}
    </ul>
  );
}

export default WaifuTab;
