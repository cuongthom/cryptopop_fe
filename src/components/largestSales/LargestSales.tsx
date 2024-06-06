import { Col, Row } from 'antd'
import React from 'react'
import { useContractReads, useQuery } from 'wagmi'
import { AUCTION_CONTRACT_ABI, AUCTION_CONTRACT_ADDRESS } from '../../contracts'
import { ethers } from 'ethers'
import popApi from '../../services/popApi'
import { AddressMini } from '../../utils'
import { Link } from 'react-router-dom'
import appRoutes from '../../routes'
import '../recentTransactions/RecentTransaction.css'
function LargestSales({normalizedData} :any) {

  return (
    <div>
      <div>
        <p className="pt-6 text-3xl font-bold">Largest Sales</p>
        <p className="textBlue text-xl font-medium">See all top sales</p>
      </div>

      <Row gutter={{ xs: 4, lg: 8, xl: 16, xxl: 20 }} className="py-10">
        {normalizedData?.listAuctions.filter((index: any) => index.name !== "Unknown").map((item: any) => (
          <Col className="gutter-row mr-2" span={4}>
            <Link to={appRoutes.auctionDetail.getPath(item.tokenId)} onClick={() => window.scrollTo(0, 0)}>
            <img
              className="bg-pop text-center w-full"
              src={item.image}
              placeholder="pop"
            />
            <div className="">
              <div className="flex justify-between ...">
                <div className=" text-xl font-bold  hover: text-black">Pop</div>
                <p className="font-bold text-rose-700">#{item.tokenId}</p>
              </div>
              <div className="flex justify-between  hover: text-black">
                <div>Owner</div>
                <p>{AddressMini(item.auctioneer)}</p>
              </div>
              <div className="flex">
                <img
                  className="w-6 h-6 pt-1"
                  src="/image/unnamed.png"
                />
                <p className="text-black px-2 font-bold text-lg">
                  {item.lastBid} BNB
                </p>
              </div>
            </div>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default LargestSales