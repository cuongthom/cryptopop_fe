import { Modal } from 'antd'
import React, { useEffect, useState } from "react";
import { Fragment, useRef, } from 'react'
import './LoadingPage.css'
function LoadingPage() {


  return (
      <div className="lds-facebook ">
        <div></div>
        <div></div>
        <div></div>
      </div>
  )
}

export default LoadingPage