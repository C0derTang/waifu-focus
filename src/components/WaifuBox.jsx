import { useState } from "react";

import WaifuTab from "./WaifuTab";

function WaifuBox() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <>
      <h1 className=" mt-10 text-center text-4xl">
        {activeTab === 0 && "Waifu Focus"}
        {activeTab === 1 && "K-pop Focus"}
        {activeTab === 2 && "Your Focus"}
      </h1>
      <div className="w-full max-w-md mx-auto mt-10">
        <div className="flex border-b border-gray-300">
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 0 ? "border-b-2 border-blue-500 text-blue-500" : ""
            }`}
            onClick={() => handleTabClick(0)}
          >
            Waifu
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 1 ? "border-b-2 border-blue-500 text-blue-500" : ""
            }`}
            onClick={() => handleTabClick(1)}
          >
            K-pop
          </div>
          <div
            className={`px-4 py-2 cursor-pointer ${
              activeTab === 2 ? "border-b-2 border-blue-500 text-blue-500" : ""
            }`}
            onClick={() => handleTabClick(2)}
          >
            Custom
          </div>
        </div>
        <div className="p-4 border border-gray-300">
          {activeTab === 0 && <WaifuTab/>}
          {activeTab === 1 && <div>Coming Soon!</div>}
          {activeTab === 2 && <div>Coming Soon!</div>}
        </div>
      </div>
    </>
  );
}

export default WaifuBox;
