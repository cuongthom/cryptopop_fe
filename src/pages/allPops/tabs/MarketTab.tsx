import { Col, Row, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { AddressMini } from "../../../utils";
import appRoutes from "../../../routes";
import '../../../components/waletButton.css'
import { useEffect, useState } from "react";

const MarketTab = ({ dataSearch, dataSearchAttribute, dataSearchType, listMarket }: any) => {
  const [dataNew, setDataNew] = useState<any>(null)
  const data = async () => {
    try {
      if (dataSearch.result[0]) {
        const dataIdSearch = await dataSearch?.result?.map((item: any) => item?.tokenId)
        const newData = await listMarket?.filter((item: any) => dataIdSearch?.includes(item?.tokenId))
        setDataNew(newData)
      } else if (dataSearchAttribute?.data[0].nft) {
        const dataType = await dataSearchAttribute?.data?.map((item: any) => item?.nft?.tokenId)
        const newData = await listMarket?.filter((item: any) => dataType?.includes(item?.tokenId))
        setDataNew(newData)
      } else if (dataSearchType?.data[0].nft) {
        const dataType = await dataSearchType?.data?.map((item: any) => item?.nft?.tokenId)
        const newData = await listMarket?.filter((item: any) => dataType?.includes(item?.tokenId))
        setDataNew(newData)
      }
    } catch (error: any) {
      console.log(error.messenger);

    }
  }
  useEffect(() => {
    if (!dataSearch || !dataSearchAttribute || !dataSearchType) return
    data()
  }, [dataSearch, dataSearchAttribute, dataSearchType])


  return (

    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="py-2 mx-2">
      {!dataNew ?
        listMarket.filter((index: any) => index.name !== "Unknown").map((item: any) => (
          <Col className="gutter-row mx-4 py-2" span={4} key={item.tokenId}>
            <Link to={appRoutes.marketDetail.getPath(item.tokenId)} onClick={() => window.scrollTo(0, 0)}>
              <div key={item.tokenId}>
                <img
                  className="bg-image text-center w-full bg-pop"
                  src={item.image}
                />
                <div className="py-2">
                  <div className="flex justify-between ...">
                    <div className="font-bold text-lg hover: text-black ">{item.name}</div>
                    <div className="text-rose-700 text-lg">#{item.tokenId}</div>
                  </div>
                  <div className="flex justify-between hover: text-black ">
                    <div>Owner</div>
                    <div>{AddressMini(item.author)}</div>
                  </div>
                  <div className="flex">
                    <img
                      className="w-7 h-7 pt-1"
                      src="/image/unnamed.png"
                    />
                    <p className="text-black font-bold px-2 text-lg overflow-hidden whitespace-nowrap">{item.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        )) : dataNew?.filter((index: any) => index.name !== "Unknown").map((item: any) => (
          <Col className="gutter-row mx-4 py-2" span={4} key={item.tokenId}>
            <Link to={appRoutes.marketDetail.getPath(item.tokenId)} onClick={() => window.scrollTo(0, 0)}>
              <div key={item.tokenId}>
                <img
                  className="bg-image text-center w-full bg-pop"
                  src={item.image}
                />
                <div className="py-2">
                  <div className="flex justify-between ...">
                    <div className="font-bold text-lg hover: text-black ">{item.name}</div>
                    <div className="text-rose-700 text-lg">#{item.tokenId}</div>
                  </div>
                  <div className="flex justify-between hover: text-black ">
                    <div>Owner</div>
                    <div>{AddressMini(item.author)}</div>
                  </div>
                  <div className="flex">
                    <img
                      className="w-7 h-7 pt-1"
                      src="/image/unnamed.png"
                    />
                    <p className="text-black font-bold px-2 text-lg overflow-hidden whitespace-nowrap">{item.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          </Col>
        ))
      }
    </Row>
  )
}

export default MarketTab
