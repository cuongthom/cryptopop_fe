import { useNavigate, useParams } from "react-router-dom";
import React, { useState } from "react";
import { message } from "antd";
import { useAccount, useBalance, useContract, useContractRead, useContractWrite, usePrepareContractWrite, useSigner } from "wagmi";
import { AUCTION_CONTRACT_ABI, AUCTION_CONTRACT_ADDRESS, MARKET_CONTRACT_ABI, MARKET_CONTRACT_ADDRESS } from "../../contracts";
import PopDetail from "../../components/PopDetail";
import "../auctionDetail/AuctionDetailPage.css"

const MarketDetailPage = () => {
  const { id }: any = useParams()
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const { connector: activeConnector, isConnected, address }: any = useAccount();
  const { data: signer } = useSigner()
  const navigate = useNavigate()
  const contractMarket: any = useContract({
    address: MARKET_CONTRACT_ADDRESS,
    abi: MARKET_CONTRACT_ABI,
    signerOrProvider: signer,
  })
  const { data }: any = useContractRead({
    address: MARKET_CONTRACT_ADDRESS,
    abi: MARKET_CONTRACT_ABI,
    functionName: 'listDetail',
    args: [id],
  })
  // BUY NFT
  const handleBuyNft = async (e: any) => {
    e.preventDefault()
    try {
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      if (address === data[0]) {
        messageApi.error("duplicate account");
        return
      }
      setLoading(true)
      const tx = await contractMarket.buyNft(id, data.price, { value: data.price })
      const txReceipt = tx.wait();
      messageApi.success('Buy Nft successfully');
    } catch (err: any) {
      console.log(err)
      messageApi.error('Buy Nft failed ');
    } finally {
      setLoading(false)
    }
  }

  const cancelAuction = async (e: any) => {
    e.preventDefault()
    try {
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      setLoading(true)
      const txn = await contractMarket.unlistNft(id)
      const txReceipt = await txn.wait();
      messageApi.success('Cancel successfully');
      navigate("/my-nfts")
    } catch (err: any) {
      console.log(err)
      messageApi.error('Cancel failed ');
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <section className="px-20 text-xl pb-4 ">
      <h2 className="py-5 pb-12 font-bold text-base">Cryptopops | {id}</h2>
      <PopDetail id={id} />
      <div className="z-10 relative text-end px-48 pb-64" >
        {address === data?.author
          ?
          <div className='py-20 pt-80'>
            <button onClick={cancelAuction} disabled={loading} className='bg-colorCancel px-4 w-3/5 py-4 text-center rounded-md'>{loading ? "Cancel..." : "Cancel"}</button>
          </div>
          :
          <div className='py-20 pt-80'>
            <button onClick={handleBuyNft} disabled={loading} className='bg-colorBuy px-4 w-3/5 py-4 text-center rounded-md'>{loading ? "BUY NOW..." : "BUY NOW"}</button>
          </div>
        }
      </div>
      {contextHolder}
    </section>
  )
}

export default MarketDetailPage
