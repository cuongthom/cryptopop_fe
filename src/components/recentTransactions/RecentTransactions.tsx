import { Col, Row } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import appRoutes from '../../routes'
import { AddressMini } from '../../utils'
import './RecentTransaction.css'
function RecentTransactions({ normalizedData }: any) {
  return (
    <div>
      <div>
        <p className="pt-6 text-3xl font-bold">Recent Transactions</p>
      </div>
      <Row gutter={{ xs: 4, lg: 8, xl: 16, xxl: 20 }} className="py-10">
        {normalizedData?.listAuctions.filter((index: any) => index.name !== "Unknown" && index.lastBidder !== "0x0000000000000000000000000000000000000000").map((item: any) => (
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

export default RecentTransactions