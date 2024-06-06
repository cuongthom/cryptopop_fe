import { Col, Row } from 'antd'
import React from 'react'

function OverallStats() {
  return (
    <div>
          <h2 className="py-10 text-3xl font-bold">Overall Stats</h2>

          <Row>
            <Col span={8}>
              <p className="text-slate-500 text-lg">
                Number of Sales (Last 12 Months)
              </p>
              <p className="text-xl font-normal">16</p>
            </Col>
            <Col span={8}>
              <p className="text-lg text-slate-500">
                Total Value of All Sales (Lifetime)
              </p>
              <p className="text-xl font-normal">13.55994KΞ BNB</p>
            </Col>
            <Col span={8}></Col>
          </Row>
          <Row className="py-8">
            <Col span={8}>
              <p className="text-lg text-slate-500">
                Value of Sales (24 Hours)
              </p>
              <p className="text-xl font-normal">0KΞ BNB</p>
            </Col>
            <Col span={8}>
              <p className="text-lg text-slate-500">Value of Sales (Week)</p>
              <p className="text-xl font-normal">0KΞ BNB</p>
            </Col>
            <Col span={8}>
              <p className="text-lg text-slate-500">Value of Sales (4 Weeks)</p>
              <p className="text-xl font-normal">0KΞ BNB</p>
            </Col>
          </Row>
          <div className="py-8 ">
            <button className="  text-white w-1/2 pr-6">
              <p className="bg h-10 text-lg text-start py-1.5 rounded-3xl px-4">
                Top Pops Owner
              </p>
            </button>

            <button className=" text-white w-1/2 pl-6 ">
              <p className=" bg h-10 text-lg text-start py-1.5 rounded-3xl px-4">
                All Pops Types And Attributes
              </p>
            </button>
          </div>
        </div>
  )
}

export default OverallStats