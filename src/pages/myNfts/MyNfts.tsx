import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccount, useContractRead, useContractReads, useContractWrite, usePrepareContractWrite, useQuery } from 'wagmi'
import { ARTWORK_CONTRACT_ABI, ARTWORK_CONTRACT_ADDRESS } from '../../contracts'
import { Col, Row, message, Skeleton } from 'antd';
import popApi from '../../services/popApi'
import { BigNumber } from "ethers";
import routes from "../../routes";
import { AddressMini } from "../../utils";
import appRoutes from "../../routes";
import './MyNfts.css'
const artWorkContract: any = {
  address: ARTWORK_CONTRACT_ADDRESS,
  abi: ARTWORK_CONTRACT_ABI,
}

function MyNfts() {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const { address }: any = useAccount();
  const {
    data: artWorkData = [],
    isError: isErrorArtWorkData,
    isLoading: isLoadingArtWorkData,
    refetch: reFetchArtWorkData
  }: any = useContractReads({
    contracts: [
      {
        ...artWorkContract,
        functionName: 'blindBox', //show user unopen box
        args: [address || ""]
      },
      {
        ...artWorkContract,
        functionName: 'blindBoxOpenFee',
      },
      {
        ...artWorkContract,
        functionName: 'getNftListByAddress',
        args: [address || ""]
      },
    ],
  })

  //normilize data
  const unOpenBox = artWorkData[0] ? artWorkData[0].toNumber() : 0;
  const openBoxFee = artWorkData[1] ? artWorkData[1] : BigNumber.from("0");
  const listUserPopIds = artWorkData[2] ? artWorkData[2].map((item: BigNumber) => item.toNumber()) : [];
  const getMultipleNftMetaData = async (ids: number[]) => {
    const res = await Promise.all(ids.map(async (id) => {
      try {
        return await popApi.getNftMetaData(id)
      } catch (err) {
        console.log(err)
        return {
          attributes: [],
          description: "",
          image: "/image/placeholder.png",
          name: "Unknown",
          tokenId: id,
        }
      }
    }))
    return res;

  }
  //call api to get metadata
  const {
    data: listPopMetaData = [],
    isError: isErrorListPopMetaData,
    isLoading: isLoadingListPopMetaData
  } = useQuery(["getMultipleNftMetaData", listUserPopIds], ({ queryKey }) => getMultipleNftMetaData(queryKey[1]))
  //init write contract



  const { config, error: errorConfig }: any = usePrepareContractWrite({
    ...artWorkContract,
    functionName: 'openBlindBox',
    args: [1],
    overrides: {
      value: openBoxFee || ""
    }
  })

  const { writeAsync } = useContractWrite(config)
  const handleOpenBox = async () => {
    try {
      setLoading(true)
      if (!writeAsync) {
        throw new Error("Please connect wallet then try again")
      }
      if (unOpenBox <= 0) {
        throw new Error("You don't have any unopen box")
      }
      const tx = await writeAsync()
      await tx.wait()
      //refetch data
      await reFetchArtWorkData()
      //show success message
      messageApi.success('Opened box successfully');
    } catch (err: any) {
      console.log(err)
      messageApi.error('Opened box failed ' + err.message);
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='py-4 flex'>
      <div className='w-1/4 h-full text-center'>
        <div>
          <Link to={routes.myNfts.path} className='text-xl font-bold'>My NFTs</Link>
        </div>
        <div className='py-4'>
          <Link to={routes.myShop.path} className='text-xl font-bold'>MyShop</Link>
        </div>
      </div>

      <div className='w-3/4 mr-6'>
        <div className="flex">
          <div className="text-lg font-bold pr-60">Cryptopops | All Pops</div>
          <div className="flex border rounded-md border-black h-9 ml-48 ">
            <img
              className="w-10 h-6 px-2 my-1.5"
              src="/image/free-search-icon-3076-thumb.png"
            />
            <input
              type="text"
              // onChange={(e: any) => setSearchParams({ search: e.target.value })}
              src="BsSearch"
              className=" w-60 h-8 rounded focus:outline-none "
              placeholder="Search Pops"
            />
          </div>
        </div>
        <div className='flex py-6'>
          <p className='text-3xl font-semibold'>Unopened boxes:</p>
          <p className='text-3xl px-6 font-semibold'> {unOpenBox}</p>
          <div onClick={handleOpenBox} className='border rounded-md border-black bg-black'>
            <button disabled={loading}
              className='text-lg py-1 text-white px-2'>{loading ? "Opening..." : "Open Box"}</button>
          </div>
        </div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="py-2 w-full ">
          {isLoadingListPopMetaData ? <Skeleton active /> : isErrorListPopMetaData ? <div>error</div> :
            listPopMetaData.map((item: any) => (
              <Col key={item.tokenId} className="gutter-row py-4 px-2" span={6}>
                <Link to={appRoutes.popDetail.getPath(item.tokenId)} onClick={() => window.scrollTo(0, 0)}>
                  <img
                    className="text-center w-40 bg-pop mr-8"
                    src={item.image}
                  />
                  <div className="py-2 w-40">
                    <div className="flex justify-between">
                      <div className="font-bold text-lg hover: text-black ">{item.name}</div>
                      <div className="text-rose-700 text-lg px-2"># {item.tokenId}</div>
                    </div>
                    <div className="flex justify-between hover: text-black">
                      <p>Owner</p>
                      <p> {AddressMini(address)}</p>
                    </div>

                  </div>
                </Link>
              </Col>
            ))
          }
        </Row>
      </div>
      {contextHolder}
    </div>
  )
}

export default MyNfts
