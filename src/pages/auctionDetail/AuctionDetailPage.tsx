import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Col, message, Modal, Row, Skeleton } from "antd";
import { useAccount, useBalance, useBlockNumber, useContract, useContractRead, useNetwork, useProvider, useQuery, useSigner, useSwitchNetwork, useToken } from "wagmi";
import PopDetail from "../../components/PopDetail";
import { AUCTION_CONTRACT_ABI, AUCTION_CONTRACT_ADDRESS, WBNB_ABI, WrappedBNB_CONTRACT_ADDRESS } from "../../contracts";
import { ethers } from "ethers";
import popApi from "../../services/popApi";
import "./AuctionDetailPage.css"
import "../../components/waletButton.css"
import LoadingPage from "../../components/loading/LoadingPage";

const AuctionDetailPage = () => {
  const currentTimeStamp = Date.now();
  const { id }: any = useParams()
  const [loading, setLoading] = useState(false)
  const [WBNBPrice, setWBNBPrice] = useState<any>(null)
  const [isShowModalWBNB, setIsShowModalWBNB] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const { connector: activeConnector, isConnected, address } = useAccount();
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { data: signer } = useSigner()
  const navigate = useNavigate()
  const provider = useProvider()
  // WBNB token
  const balanceWBNB = useBalance({
    address: address,
    token: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  })
  const balance: any = useBalance({
    address: address,

  })
  const { data: auctionId }: any = useContractRead({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: 'getAuctionIdByTokenId',
    args: [id]
  })

  const contractAuction: any = useContract({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    signerOrProvider: signer,
  })

  const wapBNB: any = useContract({
    address: WrappedBNB_CONTRACT_ADDRESS,
    abi: WBNB_ABI,
    signerOrProvider: signer,
  })

  const { data: auctionById } = useContractRead({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: 'getAuctionIdByTokenId',
    args: [id]
  })
  const { data = [], isError, isLoading } = useContractRead({
    address: AUCTION_CONTRACT_ADDRESS,
    abi: AUCTION_CONTRACT_ABI,
    functionName: 'getAuction',
    args: [auctionById]
  })
  const showModalWBNB = async () => {
    if (balanceWBNB?.data?.formatted === "0.0") {
      await handleAddToken()
    }
    setIsShowModalWBNB(true);
  };

  const normalizeData = async (data: any) => {
    const tokenId = data[1].toNumber();
    const endTime = data[7].toNumber();
    const startTime = data[6].toNumber();
    const initialPrice = ethers.utils.formatEther(data[2]);
    const lastBid = ethers.utils.formatEther(data[4]);
    try {
      //fetch token metadata
      const metadata = await popApi.getNftMetaData(tokenId)
      const auctionData = await popApi.getNftAuctionData(auctionId)

      return {
        auctioneer: data[0],
        tokenId: tokenId,
        completed: data[8],
        endTime,
        active: data[9],
        initialPrice,
        lastBid,
        lastBidder: data[5],
        previousBidder: data[3],
        startTime,
        userBidder: auctionData.data[0].bidders,
        ...metadata,

      }
    } catch (err: any) {
      return {
        auctioneer: data[0],
        tokenId: tokenId,
        completed: data[8],
        endTime,
        active: data[9],
        initialPrice,
        lastBid,
        lastBidder: data[5],
        previousBidder: data[3],
        startTime,
        attributes: [],
        description: "",
        image: "/image/placeholder.png",
        title: "Unknown",
        name: "Unknown",
        userBidder: "Unknown"
      }
    }
  }
  //use useQuery to fetch data
  const {
    data: normalizedData,
    isLoading: isNormalizingData,
    isError: isNormalizingDataError,
  }: any = useQuery(['auctionDetail.normalizeData', data], ({ queryKey }) => {
    return normalizeData(queryKey[1])
  })
  const [auctionPrice, setAuctionPrice]: any = useState(normalizedData?.lastBid)
  // dong ho dem nguoc
  const startTime = normalizedData?.startTime;
  const endTime = normalizedData?.endTime;
  const [timeNew, setTimeNew] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = endTime - now;
      const daysLeft = Math.floor(timeLeft / (60 * 60 * 24));
      const hoursLeft = Math.floor((timeLeft % (60 * 60 * 24)) / (60 * 60));
      const minutesLeft = Math.floor((timeLeft % (60 * 60)) / 60);
      const secondsLeft = timeLeft % 60;
      if (timeLeft <= 0) {
        setIsTimeUp(true);
        clearInterval(countdownInterval);
        return;
      }
      setTimeNew({
        days: daysLeft,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
      });
    }, 1000);
    // useEffect clean up function
    return () => {
      window.clearInterval(countdownInterval)
    }
  }, []);

  const handleAddToken = async () => {
    if (window.ethereum) {
      const tokenAddress = '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd';
      const tokenSymbol = balanceWBNB.data?.symbol;
      const tokenDecimals = balanceWBNB.data?.decimals;
      try {
        const wasAdded = await window.ethereum.request({
          // @ts-ignore
          method: 'wallet_watchAsset',
          params: {
            // @ts-ignore
            type: 'ERC20',
            options: {
              address: tokenAddress,
              symbol: tokenSymbol,
              decimals: tokenDecimals,
            },
          },
        });
        if (wasAdded) {
          messageApi.success('Add token successfully');
        } else {
          console.log('Add token failed!');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const joinAuction = async (e: any) => {
    e.preventDefault()
    try {
      if (isNaN(auctionPrice)) {
        messageApi.error('BNB is required!');
        return
      }
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      if (balanceWBNB?.data?.formatted === "0.0") {
        messageApi.error('Please add WBNB');
      }
      if (auctionPrice === normalizedData?.lastBid) {
        messageApi.error('You have not entered the price!');
        return
      }
      if (auctionPrice < (normalizedData?.lastBid * 0.1) + (normalizedData?.lastBid * 1)) {
        messageApi.error('not enough to bid!');
        return
      }
      setLoading(true)
      const allowance = await wapBNB.allowance(address, AUCTION_CONTRACT_ADDRESS)
      const allowanceWBNB = ethers?.utils?.formatEther(allowance)
      if (balanceWBNB.data?.formatted !== allowanceWBNB) {
        const wab = ethers.utils.parseEther("9999999999999999999999")
        const txnWBNB = await wapBNB.approve(AUCTION_CONTRACT_ADDRESS, wab)
        const txReceiptWBNB = await txnWBNB.wait();
      }
      const initialPriceAuction = ethers.utils.parseEther(auctionPrice)
      const txn = await contractAuction.joinAuction(auctionId, initialPriceAuction)
      const txReceipt = await txn.wait();
      messageApi.success('Auction successfully');
      window.location.reload();
    } catch (err: any) {
      console.log(err)
      messageApi.error('Auction failed ');
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
      const txn = await contractAuction.cancelAuction(auctionId)
      const txReceipt = await txn.wait();
      messageApi.success('Stop successfully');
      navigate("/my-nfts")
    } catch (err: any) {
      console.log(err)
      messageApi.error('Stop failed ');
    } finally {
      setLoading(false)
    }
  }
  const finishAuction = async (e: any) => {
    e.preventDefault()
    try {
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      setLoading(true)
      const txn = await contractAuction.finishAuction(auctionId)
      const txReceipt = await txn.wait();
      messageApi.success('Finish successfully');
      navigate("/all-pops")
    } catch (err: any) {
      console.log(err)
      messageApi.error('Finish failed ');
    } finally {
      setLoading(false)
    }
  }

  const wbnb = async (e: any) => {
    e.preventDefault()
    try {
      if (isNaN(WBNBPrice)) {
        messageApi.error('WBNB is required!');
        return
      }
      if (!isConnected) {
        throw new Error("Wallet not connect")
      };
      if (balance?.data?.formatted < WBNBPrice) {
        message.error("Not enough balance")
        return
      };
      setLoading(true)
      const priceWBNB = ethers.utils.parseEther(WBNBPrice)
      const txn = await wapBNB.deposit({ value: priceWBNB })
      const txReceipt = await txn.wait();
    } catch (err: any) {
      console.log(err)
      messageApi.error(' failed ');
    } finally {
      setLoading(false)
    }
  }
  const handleCancel = () => {
    setIsShowModalWBNB(false);
  };
  return (
    <section className="px-20 text-xl pb-4 w-full mb-52">
      
      <div>
        <h2 className="py-5 pb-12 font-bold text-base">Cryptopops | {id}</h2>
        <PopDetail id={id} />
      </div>
      <div className="relative z-10 pt-52">
        <div className=" w-full text-center relative py-10 mt-10">
          {
            normalizedData?.auctioneer === address && isTimeUp === false
              ? <div className='flex justify-center pl-8'>
                <img className='w-10' src='/image/unnamed.png' placeholder='pop' />
                <p className='text-3xl font-bold w-32 border-white'>{normalizedData?.lastBid}</p>
              </div>
              : <div className='flex justify-center pr-6'>
                <img className='w-10 ml-16' src='/image/unnamed.png' placeholder='pop' />
                <input onChange={(e) => setAuctionPrice(e.target.value)} className='text-3xl font-bold mb-0.5 w-32 px-2 ml-2 border-white' value={auctionPrice} type="text" />
              </div>
          }
        </div>
        <p className='text-xl font-bold py-4 text-center pr-7 px-12'>Expiration Date</p>
        <Row gutter={16} className=" text-end justify-end pl-64">
          <Col className="gutter-row bg-black " span={4}>
            <p className='text-white text-center'>{timeNew.days || "0"} </p>
            <p className='text-white text-center'>days</p>
          </Col>
          <Col className="gutter-row bg-black ml-4" span={4}>

            <p className='text-white text-center'>{timeNew.hours || "0"}</p>
            <p className='text-white text-center'>hours</p>

          </Col>
          <Col className="gutter-row bg-black ml-4" span={4}>

            <p className='text-white text-center'>{timeNew.minutes || "0"}</p>
            <p className='text-white text-center'>mins</p>

          </Col>
          <Col className="gutter-row bg-black ml-4" span={4}>
            <p className='text-white text-center'>{timeNew.seconds || "0"}</p>
            <p className='text-white text-center'>secs</p>
          </Col>
        </Row>

        {
          normalizedData?.auctioneer === address
            ?
            <div className="relative">
              {!isTimeUp
                ?
                <div className='py-4 text-end px-56'>
                  <button onClick={finishAuction} disabled={loading} className='bg-colorBuy text-white font-medium px-4 w-3/5 py-4 text-center rounded-md'>{loading ? "FINISH..." : "FINISH"}</button>
                </div>
                : ""}
              <div className='py-4 text-end px-56 '>
                <button onClick={cancelAuction} disabled={loading} className=' bg-colorCancel font-medium px-4 w-3/5 py-4 text-center rounded-md'>{loading ? "CANCEL..." : "CANCEL"}</button>
              </div>
            </div>
            :
            <div className="flex justify-center pl-2">
              <div className='py-4 text-end pl-72 ml-52'>
                <button onClick={joinAuction} disabled={loading} className='bg-colorBuy font-medium px-4 py-4 text-center rounded-md w-button '>{loading ? "BID NOW..." : "BID NOW"}</button>
              </div>
              <div className='py-4 text-end px-2'>
                <button onClick={showModalWBNB} disabled={loading} className='bg-colorBuy font-medium px-4 py-4 text-center rounded-md w-button '>{loading ? "SWAP BNB..." : "SWAP BNB"}</button>
              </div>
            </div>
        }
      </div>
      <h1 className="text-4xl font-medium py-10">Transaction History</h1>
      <div className="py-8">
        <div className="bg-gray-200 rounded-lg flex">
          <p className="px-4 py-2 font-medium w-1/12">Type</p>
          <h2 className="px-4 py-2 font-medium w-full pl-8">Address</h2>
          <p className="px-4 py-2 font-medium w-1/4">Amount (BNB)</p>
        </div>
        {normalizedData?.userBidder?.map((item: any) => (
          <div key={item.bid}>
            <div className="px-4 flex py-2">
              <p className="w-1/12 text-lg">{item.winner === true ? "bid" : "Create" || ""} </p>
              <p className="text-lg w-full pl-7">{item.address || ""}</p>
              <p className="w-1/4 pl-8">{item.bid || ""}</p>
            </div>
            <hr />
          </div>
        ))
        }
      </div>

      <Modal title="SWAP BNB" open={isShowModalWBNB} onCancel={handleCancel} >
        <div className="flex">
          <input onChange={(e) => setWBNBPrice(e.target.value)} className="inputPrice " placeholder="BNB" />
        </div>
        <button disabled={loading} onClick={wbnb} className="button-1 mt-8" role="button">{loading ? "submit..." : "submit"}</button>
      </Modal>
      {contextHolder}
    </section>

  )
}
export default AuctionDetailPage
