import { ethers } from 'ethers';
import { Link, useSearchParams } from 'react-router-dom'
import { AUCTION_CONTRACT_ABI, AUCTION_CONTRACT_ADDRESS, MARKET_CONTRACT_ABI, MARKET_CONTRACT_ADDRESS } from '../../contracts';
import { useAccount, useContractReads, useQuery } from 'wagmi';
import type { MenuProps } from "antd";
import popApi from '../../services/popApi';
import TabAuctionMarket from '../../components/tabAuctionMarket/TabAuctionMarket';
import { useState } from 'react';
import useDebounce from '../../hook/useDebounce';

function MyShop() {
    let [searchParams, setSearchParams] = useSearchParams();
    const params = searchParams.get("tab") || "auction"
    const [querySearch, setQuerySearch] = useState(searchParams.get('search') );
    const searchQuery = (e: any) => {
      const newQuery = e.target.value;
      setQuerySearch(newQuery);
      setSearchParams({
        search: newQuery , tab: params
      })
    }

    const debounceSearchValue: any = useDebounce(querySearch, 500)
    const {
        data: dataSearch = [],
        isLoading: isLoadingSearch,
        isError: isErrSearch,
      } = useQuery(['search', debounceSearchValue], ({ queryKey }) =>
        popApi.getNftAttributesSearch(queryKey[1])
      )
    const { connector: activeConnector, isConnected, address } = useAccount();
    const { data = [], isError, isLoading, refetch }: any = useContractReads({
        contracts: [
            {
                address: MARKET_CONTRACT_ADDRESS,
                abi: MARKET_CONTRACT_ABI,
                functionName: 'getAllListedNfts',
            },
            {
                address: AUCTION_CONTRACT_ADDRESS,
                abi: AUCTION_CONTRACT_ABI,
                functionName: 'getAllAuction',
            },
        ],
    })

    //get token metadata and normalize data
    const normalizeData = async (data: any) => {
        const listedNft = data[0] || [];
        const auctionNft = data[1] || [];
        const activeAuctions = auctionNft.filter((item: any) => item[9] === true && item[0] === address);
        const listAuctions = await Promise.all(activeAuctions.map(async (item: any) => {
            const tokenId = item[1].toNumber();
            const endTime = item[7].toNumber();
            const startTime = item[6].toNumber();
            const initialPrice = ethers.utils.formatEther(item[2]);
            const lastBid = ethers.utils.formatEther(item[4]);
            try {
                //fetch token metadata
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

        const listMarkets = await Promise.all(listedNft.filter((index: any) => index[0] === address).map(async (item: any) => {
            const price = ethers.utils.formatEther(item[1]);
            const tokenId = item[2].toNumber();
            //try to fetch token metadata
            try {
                const metadata = await popApi.getNftMetaData(tokenId);
                return {
                    tokenId,
                    price,
                    author: item[0],
                    ...metadata,
                }
            } catch (err) {
                return {
                    tokenId,
                    price,
                    author: item[0],
                    attributes: [],
                    description: "",
                    image: "/image/placeholder.png",
                    title: "Unknown",
                    name: "Unknown",
                }
            }
        }));
        return { listAuctions, listMarkets }
    }
    //use useQuery to fetch data
    const {
        data: normalizedData = { listAuctions: [], listMarkets: [] },
        isLoading: isNormalizingData,
        isError: isNormalizingDataError,
    } = useQuery(['myShop.normalizeData', data], ({ queryKey }) => normalizeData(queryKey[1]))

    
    return (
        <div className='py-4 flex'>
            <div className='w-1/4 text-center'>
                <div>
                    <Link to="/my-nfts" className='text-xl font-bold'>My NFTs</Link>
                </div>
                <div className='py-4'>
                    <Link to="/my-shop" className='text-xl font-bold'>MyShop</Link>
                </div>
            </div>
            <hr className='flex text-red-400' />
            <div className='w-3/4'>
                <div className="flex ">
                    <div className="text-lg font-bold pr-60">Cryptopops | All My Shop</div>
                    {/* <div className="flex border rounded-md border-black h-9 ml-40 ">
                        <img
                            className="w-10 h-6 px-2 my-1.5"
                            src="/image/free-search-icon-3076-thumb.png"
                        />
                        <input
                            type="text"
                            onChange={searchQuery}
                            src="BsSearch"
                            className=" w-60 h-8 rounded focus:outline-none"
                            placeholder="Search Pops"
                        />
                    </div> */}
                </div>
                <TabAuctionMarket dataSearch={dataSearch} searchParams={searchParams} setSearchParams={setSearchParams} isNormalizingData={isNormalizingData} normalizedData={normalizedData} isNormalizingDataError={isNormalizingDataError}/>
            </div>
        </div>
    )
}

export default MyShop