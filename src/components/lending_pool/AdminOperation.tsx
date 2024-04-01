import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONFIG } from "../../config";
import { usePrepareContractWrite } from "wagmi";
import { useContractWrite } from "wagmi";
import FakeNftOracle from "../abis/FakeNftOracle.json";
export default function AdminOperation() {
  // Get NFT floor price
  const [nftFloorPrice, setNftFloorPrice] = useState<Number>(0);
  async function latestRoundData() {
    try {
      const web3 = new Web3(
        "https://mainnet.infura.io/v3/944d422c26d44000988fc92104bf51b8"
      );
      const aggregatorV3InterfaceABI = [
        {
          inputs: [],
          name: "latestAnswer",
          outputs: [{ internalType: "int256", name: "", type: "int256" }],
          stateMutability: "view",
          type: "function",
        },
      ];
      const addr = "0x352f2Bc3039429fC2fe62004a1575aE74001CfcE";
      const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);

      const latestAnswer = await priceFeed.methods.latestAnswer().call();
      const nftFloorPrice = Number(latestAnswer);

      console.log("NFT floor price", nftFloorPrice);
      setNftFloorPrice(nftFloorPrice);
    } catch (error) {
      console.error("Error fetching latest round data:", error);
    }
  }

  useEffect(() => {
    latestRoundData();
  }, []);

  // Set NFT floor price
  const { config: setPriceConfig } = usePrepareContractWrite({
    address: CONFIG.ORACLE_CONTRACT_ADDRESS,
    abi: FakeNftOracle,
    functionName: "setLatestPrice",
    args: [nftFloorPrice],
  });
  const { write: setPriceWrite } = useContractWrite(setPriceConfig);

  return (
    <div>
      <div className="border-2 flex justify-between items-center px-10 py-4 mx-52 bg-gradient-to-r from-blue-900 to-block-500 rounded-lg mt-10">
        <p>NFT Floor Price = {(Number(nftFloorPrice)/10**18).toString()} </p>
        <button
          disabled={!setPriceWrite}
          onClick={() => setPriceWrite?.()}
          className="bg-teal-600 hover:bg-teal-700 rounded-lg px-5 py-3 text-2xl ml-96"
        >
          setNftFloorPrice
        </button>
      </div>
    </div>
  );
}
