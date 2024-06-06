import { Col, Row } from "antd";
import React from "react";
import AttributeImage from "../../components/attributeImage/AttributeImage";
import { useQuery } from "wagmi";
import popApi from "../../services/popApi";
import './AttributesPage.css'


function AttributesPage() {
  const {
    data: normalizedData,
    isLoading: isNormalizingData,
    isError: isNormalizingDataError,
  }: any = useQuery(['attribute'], () => {
    return popApi.getNftAttributesSearchType('gender')
  })


  return (
    <section className="mx-20">
      <div className=" py-5">
        <div className="text-base font-bold">Cryptopops | Attributes</div>
        <h2 className="text-3xl font-bold py-8">Types and Attributes</h2>
      </div>
      <div>
        <p className="font-bold text-2xl">Pop Types</p>
        <div>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="py-6 w-full mg">
            {normalizedData.data.map((item: any, index: any) => (
              <AttributeImage image={item?.nft} index={index} />
            ))}
          </Row>
        </div>
      </div>
      {/* <div>
        <p className="font-bold text-2xl">Attributes</p>
        <div>
          <AttributeImage />
        </div>
      </div> */}
    </section>
  );
}

export default AttributesPage;
