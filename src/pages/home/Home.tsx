import Information from "../../components/information/Information";
import OverallStats from "../../components/overallStats/OverallStats";
import LargestSales from "../../components/largestSales/LargestSales";
import RecentTransactions from "../../components/recentTransactions/RecentTransactions";
import DetailsFAQ from "../../components/detailsFAQ/DetailsFAQ";
import { Col, Row } from 'antd'
import React from 'react'
import { useContractReads, useQuery } from 'wagmi'
import { AUCTION_CONTRACT_ABI, AUCTION_CONTRACT_ADDRESS } from '../../contracts'
import { ethers } from 'ethers'
import popApi from '../../services/popApi'
import { AddressMini } from '../../utils'
import { Link } from 'react-router-dom'
import appRoutes from '../../routes'
const HomePage = () => {
  const { data: listData = [], isError, isLoading, refetch }: any = useContractReads({
    contracts: [
      {
        address: AUCTION_CONTRACT_ADDRESS,
        abi: AUCTION_CONTRACT_ABI,
        functionName: 'getAllAuction',
      },
    ],
  })

  const normalizeData = async (data: any) => {
    const auctionNft = data[0] || [];
    const activeAuctions = auctionNft.filter((item: any) => item[9] === true);
    const listAuctions = await Promise.all(activeAuctions.map(async (item: any) => {
      const tokenId = item[1].toNumber();
      const endTime = item[7].toNumber();
      const startTime = item[6].toNumber();
      const initialPrice = ethers.utils.formatEther(item[2]);
      const lastBid = ethers.utils.formatEther(item[4]);
      //fetch token metadata
      try {
        const metadata = await popApi.getNftMetaData(tokenId);
        return {
          auctioneer: item[0],
          tokenId: tokenId,
          completed: item[8],
          endTime,
          active: item[9],
          initialPrice,
          lastBid,
          lastBidder: item[5],
          previousBidder: item[3],
          startTime,
          ...metadata,
        }
      } catch (err: any) {
        return {
          auctioneer: item[0],
          tokenId: tokenId,
          completed: item[8],
          endTime,
          active: item[9],
          initialPrice,
          lastBid,
          lastBidder: item[5],
          previousBidder: item[3],
          startTime,
          attributes: [],
          description: "",
          image: "/image/placeholder.png",
          title: "Unknown",
          name: "Unknown",
        }
      }
    }))

    return { listAuctions }
  }

  const {
    data: normalizedData,
    isLoading: isNormalizingLoading,
    isError: isNormalizingDataError,
  } = useQuery(['allPops.data', listData], ({ queryKey }) => {
    return normalizeData(queryKey[1])
  })

  return (
    <>
      <img src="/image/banner.06d067e1.png" />
      <section className="px-16">
        <Information />
        <OverallStats />
        <div>
          <LargestSales normalizedData={normalizedData}/>
          <RecentTransactions normalizedData={normalizedData}/>
          <DetailsFAQ/>
        </div>
      </section>
    </>
  );
};
export default HomePage;


