import { Col, Row } from 'antd'
import React from 'react'
import appRoutes from '../../routes';
import { Link } from 'react-router-dom';

function AttributeImage(image :any,index :any ) {
  return (
    <Col key={index} className="gutter-row py-4 px-2 mg" span={4}>
                  <img
                    className="text-center w-40 bg-pop "
                    src={image?.image?.image?.path}
                  />
              </Col>
  )
}

export default AttributeImage