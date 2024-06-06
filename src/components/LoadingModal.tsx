import { Modal } from 'antd'
import React from 'react'
import './waletButton.css'
function LoadingModal({loading} :any) {
  return (
    <Modal open={loading} footer={[]} closable={false}>
      <img src='/image/phy.gif'/>
    </Modal>
  )
}

export default LoadingModal