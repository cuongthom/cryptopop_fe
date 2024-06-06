import React, { useState } from "react";

import {
  ARTWORK_CONTRACT_ABI,
  ARTWORK_CONTRACT_ADDRESS,
} from "../../contracts";
import {
  useAccount,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
  useSigner,
} from "wagmi";
import { ethers, BigNumber } from "ethers";
import { message } from "antd";
import popApi from "../../services/popApi";

const BuyBoxPage = () => {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const { isConnected } = useAccount();
  const {
    data = [],
    isError,
    isLoading,
    refetch,
  }: any = useContractReads({
    contracts: [
      {
        address: ARTWORK_CONTRACT_ADDRESS,
        abi: ARTWORK_CONTRACT_ABI,
        functionName: "blindBoxPrice",
      },
      {
        address: ARTWORK_CONTRACT_ADDRESS,
        abi: ARTWORK_CONTRACT_ABI,
        functionName: "totalSupply",
      },
      {
        address: ARTWORK_CONTRACT_ADDRESS,
        abi: ARTWORK_CONTRACT_ABI,
        functionName: "totalBoxOpened",
      },
    ],
  });
  const boxPrice = data[0] ? ethers.utils.formatEther(data[0]) : 0;
  const totalSupply = data[1] ? data[1].toNumber() : 0;
  const totalBoxOpened = data[2] ? data[2].toNumber() : 0;
  const { config } = usePrepareContractWrite({
    address: ARTWORK_CONTRACT_ADDRESS,
    abi: ARTWORK_CONTRACT_ABI,
    functionName: "buyBlindBox",
    args: [1],
    overrides: {
      value: data[0] || "",
    },
  });
  const { data: item, isSuccess, writeAsync } = useContractWrite(config);
  const handleBuyBox = async () => {
    try {
      setLoading(true);
      if (!writeAsync) return;
      if (!isConnected) return;
      if (totalSupply - totalBoxOpened === 0) {
        messageApi.error("out of box!");
      }
      const tx = await writeAsync();
      const txReceipt = await tx.wait();
      messageApi.success("Buy box successfully");
      await refetch();
    } catch (err: any) {
      console.log(err);
      messageApi.error("Buy box failed " + err.message);
    } finally {
      setLoading(false);
    }
  };
  const { data: signer } = useSigner();
  const getCuong = async () => {
    const mes = "xin chao cuong";
    const body = {
      address: "0x23dFb47f22832aD8e9701F6C9743D2986c5D1CdA",
      merNumber: 1,
      type: "0x23dFb47f22832aD8e9701F6C9743D2986c5D1CdA",
      signature: signer,
      dataThatWasSigned: mes,
    };
    try {
      await popApi.getSigner(body);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section className="px-20 text-xl pb-4">
      <h2 className="py-5 pb-12 font-bold text-base">Cryptopops | Buy box</h2>
      <div className="flex ">
        <div className="w-100 w-1/2">
          <video height="auto" className="m-0 " autoPlay={true} loop={true}>
            <source src="/image/videoPop.90fcae92.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="w-1/2 px-14">
          <p className="text-black font-bold text-4xl">CryptoPop</p>
          <p className="text-black py-8 text-xl">
            Remaining Amount: {totalSupply - totalBoxOpened} / {totalSupply}
          </p>
          <p className="text-black text-xl">Price</p>
          <div className="flex py-4">
            <img className="w-10" src="/image/unnamed.png" />
            <p className="text-black text-3xl px-2 font-bold">{boxPrice} BNB</p>
          </div>
          <div className="text-center bg-black rounded-lg">
            <button
              type="button"
              className="text-white py-2 text-2xl w-full"
              onClick={getCuong}
              disabled={loading}
            >
              {loading ? "BUYING..." : "BUY NOW"}
            </button>
          </div>
        </div>
      </div>
      {contextHolder}
    </section>
  );
};

export default BuyBoxPage;
