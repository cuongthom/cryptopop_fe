import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { Button, Col, Modal, Row, message } from "antd";
import { useAccount, useContract, useSigner } from "wagmi";
import {
  ARTWORK_CONTRACT_ABI,
  ARTWORK_CONTRACT_ADDRESS,
  AUCTION_CONTRACT_ABI,
  AUCTION_CONTRACT_ADDRESS,
  MARKET_CONTRACT_ABI,
  MARKET_CONTRACT_ADDRESS
} from "../../contracts";
import './style.css'
import PopDetail from "../../components/PopDetail";
import { BigNumber, ethers } from "ethers";
import { DatePicker, Space, Skeleton } from 'antd';
import type { DatePickerProps, RangePickerProps } from 'antd/es/date-picker';
import BuyBoxPage from "../buyBox/BuyBoxPage";
import "../auctionDetail/AuctionDetailPage.css"

const PopDetailPage = () => {
  const navigate = useNavigate()
  const { id }: any = useParams()
  const [price, setPrice] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const { isConnected, address }: any = useAccount();
  const [startTime, setStartTime] = useState<any>(null)
  const [endTime, setEndTime] = useState<any>(null)
  const [isModalOpenMarket, setIsModalOpenMarket] = useState(false);
  const [isModalOpenAuction, setIsModalOpenAuction] = useState(false);
  const { RangePicker } = DatePicker;
  const { data: signer, isError, isLoading } = useSigner()
  const contractArtWork: any = useContract({
    address: ARTWORK_CONTRACT_ADDRESS,
    abi: ARTWORK_CONTRACT_ABI,
    signerOrProvider: signer,
  })
  const contractMarket: any = useContract({
    address: MARKET_CONTRACT_ADDRESS,
    abi: MARKET_CONTRACT_ABI,
    signerOrProvider: signer,
  })
  const contractAuction: any = useContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    signerOrProvider: signer,
  })
  const handleListNftToMarket = async (e: any) => {
    e.preventDefault()
    try {
      if (isNaN(price)) {
        messageApi.error('BNB is required!');
        return
      }
      if (price <= 0) {
        messageApi.error('BNB is required!');
        return
      }
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      if (!price) {
        throw new Error("Did not enter the price")
      };
      setLoading(true)
      const isApproveForAll = await contractArtWork.isApprovedForAll(address, MARKET_CONTRACT_ADDRESS)
      if (!isApproveForAll) {
        const setApprove = await contractArtWork.setApprovalForAll(MARKET_CONTRACT_ADDRESS, true)
        const txReceipt = await setApprove.wait();
        console.log(txReceipt);
      }
      const priceWei = ethers.utils.parseEther(price)
      const txn = await contractMarket.listNft(id, priceWei)
      const txReceipt = await txn.wait();
      messageApi.success('List Nft successfully');
      navigate("/all-pops?tab=market")
    } catch (err: any) {
      console.log(err)
      messageApi.error('List Nft failed ');
    } finally {
      setLoading(false)
    }
  }
  const handleListAuction = async (e: any) => {
    e.preventDefault()
    try {
      if (isNaN(price)) {
        messageApi.error('BNB is required!');
        return
      }
      if (startTime <= Date.now() / 1000) {
        messageApi.error('start time must be less than now at!');
        return
      }
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      setLoading(true)
      const isApprove = await contractArtWork.getApproved(id)
      if (isApprove === "0x0000000000000000000000000000000000000000") {
        const setApprove = await contractArtWork.approve(AUCTION_CONTRACT_ADDRESS, id)
        const txReceipt = await setApprove.wait();
        console.log(txReceipt);
      }
      const initialPricePop = ethers.utils.parseEther(price)
      const txn = await contractAuction.createAuction(id, initialPricePop, startTime, endTime)
      const txReceipt = await txn.wait();
      messageApi.success('List nft auction successfully');
      navigate("/all-pops?tab=auction")
    } catch (err: any) {
      console.log(err)
      messageApi.error('List Nft failed ');
    } finally {
      setLoading(false)
    }
  }
  const onChange = (
    value: DatePickerProps['value'] | RangePickerProps['value'],
    dateString: [string, string] | string,
  ) => {
    const dateStartTime: any = new Date(dateString[0]);
    const unixTimestampStartTime: any = Math.floor(dateStartTime.getTime() / 1000);
    const dateEndTime: any = new Date(dateString[1]);
    const unixTimestampEndTime: any = Math.floor(dateEndTime.getTime() / 1000);
    const timestampBigNumberStartTime = unixTimestampStartTime.toString()
    const timestampBigNumberEndTime = unixTimestampEndTime.toString()
    setStartTime(timestampBigNumberStartTime)
    setEndTime(timestampBigNumberEndTime)
  };


  const showModalMarket = () => {
    setIsModalOpenMarket(true);
  };
  const showModalAuction = () => {
    setIsModalOpenAuction(true);
  };

  const handleOk = () => {
    setIsModalOpenMarket(false);
  };
  const handleCancel = () => {
    setIsModalOpenMarket(false);
    setIsModalOpenAuction(false);
  };
  return (
    <section className="px-20 text-xl pb-4 ">
      <h2 className="py-5 pb-12 font-bold text-base">Cryptopops | {id}</h2>
      <PopDetail id={id} />
      <div className="z-10 relative pt-80 py-8 flex justify-center">
        <div className='px-2 text-center pl-56'>
          <button onClick={showModalMarket} disabled={loading} className='bg-colorBuy text-white px-4 py-2 rounded-md'>{loading ? "LIST TO MARKET..." : "LIST TO MARKET"}</button>
        </div>
        <div className=''>
          <button onClick={showModalAuction} disabled={loading} className='bg-colorBuy text-white px-4 py-2 text-center rounded-md'>{loading ? "LIST TO AUCTION..." : "LIST TO AUCTION"}</button>
        </div>
      </div>
      <Modal className="bt-none" title="Market Modal" open={isModalOpenMarket} onCancel={handleCancel} >
        <div className="flex">
          <input onChange={(e) => setPrice(e.target.value)} className="inputPrice " placeholder="BNB" />
        </div>
        <button disabled={loading} onClick={handleListNftToMarket} className="button-1 mt-8" role="button">{loading ? "submit..." : "submit"}</button>
      </Modal>
      <Modal title="Auction Modal" open={isModalOpenAuction} onCancel={handleCancel} >
        <div className="flex py-4" >

          <input placeholder="BNB" onChange={(e) => setPrice(e.target.value)} value={price} className="text-base px-2 focus:outline-none border-zinc-300 rounded-md border mr-2 py-1.5" />
        </div>
        <div className="py-6">
          <Space direction="vertical" size={12}>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              onChange={onChange}
            />
          </Space>
        </div>
        <button disabled={loading} onClick={handleListAuction} className="button-1" role="button">{loading ? "submit..." : "submit"}</button>
      </Modal>
      {contextHolder}
    </section>
  )
}
export default PopDetailPage
