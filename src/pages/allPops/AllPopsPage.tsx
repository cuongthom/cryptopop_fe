import React, { useEffect, useState } from "react";
import { useAccount, useContractReads, useQuery } from "wagmi";
import {
  AUCTION_CONTRACT_ABI,
  AUCTION_CONTRACT_ADDRESS,
  MARKET_CONTRACT_ABI,
  MARKET_CONTRACT_ADDRESS
} from "../../contracts";
import { ethers } from "ethers";
import { Col, Dropdown, MenuProps, Row, Skeleton, Space } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "react-router-dom";
import { AddressMini } from "../../utils";
import "./allPops.css";
import popApi from "../../services/popApi";
import TabAuctionMarket from "../../components/tabAuctionMarket/TabAuctionMarket";
import { API_URL } from "../../constants";
import useDebounce from "../../hook/useDebounce";

const AllPopsPage = () => {
  const { connector: activeConnector, isConnected, address } = useAccount();
// search
  let [searchParams, setSearchParams] = useSearchParams();
  console.log("searchParams",searchParams);
  
  const params :any = searchParams.get("tab") || "auction"
  const [querySearch, setQuerySearch] = useState(searchParams.get('search') );
  const searchQuery = (e: any) => {
    const newQuery = e.target.value;
    setQuerySearch(newQuery);
    setSearchParams({
      search: newQuery , tab: params
    })
  }
  const [querySearchType, setQuerySearchType] = useState(searchParams.get('type') );
  const typeSearch = (value :any) => {
    setQuerySearchType(value)
    setSearchParams({
      type: value , tab: params
    })
  }
  const [querySearchAttribute, setQuerySearchAttribute] = useState(searchParams.get('attribute'));
  const attributeSearch = (value :any) => {
    setQuerySearchAttribute(value)
    setSearchParams({
      attribute: value,tab: params
    })
  }
  const [listDataType, setListDataType] = useState<any>([])
  const [listDataValue, setListDataValue] = useState<any>([])
  const debounceSearchValue: any = useDebounce(querySearch, 500)
  const searchAttributeType: any = useDebounce(querySearchType, 500)
  const searchAttributeValue: any = useDebounce(querySearchAttribute, 500)
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

  // data search
  const {
    data: dataSearch = [],
    isLoading: isLoadingSearch,
    isError: isErrSearch,
  } = useQuery(['search', debounceSearchValue], ({ queryKey }) =>
    popApi.getNftAttributesSearch(queryKey[1])
  )
  const {
    data: dataSearchType = [],
    isLoading: isLoadingSearchType,
    isError: isErrSearchType,
  } = useQuery(['searchType', searchAttributeType], ({ queryKey }) =>
    popApi.getNftAttributesSearchType(queryKey[1])
  )
  const {
    data: dataSearchAttribute = [],
    isLoading: isLoadingSearchValue,
    isError: isErrSearchValue,
  } = useQuery(['searchAttribute', searchAttributeValue], ({ queryKey }) =>
    popApi.getNftAttributesSearchValue(queryKey[1])
  )


  const normalizeData = async (data: any) => {
    const listedNft = data[0] || [];
    const auctionNft = data[1] || [];
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
    const listMarkets = await Promise.all(listedNft.map(async (item: any) => {
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
    isLoading: isNormalizingLoading,
    isError: isNormalizingDataError,
  } = useQuery(['allPops.normalizeData', data], ({ queryKey }) => {
    return normalizeData(queryKey[1])
  })

  const listDataAttributeType = () => {
    const data: any[] = [];
    for (let i = 0; i < normalizedData.listAuctions.length; i++) {
      for (let e = 0; e < normalizedData.listAuctions[i].attributes.length; e++) {
        if (!data.includes(normalizedData.listAuctions[i].attributes[e].type)) {
          data.push(normalizedData.listAuctions[i].attributes[e].type)
        }
      }
    }
    setListDataType(data)
  }
  const listDataAttributeValue = () => {
    const data: any[] = [];
    for (let i = 0; i < normalizedData.listAuctions.length; i++) {
      for (let e = 0; e < normalizedData.listAuctions[i].attributes.length; e++) {
        if (!data.includes(normalizedData.listAuctions[i].attributes[e].value)) {

          data.push(normalizedData.listAuctions[i].attributes[e].value)
        }
      }
    }
    setListDataValue(data)
  }
  useEffect(() => {
    if (!isConnected) return
    listDataAttributeType()
    listDataAttributeValue()
  }, [])

  const dropdown1Items = listDataType.map((item: any, index: any) => ({
    label: <p onClick={() => typeSearch(item)}>{item}</p>,
    key: index
  }))

  const dropdown2Items = listDataValue.map((item: any, index: any) => ({
    label: <p onClick={() => attributeSearch(item)}>{item}</p>,
    key: index
  }))

  return (
    <section className="mx-20">
      <div className="flex justify-between py-6">
        <div className="text-base font-bold">Cryptopops | All Pops</div>
        <div className="flex border rounded-md border-black">
          <img
            className="w-10 h-6 mt-1 px-2"
            src="/image/free-search-icon-3076-thumb.png"
          />
          <input
            type="text"
            onChange={searchQuery}
            src="BsSearch"
            className=" w-80 h-8 rounded focus:outline-none"
            placeholder="Search Pops"
          />
        </div>
      </div>
      <div className="text-3xl font-bold py-6 flex justify-between">
        <div>
          <h2>All Pops</h2>
        </div>
        <div className="flex">
          <div className="py-2.5">
            <p className="text-lg">Filter By</p>
          </div>
          <div>
            <Dropdown className="px-4" menu={{ items: dropdown1Items }} trigger={["click"]} >
              <a onClick={(e) => e.preventDefault()}>
                <Space className="w-28 border rounded-md border-black justify-between px-2 pl-4">
                  <p className="text-end ">{querySearchType || "type"}</p>
                  <DownOutlined className="text-end justify-end" />
                </Space>
              </a>
            </Dropdown>
            <Dropdown menu={{ items: dropdown2Items }} trigger={["click"]}>
              <a onClick={(e) => e.preventDefault()}>
                <Space className="w-28 border rounded-md border-black justify-between px-2 pl-4">
                  <p className="text-end overflow-hidden text-ellipsis whitespace-nowrap">{querySearchAttribute || "attribute"}</p>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
      <TabAuctionMarket searchParams={searchParams} setSearchParams={setSearchParams}  dataSearchAttribute={dataSearchAttribute} dataSearchType={dataSearchType} dataSearch={dataSearch} normalizedData={normalizedData} isNormalizingLoading={isNormalizingLoading} isNormalizingDataError={isNormalizingDataError} />
    </section>
  );
}
export default AllPopsPage;
