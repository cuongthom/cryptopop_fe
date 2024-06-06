import { useSearchParams } from 'react-router-dom';
import AuctionTab from '../../pages/allPops/tabs/AuctionTab'
import MarketTab from '../../pages/allPops/tabs/MarketTab'
import { Skeleton } from 'antd'
import { useEffect, useState, useRef } from 'react';

function TabAuctionMarket({ searchParams, setSearchParams, dataSearchAttribute, dataSearchType, dataSearch, normalizedData, isNormalizingData, isNormalizingDataError }: any) { 
    const tabParams: any = searchParams.get("tab") || "auction"

    

    
    return (
        <div>
            <div className="flex justify-center h-12 my-6 ">
                <button
                    className={tabParams === 'auction' ? "focus-bt w-1/4" : "bg-bt-tab w-1/4"}
                    onClick={() => setSearchParams({ tab: 'auction' })}
                >
                    <p className="text-xl text-center py-2">On Auction</p>
                </button>
                <button
                    className={tabParams === "market" ? "focus-bt w-1/4" : "bg-bt-tab w-1/4"}
                    onClick={() => setSearchParams({ tab: "market" })}
                >
                    <p className="text-xl text-center py-2">On MarketPlace</p>
                </button>
            </div>
            <hr className="my-4" />
            {
                isNormalizingData ? <Skeleton active /> : isNormalizingDataError ? <p>Some error happens</p> : (
                    <div className='mr-4'>
                        {tabParams === 'auction' ? (
                            <AuctionTab dataSearchAttribute={dataSearchAttribute} dataSearchType={dataSearchType} dataSearch={dataSearch} listAuction={normalizedData.listAuctions} />
                        ) : (
                            <MarketTab dataSearchAttribute={dataSearchAttribute} dataSearchType={dataSearchType} dataSearch={dataSearch} listMarket={normalizedData.listMarkets} />
                        )}
                    </div>
                )
            }
        </div>
    )
}

export default TabAuctionMarket