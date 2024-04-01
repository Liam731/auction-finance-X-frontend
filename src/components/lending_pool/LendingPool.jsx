import { useState } from "react";
import Button from "../Button";
import Section from "../Section";
import Heading from "../Heading";
import { roadmap } from "../../constants";
import {
  grid,
} from "../../assets";
import Tagline from "../Tagline";
import OperationPool from "./OperationPool";
import UserInfo from "./UserInfo";

const LendingPool = () => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <Section id="lending pool" className="overflow-hidden">
      <div className="container md:pb-10 py-8">
        <Heading tag="Ready to go" title="Let's Stake Your NFTs" />
        <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
  

          <div className="md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] bg-n-9">
            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
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
                <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-10">
                  <Tagline>YOUR STATUS</Tagline>
                  

                </div>
                <UserInfo />
                <h4 className="h4 mb-4">Ready to go</h4>
                {/* <p className="body-2 text-n-4">
                  Allow users to customize the ERC-404's NFT image, making it
                  easier and faster to interact with.
                </p> */}
              </div>
              
            </div>
          </div>
          <div className="md:flex even:md:translate-y p-0.25 rounded-[2.5rem] bg-conic-gradient">
            <div className="relative p-8 bg-n-8 rounded-[2.4375rem] overflow-hidden xl:p-15">
              <OperationPool />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default LendingPool;
