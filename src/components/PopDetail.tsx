import {useContractRead, useQuery} from "wagmi";
import popApi from "../services/popApi";
import {Button, Col, Image, Row, Skeleton} from "antd";
import {minimizeAddress} from "../utils";
import {ARTWORK_CONTRACT_ABI, ARTWORK_CONTRACT_ADDRESS} from "../contracts";
import './waletButton.css'

const PopDetail = ({id}: any) => {
  const {
    data: popMetadata = {},
    isLoading,
    isError
  }: any = useQuery(['popApi.getNftMetaData', id], ({queryKey}) => popApi.getNftMetaData(queryKey[1]));

  
  const {data: tokenOwner = "", isLoading: isLoadingTokenOwner, isError: isErrorTokenOwner} = useContractRead({
    address: ARTWORK_CONTRACT_ADDRESS,
    abi: ARTWORK_CONTRACT_ABI,
    functionName: 'ownerOf',
    args: [id]
  })
  return (
    <section className=' text-xl pb-4 absolute z-0 w-3/4'>
      {
        isLoading ? <Skeleton active/> : isError ? (
          <Row className="z-0" gutter={24}>
            <Col span={12}>
              <Image className="bg-pop" src="/image/placeholder.png"/>
            </Col>
            <Col className="h-2" span={12}>
              <h3>{popMetadata.name} <span className='text-red-500 '>#{id}</span></h3>
            </Col>
          </Row>
        ) : (
          <Row className="z-0" gutter={24}>
            <Col span={12} className='flex w-full'>
              <Image className="bg-pop" src={popMetadata.image} alt='pop-img' preview={false} height={463}/>
            </Col>
            <Col span={12} className='text-xl'>
              <h3>{popMetadata.name} <span className='text-red-500'>#{id}</span></h3>
              <div className='pb-4'>
                {
                  isLoadingTokenOwner ?
                    <Skeleton active/> : isErrorTokenOwner ? "Unknown" : (
                      <p>
                        Owned by: <a href="#" className='text-red-500 px-2'>
                        {minimizeAddress(tokenOwner as string)}
                      </a>
                      </p>
                    )
                }
              </div>
              <p>
                This pop has <span className='text-red-500'>{popMetadata.attributes.length} attributes</span> (one of
                ... of this many).
              </p>
              {
                popMetadata.attributes.map((item: any) => (
                  <p key={item.trait} className='py-1'>
                    <a href="#" className='text-red-500'>{item.value}</a> (11)
                  </p>
                ))
              }
            </Col>
          </Row>
        )
      }
    </section>
  )
}

export default PopDetail;
