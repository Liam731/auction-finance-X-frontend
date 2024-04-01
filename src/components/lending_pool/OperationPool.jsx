import { useState } from "react";
import Button from "../Button";
import Section from "../Section";
import Heading from "../Heading";
import { roadmap } from "../../constants";
import { grid, curve } from "../../assets";
import { Gradient } from "../design/Roadmap";
import Tagline from "../Tagline";
import Mint from "./Mint";
import CollateralStaking from "./CollateralStaking";
import Repay from "./Repay";
import Redeem from "./Redeem";
import Liquidate from "./Liquidate";


const OperationPool = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div>
      <div className="absolute top-0 left-0 max-w-full">
        <img
          className="w-full"
          src={grid}
          width={550}
          height={550}
          alt="Grid"
        />
      </div>
      <div className="relative z-1">
        <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-5">
          <Tagline>POOL</Tagline>
        </div>
        {/* Tabs */}
        <div
          className="-mb-px flex space-x-8 px-4"
          aria-orientation="horizontal"
          role="tablist"
        >
          <button
            className={`flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium ${
              activeTab === 1
                ? "border-purple-500 text-white "
                : "border-transparent text-white"
            }`}
            onClick={() => handleTabClick(1)}
            role="tab"
            type="button"
          >
            MINT
          </button>
          <button
            className={`flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium ${
              activeTab === 2
                ? "border-purple-500 text-white"
                : "border-transparent text-white"
            }`}
            onClick={() => handleTabClick(2)}
            role="tab"
            type="button"
          >
            STAKE
          </button>
          <button
            className={`flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium ${
              activeTab === 3
                ? "border-purple-500 text-white"
                : "border-transparent text-white"
            }`}
            onClick={() => handleTabClick(3)}
            role="tab"
            type="button"
          >
            REPAY
          </button>
          <button
            className={`flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium ${
              activeTab === 4
                ? "border-purple-500 text-white"
                : "border-transparent text-white"
            }`}
            onClick={() => handleTabClick(4)}
            role="tab"
            type="button"
          >
            REDEEM
          </button>
          <button
            className={`flex-1 whitespace-nowrap border-b-2 px-1 py-4 text-base font-medium ${
              activeTab === 5
                ? "border-purple-500 text-white"
                : "border-transparent text-white"
            }`}
            onClick={() => handleTabClick(5)}
            role="tab"
            type="button"
          >
            LIQUIDATE
          </button>
        </div>
        {/* Tabpanels */}
        <div role="tabpanel">
          {activeTab === 1 && (
            <div className="my-20">
              <Mint />
            </div>
          )}
          {activeTab === 2 && (
            <div className="">
              <CollateralStaking />
            </div>
          )}
          {activeTab === 3 && (
            <div className="my-5">
              <Repay />
            </div>
          )}
          {activeTab === 4 && (
            <div className="my-5">
              <Redeem />
            </div>
          )}
          {activeTab === 5 && (
            <div className="my-5">
              <Liquidate />
            </div>
          )}
        </div>
        {/* Content */}
        <div className="mb-10 -my-10 -mx-15">
          {/* <Mint /> */}
          <img
            className="w-full py-16"
            src={curve}
            width={628}
            height={426}
            alt="application"
          />
        </div>
        <h4 className="h4 mb-4">Ready, set, go!</h4>
        {/* <p className="body-2 text-n-4">
          Allow users to customize the ERC-404's NFT image, making it easier and
          faster to interact with.
        </p> */}
      </div>
    </div>
  );
};

export default OperationPool;
